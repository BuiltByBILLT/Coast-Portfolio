import express from 'express'
import asyncHandler from 'express-async-handler'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    addressVerification,
    createUPS,
} from '../controllers/upsController.js'
import Label from '../models/labelModel.js'

// @ /api/shipping
const router = express.Router()

router.get('/tracking/:orderID', asyncHandler(async (req, res) => {
    const label = await Label.findOne({ orderID: req.params.orderID })
    res.json({
        tracking: label ? label.tracking : "",
        raw: label ? label.raw : ""
    })
}))
router.route('/ups/AV')
    .post(addressVerification)

router.route('/ups/:orderID/:size')
    .post(protect, staff, createUPS)
// router.route('/usps')
// .post(createUSPS)


export default router