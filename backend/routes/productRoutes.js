import express from 'express'
import {
    deleteProduct,
    getProductDetails,
    getProducts,
    getSuggestedProducts,
    updateProduct,
    updateImages,
    getProduct,
    newProduct,
    getPIDs
} from '../controllers/productController.js'
import { staff, protect, check } from '../middleware/authMiddleware.js'

// @route /api/products/
const router = express.Router()

router.route('/')
    .get(check, getProducts)

router.route('/details/:id')
    .get(getProductDetails)

router.get(`/PIDs`, protect, getPIDs)
router.route('/edit/:id')
    .get(getProduct)
    .post(protect, staff, newProduct)
    .put(protect, staff, updateProduct)
    .delete(protect, staff, deleteProduct)

router.route('/images/:id')
    .put(protect, staff, updateImages)

router.get(`/suggested`, getSuggestedProducts)


export default router