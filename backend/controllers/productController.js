import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import axios from 'axios'

// @desc Fetch all products
// @route GET /api/products/
// @access Public
const getProducts = asyncHandler(async (req, res) => {
    // const pageSize = 100
    const pageSize = Number(req.query.limit) || 100
    const page = Number(req.query.pageNumber) || 1
    const staff = Number(req.query.staff)
    const sort = req.query.sort
    const upDown = Number(req.query.upDown)

    const keyword = req.query.keyword
        ? {
            $or: [
                { pName: { $regex: req.query.keyword, $options: 'i' } },
                { pID: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {}


    if (staff) {
        const count = await Product.countDocuments({ ...keyword })
        const products = await Product.find({ ...keyword })
            .sort({ [sort]: upDown })
            .limit(pageSize).skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) })
        // console.log("staff: ", staff)

    } else {
        const count = await Product.countDocuments({ ...keyword, pDisplay: true })
        const products = await Product.find({ ...keyword, pDisplay: true })
            .sort({ updatedAt: -1 })
            .limit(pageSize).skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) })
        // console.log("guest: ", staff)
    }
})

// @desc Get Suggested Products
// @route Get /api/products/suggested
// @access Public
const getSuggestedProducts = asyncHandler(async (req, res) => {
    const array = []
    const count = await Product.countDocuments({ pDisplay: true, pSell: true })
    for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * count)
        let product = await Product.findOne({ pDisplay: true, pSell: true }).skip(random)
        array.push(product)
    }
    res.json(array)
})

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    // const product = await Product.findOne({ pID: req.params.id })
    const product = await Product.findOne({ cloverID: req.params.id })
    if (product) {
        const category = await Category.findOne({ sectionID: product.pSection })
        product.topSection = category.sectionName
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})


//========================================================================================================================
//===============================================Edit=====================================================================
//========================================================================================================================

// @desc Create a product
// @route POST /api/products/
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {

    //New Clover Product
    const { data } = await axios.post(
        process.env.CLOVER_URL + `/items`,
        { name: "New Product", price: 0 },
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    ).catch(error => console.log(error.response.data))

    const product = await Product({
        pID: data.id,
        cloverID: data.id,
        pName: 'New Product',
        pPrice: 0,
        pListPrice: 0,
        // images: image
        pManufacturer: 'Sample Brand',
        pSection: 999,
        pLongDescription: 'Sample description',
        pInStock: 0,
        pDisplay: 1,
        user: req.user._id
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {

    const { data } = await syncToClover(req)

    const product = await Product.findOne({ cloverID: req.params.id })
    if (product) {
        product.pName = req.body.name
        product.pPrice = req.body.price
        product.pListPrice = req.body.listPrice
        // product.images = req.body.image
        product.pManufacturer = req.body.brand
        product.pSection = req.body.category
        product.pLongDescription = req.body.description
        product.pInStock = req.body.countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc Delete single product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ cloverID: req.params.id })
    if (product) {
        // DB
        await product.remove()
        // Clover
        await axios.delete(
            process.env.CLOVER_URL + `/items/${req.params.id}`,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        ).catch(error => console.log(error.response.data))

        res.json({ message: 'Product Removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

const syncToClover = async (req) => {
    var cloverResponse = await axios.get(
        process.env.CLOVER_URL + `/items/${req.body.cloverID}?expand=itemStock`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    ).catch(error => console.log(error.response.data))

    // If New
    if (cloverResponse.data.name == "New Product") {
        cloverResponse = await axios.post(
            process.env.CLOVER_URL + `/items/${req.body.cloverID}`,
            { name: req.body.name, price: req.body.price },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        cloverResponse = await axios.post(
            process.env.CLOVER_URL + `/item_stocks/${req.body.cloverID}`,
            { "quantity": req.body.countInStock },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        ).catch(error => console.log(error.response.data))
        // console.log(cloverResponse.data)
    } else {
        // If Update
        cloverResponse = await axios.post(
            process.env.CLOVER_URL + `/items/${req.body.cloverID}`,
            { price: req.body.price },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        cloverResponse = await axios.post(
            process.env.CLOVER_URL + `/item_stocks/${req.body.cloverID}`,
            { "quantity": req.body.countInStock },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        ).catch(error => console.log(error.response.data))
    }
    return cloverResponse
}

// @desc Update product Images
// @route PuUT /api/product/images/:id
// @access Private/Staff
const updateImages = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ cloverID: req.params.id })
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


export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
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

//     const product = await Product.findOne({ cloverID: req.params.id })
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