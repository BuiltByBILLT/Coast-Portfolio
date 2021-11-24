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
    console.log(cartItems)
    const discount = await Discount.findOne({ discountCode: req.params.id })
    if (discount) {
        // If Flat
        if (discount.discountType === "FLAT") {
            const subtotal = cartItems.reduce((acc, curr) => acc + curr.qty * curr.price, 0)
            if (subtotal >= discount.discountExclude) {
                res.json({ ...discount._doc, discountTotal: discount.discountAmount })
            }
            else throw new Error(
                `Order does not meet ${(Number(discount.discountExclude) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })} requirement`
            )
        } // If Percent
        else if (discount.discountType === "PERCENT") {
            let discountTotal = 0

            res.json(discount)
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