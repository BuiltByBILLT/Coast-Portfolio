import asyncHandler from 'express-async-handler'
import csvtojson from 'csvtojson'
import fs from 'fs'
import Merchant from '../models/merchantModel.js'


// @desc Upload Merchant CSV
// @route POST /api/merchants
// @access Staff 
const saveMerchant = asyncHandler(async (req, res) => {
    if (!req.file) { throw new Error('Please select file') }

    const jsonObj = await csvtojson().fromFile(req.file.path)
    const clean = jsonObj.map(item => { return { ...item, price: item.price.replace("$", "") } })

    const merchantName = req.params.name
    const merchant = await Merchant.findOne({ merchantName: merchantName })
    if (merchant) {
        merchant.merchantItems = clean
        merchant.save()
    } else {
        await Merchant.create({ merchantName, merchantItems: clean })
    }

    res.json(req.file.originalname);
})

// @desc Get All Merchants' names
// @route GET /api/merchants
// @access Staff
const getMerchants = asyncHandler(async (req, res) => {
    const merchants = await Merchant.find({}, { merchantName: 1, _id: 0 })
    const merchantsArr = merchants.map(merchant => merchant.merchantName)
    res.json(merchantsArr);
})

// @desc Get Single Merchant Info
// @route GET /api/merchants
// @access Staff
const getMerchant = asyncHandler(async (req, res) => {
    const merchantName = req.params.name
    const merchant = await Merchant.findOne({ merchantName: merchantName })
    if (merchant) {
        res.json(merchant);
    } else throw new Error('Merchant Not Found')
})



export {
    saveMerchant,
    getMerchants,
    getMerchant,
}