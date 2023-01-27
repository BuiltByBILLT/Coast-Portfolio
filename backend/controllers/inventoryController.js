import asyncHandler from 'express-async-handler'
import Inventory from '../models/inventoryModel.js'
import axios from 'axios'

// @desc Fetch all Inventory Items
// @route GET /api/inventory/
// @access Public
const getInventory = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 100
    const page = Number(req.query.pageNumber) || 1

    // If Keyword
    const keyword = req.query.keyword ? {
        $or: [
            { cloverName: { $regex: req.query.keyword, $options: 'i' } },
            { cloverID: { $regex: req.query.keyword, $options: 'i' } },
            { cloverSku: { $regex: req.query.keyword, $options: 'i' } },
        ]
    } : {}

    const count = await Inventory.countDocuments({ ...keyword })
    const inventory = await Inventory.find({ ...keyword })
        .sort({ updatedAt: -1 })
        .limit(pageSize).skip(pageSize * (page - 1))

    res.json({ inventory, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch All CloverID's
// @route GET /api/inventory/cloverids
// @access Staff
const getCloverIDs = asyncHandler(async (req, res) => {
    const inventory = await Inventory.find({}, {
        _id: 0, cloverID: 1, cloverSku: 1, cloverPrice: 1, cloverName: 1
    })

    if (inventory) { res.json(inventory) }
    else { throw new Error('CloverIDs not found') }
})

// @desc Fetch single inventory for Edit
// @route GET /api/inventory/edit/:id
// @access Staff
const getInventoryItem = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({ cloverID: req.params.id })
    if (inventory) { res.json(inventory) }
    else { throw new Error('Inventory not found') }
})

// ====================================================================================
// ============================ Edit With Clover Sync =================================
// ====================================================================================


// @desc Create a new inventory
// @route POST /api/inventory/new
// @access Staff
const newInventory = asyncHandler(async (req, res) => {
    try {
        // Clover First
        const res1 = await axios.post(
            process.env.CLOVER_URL + `/items`,
            {
                "price": req.body.cloverPrice,
                "sku": req.body.cloverSku,
                "name": req.body.cloverName
            },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }

        )
        const res2 = await axios.post(
            process.env.CLOVER_URL + `/item_stocks/${res1.data.id}`,
            { "quantity": req.body.iStock },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )

        // Mongo Next
        const inventory = await Inventory.create({ ...req.body, cloverID: res1.data.id })
        if (inventory) { res.json(inventory) }
        else { throw new Error('Inventory Data Invalid') }

    } catch (error) {
        throw new Error(error.response && error.response.data.message
            ? error.response.data.message : error.message)
    }
})

// @desc Update single inventory
// @route PUT /api/inventory/edit/:id
// @access Staff
const updateInventory = asyncHandler(async (req, res) => {
    const { cloverPrice, cloverSku, cloverName, iStock } = req.body
    try {
        // Clover First
        if (cloverPrice || cloverSku || cloverName) {
            const res1 = await axios.post(
                process.env.CLOVER_URL + `/items/${req.params.id}`,
                {
                    "price": req.body.cloverPrice,
                    "sku": req.body.cloverSku,
                    "name": req.body.cloverName
                },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
        }
        if (iStock) {
            const res2 = await axios.post(
                process.env.CLOVER_URL + `/item_stocks/${req.params.id}`,
                { "quantity": req.body.iStock },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
        }

        // Mongo Next
        const inventory = await Inventory.findOneAndUpdate({ cloverID: req.params.id }, req.body)
        if (inventory) { res.json(inventory) }
        else { throw new Error('Inventory not found') }

    } catch (error) {
        throw new Error(error.response && error.response.data.message
            ? error.response.data.message : error.message)
    }
})

// @desc Delete single inventory
// @route DELETE /api/inventory/edit/:id
// @access Staff
const deleteInventory = asyncHandler(async (req, res) => {
    try {
        // Clover First
        const res1 = await axios.delete(
            process.env.CLOVER_URL + `/items/${req.params.id}`,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        // Mongo Next
        const inventory = await Inventory.findOneAndDelete({ cloverID: req.params.id })
        if (inventory) { res.json(inventory) }
        else { throw new Error('Inventory not found') }
    } catch (error) {
        throw new Error(error.response && error.response.data.message
            ? error.response.data.message : error.message)
    }
})


export {
    getInventory,
    getInventoryItem,
    getCloverIDs,
    newInventory,
    updateInventory,
    deleteInventory,
}

