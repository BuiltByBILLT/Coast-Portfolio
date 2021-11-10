import express from 'express'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    fetchTax,
    orderClover,
    refundClover,
} from '../controllers/cloverController.js'

const router = express.Router()
router.route('/')
    .post(orderClover)
router.route('/tax')
    .post(fetchTax)
router.route('/refund')
    .post(protect, staff, refundClover)


export default router