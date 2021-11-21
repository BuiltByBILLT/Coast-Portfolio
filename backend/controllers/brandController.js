import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModel.js'


// @desc Fetch all brands
// @route GET /api/brands/
// @access Public w/ Check
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find({}).sort({ brandID: 1 })
    res.json(brands)
})

// @desc Fetch single brand for Edit
// @route GET /api/brands/edit/:id
// @access Staff
const getBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findOne({ brandID: req.params.id })
    if (brand) { res.json(brand) }
    else { throw new Error('Brand not found') }

})

// @desc Create a new brand
// @route POST /api/brands/edit/:id
// @access Staff
const newBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.create(req.body)
    if (brand) { res.json(brand) }
    else { throw new Error('Brand Data Invalid') }
})

// @desc Update single brand
// @route PUT /api/brands/edit/:id
// @access Staff
const updateBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findOneAndUpdate({ brandID: req.params.id }, req.body)
    if (brand) { res.json(brand) }
    else { throw new Error('Brand not found') }
})

// @desc Delete single brand
// @route DELETE /api/brands/edit/:id
// @access Staff
const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findOneAndDelete({ brandID: req.params.id })
    if (brand) { res.json(brand) }
    else { throw new Error('Brand not found') }
})



export {
    getBrands,
    getBrand,
    newBrand,
    updateBrand,
    deleteBrand,
}