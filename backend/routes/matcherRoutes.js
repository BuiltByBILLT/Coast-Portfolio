import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect, staff } from '../middleware/authMiddleware.js'
import Inventory from '../models/inventoryModel.js'
import Product from '../models/productModel.js'
import Fuzzy from '../models/fuzzyModel.js'
import { extract, token_sort_ratio } from 'fuzzball'

// @route /api/matcher/
const router = express.Router()


// @desc Get Orphan Solo Products
// @route Get /api/matcher/solo
// @access Staff
const getSolos = asyncHandler(async (req, res) => {
    const total = await Product.countDocuments({ options: { $size: 0 }, pDisplay: true })
    const q = { cloverID: { $exists: false }, options: { $size: 0 }, pDisplay: true }
    const products = await Product.find(q).select("pID") // Missing
    res.json({ products, total })
})

// @desc Get Orphan Parent Products
// @route Get /api/matcher/parent
// @access Staff
const getParents = asyncHandler(async (req, res) => {
    const total = await Product.countDocuments({ options: { $elemMatch: { oName: { $exists: true } } }, pDisplay: true })
    const q = { options: { $elemMatch: { oName: { $exists: true }, cloverID: { $exists: false } } }, pDisplay: true }
    const products = await Product.find(q).select("pID") // Missing
    res.json({ products, total })
})

// @desc Get Orphan Parent Total
// @route Get /api/matcher/parents
// @access Staff
const getTotalParents = asyncHandler(async (req, res) => {

    const totalParents = await Product.find({ options: { $elemMatch: { oName: { $exists: true } } }, pDisplay: true })
    let count = 0 // with CloverID
    let total = 0
    for (const parent of totalParents) {
        for (const option of parent.options) {
            if (option.oName) {
                total++
                if (!option.cloverID) count++
            }
        }
    }
    res.json({ total, count })
})

// @desc Save Solo Product
// @route POST /api/matcher/save
// @access Staff
const save = asyncHandler(async (req, res) => {
    res.json(req.body)
})






router.route('/solo')
    .get(protect, staff, getSolos)
router.route('/parent')
    .get(protect, staff, getParents)
router.route('/parents')
    .get(protect, staff, getTotalParents)
router.route('/save')
    .post(protect, staff, save)




export default router