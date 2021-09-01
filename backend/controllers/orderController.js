import asyncHandler from 'express-async-handler'
// import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import axios from 'axios'

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Public -> Private&Staff
const getOrderByID = asyncHandler(async (req, res) => {
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders/${req.params.id}?expand=lineItems&expand=customers&expand=payments`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )

    // Group Line Items
    var lineItems = data.lineItems.elements
    for (var outside = 0; outside < lineItems.length; outside++) {
        var outsideItem = lineItems[outside];
        lineItems[outside].qty = 1
        for (var inside = lineItems.length - 1; inside >= 0; inside--) {
            var insideItem = lineItems[inside];
            if (outsideItem.name === insideItem.name) {
                if (outside == inside) { break; }
                outsideItem.qty++
                lineItems.splice(inside, 1)
            }
        }
    }
    // Add Images
    for (var index = 0; index < lineItems.length; index++) {
        const cloverID = lineItems[index].item && lineItems[index].item.id;
        // console.log("Clover", cloverID)
        if (cloverID) {
            const product = await Product.findOne({ cloverID: cloverID })
            // console.log(product)
            if (product) {
                lineItems[index].image = product.images.length && product.images[0].imageSrc
                lineItems[index].pID = product.pID
            }
        }
        else { // Remove in Prod
            lineItems[index].image = lineItems[index].alternateName
            lineItems[index].pID = lineItems[index].note
        }
    }

    // Parse Shipping Label
    var shippingLabel
    for (var i = 0; i < lineItems.length; i++) {
        if (lineItems[i].name === "Website Shipping") {
            shippingLabel = JSON.parse(lineItems[i].note)
        }
    }

    // if customerID does not match (protect)
    res.json({ lineItems, shippingLabel, payment: data.payments.elements[0] })
})

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Public -> Private%Staff
const getMyOrders = asyncHandler(async (req, res) => {
    // console.log(req.user.customerID)
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?filter=customer.id=${req.user.customerID}&expand=lineItems`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    var orderList = data.elements
    for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i];
        const firstItem = order.lineItems.elements[0]
        const cloverID = firstItem.item && firstItem.item.id
        if (cloverID) {
            const product = await Product.findOne({ cloverID: cloverID })
            if (product) {
                order.orderImage = product.images.length && product.images[0].imageSrc
            }
        } else { //Remove in Prod
            order.orderImage = firstItem.alternateName
        }
    }
    // console.log(orderList)
    res.json(orderList)
})

// @desc Get all orders
// @route GET /api/orders/
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?expand=lineItems`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    // var orders = data.elements
    // for (let i = 0; i < orders.length; i++) {
    //     const order = orders[i];
    //     const { data } = await axios.get(
    //         process.env.CLOVER_URL + `/customers/${}`,
    //         { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    // }
    res.json(data.elements)
})



// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
// const updateOrderToDelivered = asyncHandler(async (req, res) => {
// })


export {
    // addOrderItems,
    getOrderByID,
    // updateOrderToPaid,
    // updateOrderToDelivered,
    getMyOrders,
    getOrders
}