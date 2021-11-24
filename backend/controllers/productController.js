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

    // If Keyword
    const keyword = req.query.keyword ? {
        $or: [
            { pName: { $regex: req.query.keyword, $options: 'i' } },
            { pID: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {}

    const count = await Product.countDocuments({
        ...keyword, pDisplay: req.user && req.user.isStaff ? { $ne: null } : true
    })
    const products = await Product.find({
        ...keyword, pDisplay: req.user && req.user.isStaff ? { $ne: null } : true
    })
        .sort({ updatedAt: -1 })
        .limit(pageSize).skip(pageSize * (page - 1))

    if (!req.user) { // Load Prices 
        for (const product of products) {
            if (!product.optionGroup) { // Only for Singles
                const inv = await Inventory.findOne({ iParent: product.pID })
                if (inv) { product._doc.pPrice = inv.iPrice }
            }
        }
    }

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

        // Add Options
        product.options = []
        const invArr = await Inventory.find({ iParent: product.pID })
        invArr.forEach(inv => {
            if (!inv.iSell) inv.iStock = 0
            product.options.push(inv)
        })
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

// @desc Fetch single product for Edit
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
    const count = await Product.countDocuments({ pDisplay: true, optionGroup: null })
    for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * count)
        let product = await Product.findOne({ pDisplay: true, optionGroup: null }).skip(random)

        // Load Price
        const inv = await Inventory.findOne({ iParent: product.pID })
        const loaded = { ...product._doc, pPrice: inv && inv.iPrice }
        array.push(loaded)
    }
    res.json(array)
})


export {
    getProducts,
    getProductDetails,
    getPIDs,
    getProduct,
    newProduct,
    updateProduct,
    deleteProduct,
    updateImages,
    // createProductReview,
    // getTopProducts,
    getSuggestedProducts,
}

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
// const createProductReview = asyncHandler(async (req, res) => {
//     const { rating, comment } = req.body

//     const product = await Product.findOne({ pID: req.params.id })
//     if (product) {
//         const alreadyReviewed = product.reviews.find(
//             r => r.user.toString() === req.user._id.toString()
//         )
//         if (alreadyReviewed) {
//             res.status(400)
//             throw new Error('Product Already Reviewed')
//         }

//         const review = {
//             name: req.user.name,
//             rating: Number(rating),
//             comment,
//             user: req.user._id
//         }
//         product.reviews.push(review)
//         product.numReviews = product.reviews.length
//         product.rating = product.reviews.reduce(
//             (acc, item) => item.rating + acc, 0
//         ) / product.reviews.length

//         await product.save()
//         res.status(201).json({ message: 'Review added' })

//     } else {
//         res.status(404)
//         throw new Error('Product not found')
//     }
// })

// @desc Get Top Rated Products
// @route Get /api/products/top
// @access Public
// const getTopProducts = asyncHandler(async (req, res) => {
//     const products = await Product.find({}).sort({ rating: -1 }).limit(4)

//     res.json(products)
// })