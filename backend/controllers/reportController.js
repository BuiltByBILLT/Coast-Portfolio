import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import axios from 'axios'


// @desc get Average Sales
// @route GET /api/reports/average
// @access Staff
const getAverage = asyncHandler(async (req, res) => {
    const start = Number(req.query.start) || 0
    const end = Number(req.query.end) || 0

    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders`
        + `?expand=lineItems`
        + `&filter=clientCreatedTime>${start}`
        + `&filter=clientCreatedTime<${end}`
        + `&filter=payType=full`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    ).catch(error => console.log(error.response.data))
    // console.log(data.elements.length)

    const totalTotals = data.elements.reduce((acc, curr) => { return acc + curr.total }, 0)
    // const totalItems = data.elements.reduce((acc, curr) => { return acc + curr.lineItems.elements.length }, 0)
    // console.log()
    res.json({
        totalOrders: data.elements.length,
        totalTotals,
        // totalItems
    })
})


// @desc Get Low Inventory
// @route GET /api/reports/low
// @access Staff
const getLowInv = asyncHandler(async (req, res) => {
    const products = await Product.find({ pInStock: { $lte: 15 } })
    res.json(products)
})



export {
    getLowInv,
    getAverage
}