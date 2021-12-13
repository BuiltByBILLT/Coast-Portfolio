import asyncHandler from 'express-async-handler'
// import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Label from '../models/labelModel.js'
import axios from 'axios'

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Public -> Private&Staff?
const getOrderByID = asyncHandler(async (req, res) => {
    var { data } = await axios.get(
        process.env.CLOVER_URL + `/orders/${req.params.id}?expand=lineItems&expand=discounts&expand=payments&expand=refunds`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )
    if (data.paymentState === "OPEN") {
        console.log(JSON.stringify(data))
    }


    // Group Line Items
    var lineItems = data.lineItems.elements
    for (var outside = 0; outside < lineItems.length; outside++) {
        var outsideItem = lineItems[outside];
        lineItems[outside].qty = 1
        for (var inside = lineItems.length - 1; inside >= 0; inside--) {
            var insideItem = lineItems[inside];
            if (outsideItem.name === insideItem.name) {
                if (insideItem.refunded === true) outsideItem.refunded = true
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

    //Payment
    var payment = {}
    if (data.paymentState === "OPEN") {
        payment.state = "OPEN"
    } else {
        payment.state = "PAID"
        payment.total = data.payments.elements[0].amount
        payment.tax = data.payments.elements[0].taxAmount
        payment.discounts = data.discounts
    }

    // Refunds
    var refunds
    if (data.refunds) {
        refunds = data.refunds.elements

    } else {
        refunds = null
    }

    // Employee
    var employee
    if (data.employee.id && data.employee.id != process.env.WEBSITE_ID) { // Default is Website
        const user = await User.findOne({ employeeID: data.employee.id })
        employee = user && (user.firstName + " " + user.lastName)
    } else {
        employee = null
    }
    // if customerID does not match (protect)
    // res.json({ lineItems, shippingLabel, payment: data.payments.elements[0] })
    // res.json({ lineItems, shippingLabel, payment: data.paymentState, payments })
    res.json({ lineItems, shippingLabel, payment, employee, refunds })
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

// @desc Get logged in employee orders
// @route GET /api/orders/employee
// @access Private Staff
const getEmployeeOrders = asyncHandler(async (req, res) => {
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?filter=employee.id=${req.user.employeeID}&expand=lineItems`,
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


// @desc Get Unshipped orders
// @route GET /api/orders/unshipped
// @access Private/Admin
const getUnshippedOrders = asyncHandler(async (req, res) => {
    const { data } = await axios.get(
        process.env.CLOVER_URL + `/orders?expand=lineItems&filter=payType=full`,
        { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
    )

    const send = []
    const orders = data.elements
    for (const order of orders) {
        let shipping = order.lineItems.elements.filter(line => line.name == "Website Shipping")
        // Only Orders with Shipping
        if (shipping.length) {
            let label = await Label.findOne({ orderID: order.id })
            // Skip if Label Exists
            if (label) continue

            let clean = {}
            clean.id = order.id
            // clean.lineItems = order.lineItems.elements.length

            // Group Line Items
            var lineItems = order.lineItems.elements
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
            clean.lineItems = lineItems
            send.push(clean)
        }
    }

    res.json(send)
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
    getOrders,
    getEmployeeOrders,
    getUnshippedOrders
}