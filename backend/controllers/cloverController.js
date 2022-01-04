import asyncHandler from 'express-async-handler'
import Inventory from '../models/inventoryModel.js'
import axios from 'axios'

// @desc Submit Clover Order
// @route POST /api/clover
// @access Public
const orderClover = asyncHandler(async (req, res) => {
    const { cart, userInfo, token } = req.body
    console.log(userInfo.employeeID)
    // await new Promise((res) => setTimeout(res, 3000))
    try {
        //Create Order
        const newOrder = await axios.post(
            process.env.CLOVER_URL + `/orders`,
            {
                // "note": "Shipping Required", // For Mark as Deliever
                "state": "Open",
                "orderType": { "id": process.env.ORDER_TYPE },
                "employee": {
                    "id": userInfo.employeeID ? userInfo.employeeID : process.env.WEBSITE_ID
                }

            }, { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        const orderID = newOrder.data.id
        console.log("order created:", orderID)

        // console.log("taxRate", cart.shippingInfo.taxRate)
        // Add Bulk Line Items
        let bulkLineItems = { "items": [] }
        for (let cartItem of cart.cartItems) {
            for (let index = 0; index < cartItem.qty; index++) {
                let lineItem =
                {
                    "item": { "id": cartItem.cloverID },
                    "name": cartItem.name,
                    "alternateName": cartItem.image,
                    "note": cartItem.pID,
                    "price": cartItem.price,
                    "taxRates": [
                        {
                            "id": process.env.TAX_ID, //Has to match existing ID
                            "name": "", // doesnt matter
                            "rate": (cart.shippingInfo.taxRate * 10000000) || 0, // Manual Entry
                            "isDefault": false
                        }
                    ],
                }
                bulkLineItems.items.push(lineItem)
            }
        }

        // Add Shipping
        const { email, firstName, lastName, company, address, address2, city, country, region, postalCode, phone } = cart.shippingInfo
        const shippingLabel = { email, firstName, lastName, company, address, address2, city, country, region, postalCode, phone }
        bulkLineItems.items.push(
            {
                "item": { "id": process.env.SHIPPING_ID },
                "name": "Website Shipping",
                "alternateName": `Shipping (${cart.shippingMethod.method})`,
                "price": cart.shippingMethod.price,
                "note": JSON.stringify(shippingLabel),
                "taxRates": [
                    {
                        "id": process.env.TAX_NONE_ID, //Has to match existing ID
                        "name": "", // doesnt matter
                        "rate": 0, // Manual Entry
                        "isDefault": false
                    }
                ],
            })
        await axios.post(
            process.env.CLOVER_URL + `/orders/${orderID}/bulk_line_items`, bulkLineItems,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        console.log("items added to order")

        // Attach Customer
        var customerID = userInfo && userInfo.customerID
        if (customerID) {
            await axios.post(
                process.env.CLOVER_URL + `/orders/${orderID}`,
                { "customers": [{ "id": customerID }] },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
            console.log("customer added")
        }


        // Add Discount
        if (cart.discount && cart.discount.discountTotal) {
            await axios.post(
                process.env.CLOVER_URL + `/orders/${orderID}/discounts`,
                { amount: Number(cart.discount.discountTotal * -1), name: cart.discount.discountCode },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
            console.log("discount added")
        }

        //
        // Modifcation Later
        //

        //Pay for Order
        await axios.post(
            process.env.CLOVER_PAY_URL + `/orders/${orderID}/pay`,
            {
                "source": token,
                "email": cart.shippingInfo.email
            },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        console.log("payment posted")


        //Final Call for All Info
        await new Promise(r => setTimeout(r, 2000));
        const { data } = await axios.get(
            process.env.CLOVER_URL + `/orders/${orderID}?expand=lineItems&expand=customers&expand=payments`,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        res.json(data)
        console.log("order success")

        // After Order Functions
        if (process.env.NODE_ENV === "development") {
            sendToQB(data)
            console.log("sent to QB")
            updateInv(cart.cartItems)
            console.log("sent to InvUpdate")
        }

    } catch (error) {
        if (error.response) {
            console.log(error.response)
            throw new Error(JSON.stringify(error.response.data))
        } else if (error.request) {
            throw new Error("Request Error")
        } else {
            throw new Error("Server Error: " + JSON.stringify(error))
        }
    }
})


// ====================================================================================
// ============================ After Order Functions =================================
// ====================================================================================

// Update QB
async function sendToQB(order) {
    console.log("QB start")
    const { id, total, lineItems, payments } = order
    const shipping = lineItems.elements.find(lineItem => lineItem.item && lineItem.item.id == process.env.SHIPPING_ID)
    const tax = payments.elements && payments.elements[0] && payments.elements[0].taxAmount
    if (shipping.price && tax) {
        const subtotal = total - shipping.price - tax

        const { data } = await axios.post(
            process.env.ZAPIER_URL,
            {
                id,
                subtotal: subtotal / 100,
                shipping: shipping.price / 100,
                tax: tax / 100,

            }
        )
        if (data.status == "success") console.log("Zapier Success!")
        else console.log("Zapier Post Failed")
    } else {
        console.log("Zapier Fail: shipping or tax not found")
    }
}

// Update Inv
async function updateInv(cartItems) {
    console.log("updateInv start")
    for (const item of cartItems) {
        await Inventory.findOneAndUpdate({ cloverID: item.cloverID }, { $inc: { iStock: -item.qty } })
    }
    console.log("updateInv finished!")
}


// ====================================================================================
// ============================ Clover Extra===========================================
// ====================================================================================

// @desc Create a Refund
// @route POST /api/clover/refund
// @access Public
const refundClover = asyncHandler(async (req, res) => {
    const { amount, lineID, orderID } = req.body
    // await new Promise((res) => setTimeout(res, 3000))
    try {
        console.log("orderID", orderID)
        console.log("amount", amount)
        console.log("line", lineID)

        //Create Refund
        const { data } = await axios.post(
            process.env.CLOVER_PAY_URL + `/orders/${orderID}/returns`,
            {
                "items": [
                    {
                        "parent": lineID,
                        "type": "sku",
                        "amount": amount
                    }
                ]
            },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )

        console.log(JSON.stringify(data))
        res.json("success")

    } catch (error) {
        if (error.response) {
            throw new Error(JSON.stringify(error.response.data))
        } else if (error.request) {
            throw new Error("Request Error")
        } else {
            throw new Error("Server Error: " + JSON.stringify(error))
        }
    }
})





export {
    orderClover,
    refundClover
}