import asyncHandler from 'express-async-handler'
import Po from '../models/poModel.js'
import Merchant from '../models/merchantModel.js'
import Inventory from '../models/inventoryModel.js'
import mailjet from 'node-mailjet'
import { parse } from 'json2csv';
import fs from 'fs'
import axios from 'axios'

// @desc Fetch all po
// @route GET /api/pos/
// @access Public
const getPos = asyncHandler(async (req, res) => {
    const pos = await Po.find({}).sort({ updatedAt: -1 })
    res.json(pos)
})

// @desc Fetch single po for Edit
// @route GET /api/pos/edit/:id
// @access Staff
const getPo = asyncHandler(async (req, res) => {
    const po = await Po.findOne({ _id: req.params.id })
    if (po) { res.json(po) }
    else { throw new Error('Po not found') }

})

// @desc Create a new po
// @route POST /api/pos
// @access Staff
const newPo = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { merchantName, merchantEmail, merchantAddress, replyToEmail, shipToAddress, poDate, emailHtml, lineItems } = req.body
    try {
        const merchant = await Merchant.findOneAndUpdate({ merchantName: merchantName }, req.body)
    } catch (error) {
        throw new Error('Merchant Not Found')
    }
    let csv64 = ""
    try {
        const csv = parse(lineItems);
        fs.writeFileSync("temp.csv", csv); // ?
        let buf = Buffer.from(csv)
        csv64 = buf.toString('base64');
        // var tmp = bitmap.toString().replace(/[“”‘’]/g, '');
    } catch (err) {
        console.log(err)
        throw new Error('CSV Conversion Failed')
    }

    const po = await Po.create(req.body)
    if (po) {
        try {
            const mj = mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
            const request = await mj
                .post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [{
                        "From": {
                            "Email": replyToEmail,
                            "Name": "Sprinkles Media"
                        },
                        "To": [{
                            "Email": merchantEmail,
                            "Name": ""
                        }],
                        // "Bcc": [{
                        // "Email": replyToEmail,
                        // "Name": ""
                        // }],                        
                        "Subject": "Purchase Order Request",
                        "HTMLPart":
                            `<h2>Purchase Order #${po._id}</h2><br />` + emailHtml.replace(
                                '<td class="p-0  align-middle text-center"><button type="button" class="btn-sm btn btn-danger"><i class="fas fa-trash"></i></button></td>', ""
                            ) + `<br /><div>${shipToAddress}</div>`,
                        "Attachments": [
                            {
                                "ContentType": "text/csv",
                                // "Filename": `Coast Purchase Order ${poDate.replace('/', '-')}.csv`,
                                "Filename": `Coast Purchase Order ${poDate}.csv`,
                                "Base64Content": csv64
                            }],
                    }]
                })

            let response = await JSON.parse(request.response.text)
            po.emailURL = response.Messages[0].To[0].MessageHref
            // console.log(po.lineItems)
            po.status = "ORDERED"
            await po.save()


            res.json({ request, po })
        } catch (error) { throw new Error('Email not sent') }
    }
    else { throw new Error('Po Data Invalid') }
})

// @desc Update single po
// @route PUT /api/pos/edit/:id
// @access Staff
const updatePo = asyncHandler(async (req, res) => {
    // if (req.body.lineItems.find(row => !row.cloverID)) throw new Error('Please fill in all CloverID fields')
    for (const row of req.body.lineItems) {
        if (!row.cloverID) throw new Error('Please fill in all CloverID fields')
        const inv = await Inventory.findOne({ cloverID: row.cloverID })
        if (!inv) throw new Error(`Invalid Clover ID ${row.cloverID}`)
    }

    // Remember SKU
    const merchant = await Merchant.findOne({ merchantName: req.body.merchantName })
    if (!merchant) throw new Error("Merchant Not Found")
    for (const row of req.body.lineItems) {
        const inv = await Inventory.findOne({ cloverID: row.cloverID })
        merchant.merchantItems.forEach(merchantItem => {
            if (merchantItem.sku == row.sku) merchantItem.cloverID = row.cloverID
        });
    }
    await merchant.save()

    // Update Qty
    for (const row of req.body.lineItems) {
        // Update Qty in Mongo
        const inv = await Inventory.findOne({ cloverID: row.cloverID })
        inv.iStock = inv.iStock + row.qty
        inv.save()

        // Update Clover API stock
        const res = await axios.post(
            process.env.CLOVER_URL + `/item_stocks/${row.cloverID}`,
            { "quantity": inv.iStock },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        await new Promise(r => setTimeout(r, 200)); // Pause for congestion
    }

    //Save PO
    const po = await Po.findOneAndUpdate({ _id: req.params.id }, req.body)
    if (po) { res.json(po) }
    else { throw new Error('Po not found') }
})

// @desc Delete single po
// @route DELETE /api/pos/edit/:id
// @access Staff
const deletePo = asyncHandler(async (req, res) => {
    const po = await Po.findOneAndDelete({ _id: req.params.id })
    if (po) { res.json(po) }
    else { throw new Error('Po not found') }
})

export {
    getPos,
    getPo,
    newPo,
    updatePo,
    deletePo,
}