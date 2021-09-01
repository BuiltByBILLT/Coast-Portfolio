import express from 'express'
import {
    // addOrderItems,
    getOrderByID,
    // updateOrderToPaid,
    // updateOrderToDelivered,
    getMyOrders,
    getOrders,
} from '../controllers/orderController.js'
import { protect, admin, staff } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    // .post(protect, addOrderItems)
    .get(protect, staff, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(getOrderByID)
// router.route('/:id/pay').put(protect, updateOrderToPaid)
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router