import express from 'express'
import { protect, staff } from '../middleware/authMiddleware.js'
import {
    getDiscounts,
    getDiscount,
    newDiscount,
    updateDiscount,
    deleteDiscount,
    applyDiscount,
} from '../controllers/discountController.js'

// @route /api/discounts/
const router = express.Router()
router.route('/')
    .get(protect, staff, getDiscounts)

router.route('/apply/:id')
    .post(applyDiscount)

router.route('/edit/:id')
    .get(protect, staff, getDiscount)
    .post(protect, staff, newDiscount)
    .put(protect, staff, updateDiscount)
    .delete(protect, staff, deleteDiscount)

export default router