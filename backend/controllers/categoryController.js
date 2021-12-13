import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'
import Product from '../models/productModel.js'
import Inventory from '../models/inventoryModel.js'


// @desc Fetch all categories
// @route GET /api/categories/
// @access Public w/ Check
const getCategories = asyncHandler(async (req, res) => {
    var categories
    if (req.user.isStaff) categories = await Category.find({}).sort({ topSection: 1, sectionID: 1 })
    else categories = await Category.find({ sectionDisabled: false })
    res.json(categories)
})

// @desc Fetch single category for Edit
// @route GET /api/categories/edit/:id
// @access Staff
const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ sectionID: req.params.id })
    if (category) { res.json(category) }
    else { throw new Error('Category not found') }

})

// @desc Create a new category
// @route POST /api/categories/edit/:id
// @access Staff
const newCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body)
    if (category) { res.json(category) }
    else { throw new Error('Category Data Invalid') }
})

// @desc Update single category
// @route PUT /api/categories/edit/:id
// @access Staff
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOneAndUpdate({ sectionID: req.params.id }, req.body)
    if (category) { res.json(category) }
    else { throw new Error('Category not found') }
})

// @desc Delete single category
// @route DELETE /api/categories/edit/:id
// @access Staff
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOneAndDelete({ sectionID: req.params.id })
    if (category) { res.json(category) }
    else { throw new Error('Category not found') }
})


// @desc Fetch products in category
// @route GET /api/categories/products/:id
// @access Public
const getCategoryProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ pSection: req.params.id, pDisplay: true })
    if (products) {
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product.optionGroup) {
                const inv = await Inventory.findOne({ iParent: product.pID })
                if (inv) { product._doc.pPrice = inv.iPrice }
            }
        }
        res.json(products)
    } else {
        res.status(404)
        throw new Error('Category not found')
    }
})


// @desc Fetch single category Breadcrumbs and Children
// @route GET /api/categories/details/:id
// @access Public
const getCategoryDetails = asyncHandler(async (req, res) => {
    let breadcrumbs = []
    let topSection = req.params.id // First is Self

    //BreadCrumbs
    for (let index = 0; index < 10; index++) {
        let category = await Category.findOne({ sectionID: topSection, sectionDisabled: false })
        if (topSection == 0) { // At the top
            breadcrumbs.push({ sectionID: 0, sectionName: "All Categories" })
            break
        }
        else if (category) { // Find Next Parent
            breadcrumbs.push(category)
            topSection = category.topSection
        } else { // Bad Category
            res.status(404)
            throw new Error('Category not found')
        }
    }
    // Children
    const children = await Category.find({ topSection: req.params.id, sectionDisabled: false }).sort({ sectionOrder: 1 })

    res.json({ breadcrumbs, children })
})

export {
    getCategories,
    getCategoryProducts,
    getCategoryDetails,
    getCategory,
    newCategory,
    updateCategory,
    deleteCategory,
}