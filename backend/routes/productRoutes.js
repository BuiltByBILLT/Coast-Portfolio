import express from 'express'
import {
    createProduct,
    // createProductReview,
    deleteProduct,
    getProductById,
    getProducts,
    getSuggestedProducts,
    // getTopProducts,
    updateProduct
} from '../controllers/productController.js'
import { staff, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(getProducts)
    .post(protect, staff, createProduct)
// router.route('/:id/reviews').post(protect, createProductReview)
// router.get(`/top`, getTopProducts)
router.get(`/suggested`, getSuggestedProducts)
router.route('/:id')
    .get(getProductById)
    .delete(protect, staff, deleteProduct)
    .put(protect, staff, updateProduct)

export default router