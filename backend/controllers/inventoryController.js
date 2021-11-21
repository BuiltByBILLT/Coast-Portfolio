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
            { iParent: { $regex: req.query.keyword, $options: 'i' } },
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
    const inventory = await Inventory.find({})
        .select('cloverID')
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

// @desc Create a new inventory
// @route POST /api/inventory/edit/:id
// @access Staff
const newInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.create(req.body)
    if (inventory) { res.json(inventory) }
    else { throw new Error('Inventory Data Invalid') }
})

// @desc Update single inventory
// @route PUT /api/inventory/edit/:id
// @access Staff
const updateInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOneAndUpdate({ cloverID: req.params.id }, req.body)
    if (inventory) { res.json(inventory) }
    else { throw new Error('Inventory not found') }
})

// @desc Delete single inventory
// @route DELETE /api/inventory/edit/:id
// @access Staff
const deleteInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOneAndDelete({ cloverID: req.params.id })
    if (inventory) { res.json(inventory) }
    else { throw new Error('Inventory not found') }
})


export {
    getInventory,
    getInventoryItem,
    getCloverIDs,
    newInventory,
    updateInventory,
    deleteInventory,
}

