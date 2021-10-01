import asyncHandler from 'express-async-handler'
import axios from 'axios'

// @desc Submit Clover Order
// @route POST /api/clover
// @access Public
const orderClover = asyncHandler(async (req, res) => {
    const { cart, userLogin, token } = req.body
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
                    "id": process.env.WEBSITE
                    // "id": userLogin.userInfo && userLogin.userInfo.employeeID ?
                    //     userLogin.userInfo.employeeID : WEBSITE
                }
            }, { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        const orderID = newOrder.data.id

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
                            "id": "HSKPV1YMDB9CA", //Has to match existing ID
                            "name": "", // doesnt matter
                            "rate": cart.shippingInfo.taxRate, // Manual Entry
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
                "item": { "id": process.env.SHIPPINGID },
                "name": "Website Shipping",
                "alternateName": `Shipping (${cart.shippingMethod.method})`,
                "price": cart.shippingMethod.price,
                "note": JSON.stringify(shippingLabel),
                "taxRates": [
                    {
                        "id": "FNC2N54SC3QXG", //Has to match existing ID
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

        // Attach Customer
        var customerID = userLogin.userInfo && userLogin.userInfo.customerID
        if (!userLogin.userInfo || userLogin.userInfo.employeeID || !userLogin.userInfo.customerID) {
            //Create Customer
            const newCustomer = await axios.post(process.env.CLOVER_URL + `/customers`,
                {
                    "emailAddresses": [
                        {
                            "emailAddress": cart.shippingInfo.email
                        }
                    ],
                    "firstName": cart.shippingInfo.firstName,
                    "lastName": cart.shippingInfo.lastName
                }, { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
            customerID = newCustomer.data.id
        }
        await axios.post(
            process.env.CLOVER_URL + `/orders/${orderID}`,
            { "customers": [{ "id": customerID }] },
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )


        // Add Discount
        //If userLogin = isStaff
        // if (userLogin.userInfo && userLogin.userInfo.isStaff == true) {
        if (cart.discount && cart.discount.discountType === "%") {
            await axios.post(
                process.env.CLOVER_URL + `/orders/${orderID}/discounts`,
                { percentage: Number(cart.discount.discountAmount), name: cart.discount.discountName },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
        }
        if (cart.discount && cart.discount.discountType === "$") {
            await axios.post(
                process.env.CLOVER_URL + `/orders/${orderID}/discounts`,
                { amount: Number(cart.discount.discountAmount * -100), name: cart.discount.discountName },
                { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
            )
        }
        // } else {
        //     throw new Error("Discount not Authorized")
        // }

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


        //Final Call for All Info
        const { data } = await axios.get(
            process.env.CLOVER_URL + `/orders/${orderID}?expand=lineItems&expand=customers&expand=payments`,
            { headers: { "Authorization": `Bearer ${process.env.CLOVER_KEY}` } }
        )
        res.json(data)
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error.message)
        } else if (error.request) {
            throw new Error(error.request)
        } else {
            throw new Error(error.message)
        }
    }
})


// @desc Get Tax Rate from Address
// @route POST /api/clover/tax
// @access Public
const fetchTax = asyncHandler(async (req, res) => {
    const shippingInfo = req.body
    var taxRate
    // Logic
    if (shippingInfo.region == "CA" || shippingInfo.region == "California") {
        taxRate = 775000
    } else {
        taxRate = 0
    }
    res.json(taxRate)
})


export {
    orderClover,
    fetchTax,
}