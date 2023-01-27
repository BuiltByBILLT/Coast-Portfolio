import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Inventory from '../models/inventoryModel.js'
import Category from '../models/categoryModel.js'
import axios from 'axios'

// @desc Fetch all products
// @route GET /api/products/
// @access Public w/ Check
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 24
    const page = Number(req.query.pageNumber) || 1
    const brandsRaw = req.query.brands
    console.log(brandsRaw)
    const brands = brandsRaw && brandsRaw.split('_')
    console.log(brands)

    // If Keyword
    var keyword = req.query.keyword ? {
        $or: [
            { pName: { $regex: req.query.keyword, $options: 'i' } },
            { pID: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {}
    if (req.query.keyword === "ALL") keyword = {}

    // If Filter
    var filter
    if (brands) filter = { pManufacturer: { $in: [...brands] } }
    else filter = {}

    // Final Query
    let query = {
        ...keyword,
        ...filter,
        pDisplay: req.user && req.user.isStaff ? { $ne: null } : true
    }

    const count = await Product.countDocuments(query)
    const products = await Product.find(query)
        .sort({ updatedAt: -1 })
        .limit(pageSize).skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
    // const sort = req.query.sort
    // const upDown = Number(req.query.upDown)
    // .sort({ [sort]: upDown })
})

// @desc Fetch single product for Customers
// @route GET /api/products/details/:id
// @access Public
const getProductDetails = asyncHandler(async (req, res) => {
    const raw = await Product.findOne({ pID: req.params.id, pDisplay: true })
    if (raw) {
        const product = { ...raw._doc }

        // Fetch Stock
        if (product.cloverID) {
            const clover = await Inventory.findOne({ cloverID: product.cloverID })
            if (clover) product.pStock = clover.iSell && clover.iStock
        }
        // Options Stock
        for (const option of product.options) {
            const clover = await Inventory.findOne({ cloverID: option.cloverID })
            if (clover) option.oStock = clover.iSell && clover.iStock
        }

        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc Fetch All pID's
// @route GET /api/products/PID
// @access Staff
const getPIDs = asyncHandler(async (req, res) => {
    const products = await Product.find({})
        .select('pID')
    if (products) { res.json(products) }
    else { throw new Error('Products not found') }
})

// @desc Fetch All products
// @route GET /api/products/all
// @access Staff
const getAll = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    if (products) { res.json(products) }
    else { throw new Error('Products not found') }
})

// @desc Fetch single product for Edit (Does not have pDisplay True)
// @route GET /api/products/edit/:id
// @access Staff
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ pID: req.params.id })
    if (product) { res.json(product) }
    else { throw new Error('Product not found') }
})

// @desc Create a new product
// @route POST /api/products/edit/:id
// @access Staff
const newProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body)
    if (product) { res.json(product) }
    else { throw new Error('Product Data Invalid') }
})

// @desc Update single product
// @route PUT /api/products/edit/:id
// @access Staff
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOneAndUpdate({ pID: req.params.id }, req.body)
    if (product) { res.json(product) }
    else { throw new Error('Product not found') }
})

// @desc Delete single product
// @route DELETE /api/products/edit/:id
// @access Staff
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOneAndDelete({ pID: req.params.id })
    if (product) { res.json(product) }
    else { throw new Error('Product not found') }
})


// @desc Update product Images
// @route PuUT /api/product/images/:id
// @access Private/Staff
const updateImages = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ pID: req.params.id })
    if (product) {
        product.images = req.body
        console.log(req.body)
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


// @desc Get Suggested Products
// @route Get /api/products/suggested
// @access Public
const getSuggestedProducts = asyncHandler(async (req, res) => {
    const array = []
    const q = {
        $nor:
            [
                { images: { $size: 0 } },
                { pDisplay: false }
            ]
    }

    const count = await Product.countDocuments(q)
    for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * count)
        let product = await Product.findOne(q).skip(random)
        if (!!product) array.push(product)
    }
    res.json(array)
})


export {
    getProducts,
    getProductDetails,
    getPIDs,
    getAll,
    getProduct,
    newProduct,
    updateProduct,
    deleteProduct,
    updateImages,
    getSuggestedProducts,
}
