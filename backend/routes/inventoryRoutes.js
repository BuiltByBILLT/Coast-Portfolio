import express from 'express'
import {
    getInventory,
    getInventoryById
} from '../controllers/inventoryController.js'
import { staff, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, staff, getInventory)
// .post(protect, staff, createProduct)
// router.route('/:id/reviews').post(protect, createProductReview)
// router.get(`/top`, getTopProducts)
// router.get(`/suggested`, getSuggestedProducts)
router.route('/:id')
    .get(protect, staff, getInventoryById)
// .delete(protect, staff, deleteProduct)
// .put(protect, staff, updateProduct)
// router.route('/images/:id')
// .put(protect, staff, updateImages)

export default router