import asyncHandler from 'express-async-handler'
import Discount from '../models/discountModel.js'


// @desc Fetch all discounts
// @route GET /api/discounts/
// @access Public w/ Check
const getDiscounts = asyncHandler(async (req, res) => {
    const discounts = await Discount.find({}).sort({ discountCode: 1 })
    res.json(discounts)
})

// @desc Fetch single discount for Edit
// @route GET /api/discounts/edit/:id
// @access Staff
const getDiscount = asyncHandler(async (req, res) => {
    const discount = await Discount.findOne({ discountCode: req.params.id })
    if (discount) { res.json(discount) }
    else { throw new Error('Discount not found') }

})

// @desc Create a new discount
// @route POST /api/discounts/edit/:id
// @access Staff
const newDiscount = asyncHandler(async (req, res) => {
    const discount = await Discount.create(req.body)
    if (discount) { res.json(discount) }
    else { throw new Error('Discount Data Invalid') }
})

// @desc Update single discount
// @route PUT /api/discounts/edit/:id
// @access Staff
const updateDiscount = asyncHandler(async (req, res) => {
    const discount = await Discount.findOneAndUpdate({ discountCode: req.params.id }, req.body)
    if (discount) { res.json(discount) }
    else { throw new Error('Discount not found') }
})

// @desc Delete single discount
// @route DELETE /api/discounts/edit/:id
// @access Staff
const deleteDiscount = asyncHandler(async (req, res) => {
    const discount = await Discount.findOneAndDelete({ discountCode: req.params.id })
    if (discount) { res.json(discount) }
    else { throw new Error('Discount not found') }
})


// @desc Apply single discount for Cart
// @route POST /api/discounts/apply/:id
// @access Public
const applyDiscount = asyncHandler(async (req, res) => {
    const cartItems = req.body
    const discount = await Discount.findOne({ discountCode: req.params.id })
    let subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
    // console.log(cartItems)

    if (discount) {
        const { discountExclude, discountAmount, discountType, categoryExclude } = discount
        // If Flat
        if (discountType === "FLAT") {
            // If Min Order
            if (discountExclude) {
                if (subtotal >= discountExclude) {
                    res.json({ ...discount._doc, discountTotal: discountAmount })
                }
                else {
                    let dollar = (Number(discountExclude) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
                    throw new Error(`Order does not meet ${dollar} requirement`)
                }
            } // If No Min, check exceed 
            else {
                res.json({ ...discount._doc, discountTotal: subtotal > discountAmount ? discountAmount : subtotal })
            }
        }
        // If Percent
        else if (discountType === "PERCENT") {
            let excludeArr = discountExclude.split(",").map(item => item.trim())
            let categoryArr = categoryExclude.split(",").map(item => item.trim())
            console.log(categoryArr)
            for (const cartItem of cartItems) {
                console.log(cartItem.category)
                if (excludeArr.includes(cartItem.pID)) {
                    subtotal -= (cartItem.price * cartItem.qty)
                } else if (categoryArr.includes(String(cartItem.category))) {
                    console.log("cat match")
                    subtotal -= (cartItem.price * cartItem.qty)
                }
            }
            let discountTotal = Math.round(subtotal * discountAmount / 100)
            res.json({ ...discount._doc, discountTotal })
        }
        else throw new Error('Discount Type Error')
    } else throw new Error('Discount not found')


})

export {
    getDiscounts,
    applyDiscount,
    getDiscount,
    newDiscount,
    updateDiscount,
    deleteDiscount,
}