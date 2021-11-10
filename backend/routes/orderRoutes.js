import express from 'express'
import {
    // addOrderItems,
    getOrderByID,
    // updateOrderToPaid,
    // updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getUnshippedOrders,
    getEmployeeOrders,
} from '../controllers/orderController.js'
import { protect, admin, staff } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    // .post(protect, addOrderItems)
    .get(protect, staff, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/employee').get(protect, getEmployeeOrders)
router.route('/unshipped').get(getUnshippedOrders)
router.route('/:id').get(getOrderByID)
// router.route('/:id/pay').put(protect, updateOrderToPaid)
// router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router