import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import Product from '../models/productModel.js'
import Inventory from '../models/inventoryModel.js'


// @desc Fetch all categories
// @route GET /api/categories/
// @access Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ sectionDisabled: 0 })
    res.json(categories)
})

// @desc Fetch products in category
// @route GET /api/categories/:id/products
// @access Public
const getCategoryProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ pSection: req.params.id, pDisplay: true })
    if (products) {
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.optionGroup) {
                const inv = await Inventory.findOne({ iParent: product.pID })
                if (inv) { product.pPrice = inv.iPrice }
            }
        }
        res.json(products)
    } else {
        res.status(404)
        throw new Error('Category not found')
    }
})

// @desc Fetch single category Breadcrumbs and Children
// @route GET /api/categories/:id
// @access Public
const getCategoryDetails = asyncHandler(async (req, res) => {
    let array = []
    let topSection = req.params.id

    for (let index = 0; index < 10; index++) {
        let category = await Category.findOne({ sectionID: topSection, sectionDisabled: 0 })
        if (topSection == 0) {
            array.push({ sectionID: 0, sectionName: "All Categories" })
            break
        }
        else if (category) {
            array.push(category)
            topSection = category.topSection

        } else {
            res.status(404)
            throw new Error('Category not found')
        }
    }

    const categories = await Category.find({ topSection: req.params.id, sectionDisabled: 0 }).sort({ sectionOrder: 1 })

    res.json({ breadcrumbs: array, children: categories })
})

// @desc Get Top Categories
// @route Get /api/categories/top
// @access Public
const getTopCategories = asyncHandler(async (req, res) => {
    const array = []
    const count = await Category.countDocuments({ sectionDisabled: false, sectionImage: { $gte: "" } })
    for (let i = 0; i < 16; i++) {
        let random = Math.floor(Math.random() * count)
        let categories = await Category.findOne({ sectionDisabled: false, sectionImage: { $gte: "" } }).skip(random)
        array.push(categories)
    }
    res.json(array)
})

export {
    getCategories,
    getCategoryProducts,
    getCategoryDetails,
    getTopCategories
}