import express from 'express'
import {
    createProduct,
    // createProductReview,
    deleteProduct,
    getProductById,
    getProducts,
    getSuggestedProducts,
    // getTopProducts,
    updateProduct,
    updateImages
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
router.route('/images/:id')
    .put(protect, staff, updateImages)

export default router