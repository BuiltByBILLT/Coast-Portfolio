import asyncHandler from 'express-async-handler'
import Po from '../models/poModel.js'
import mailjet from 'node-mailjet'

// @desc Fetch all po
// @route GET /api/pos/
// @access Public
const getPos = asyncHandler(async (req, res) => {
    const po = await Po.find({}).sort({ poID: 1 })
    res.json(po)
})

// @desc Fetch single po for Edit
// @route GET /api/pos/edit/:id
// @access Staff
const getPo = asyncHandler(async (req, res) => {
    const po = await Po.findOne({ poID: req.params.id })
    if (po) { res.json(po) }
    else { throw new Error('Po not found') }

})

// @desc Create a new po
// @route POST /api/pos
// @access Staff
const newPo = asyncHandler(async (req, res) => {
    console.log(req.body.poShipTo)
    const po = await Po.create(req.body)
    if (po) {
        try {
            const mj = await mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
            const request = await mj
                .post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [{
                        "From": {
                            "Email": "hello@sprinklesmedia.com",
                            "Name": "Sprinkles Media"
                        },
                        "To": [{
                            "Email": req.body.poEmail,
                            "Name": ""
                        }],
                        "Subject": "Purchase Order Request",
                        "HTMLPart": req.body.poHtml + `<br /><div>${req.body.poShipTo}</div>`,
                    }]
                })
            res.json(po)
        } catch (error) {
            throw new Error('Email not sent')
        }
    }
    else { throw new Error('Po Data Invalid') }

})

// @desc Update single po
// @route PUT /api/pos/edit/:id
// @access Staff
const updatePo = asyncHandler(async (req, res) => {
    const po = await Po.findOneAndUpdate({ poID: req.params.id }, req.body)
    if (po) { res.json(po) }
    else { throw new Error('Po not found') }
})

// @desc Delete single po
// @route DELETE /api/pos/edit/:id
// @access Staff
const deletePo = asyncHandler(async (req, res) => {
    const po = await Po.findOneAndDelete({ poID: req.params.id })
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