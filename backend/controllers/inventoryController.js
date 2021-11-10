import asyncHandler from 'express-async-handler'
import Inventory from '../models/inventoryModel.js'
import axios from 'axios'

// @desc Fetch all Inventory Items
// @route GET /api/inventory/
// @access Public
const getInventory = asyncHandler(async (req, res) => {
    // const pageSize = 100
    const pageSize = Number(req.query.limit) || 100
    const page = Number(req.query.pageNumber) || 1
    // const list = Number(req.query.staff)
    // const sort = req.query.sort
    // const upDown = Number(req.query.upDown)

    const keyword = req.query.keyword
        ? {
            $or: [
                { pName: { $regex: req.query.keyword, $options: 'i' } },
                { pID: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {}

    // console.log("staff", staff)
    const count = await Inventory.countDocuments({ ...keyword })
    const inventory = await Inventory.find({ ...keyword })
        // .sort({ [sort]: upDown })
        .limit(pageSize).skip(pageSize * (page - 1))


    res.json({ inventory, page, pages: Math.ceil(count / pageSize) })
})

// @desc Fetch single Inventory Item
// @route GET /api/inventory/:id
// @access Public
const getInventoryById = asyncHandler(async (req, res) => {
    // const product = await Product.findOne({ pID: req.params.id })
    const raw = await Product.findOne({ cloverID: req.params.id })
    if (raw) {
        const product = { ...raw._doc }

        // Add Category Name
        const category = await Category.findOne({ sectionID: product.pSection })
        product.pSectionName = category.sectionName

        // Add Price / Options
        // if (product.optionGroup) {
        product.options = []
        const invArr = await Inventory.find({ iParent: product.pID })
        invArr.forEach(inv => {
            product.options.push(inv)
        })
        // } else {
        //     const inv = await Inventory.findOne({ iParent: product.pID })
        //     if (inv) {
        //         product.pPrice = inv.iPrice
        //         product.pListPrice = inv.iListPrice
        //     }
        // }
        product.test = "testeteste"
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


export {
    getInventory,
    getInventoryById,
}

