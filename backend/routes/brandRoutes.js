import express from 'express'
import { protect, staff } from '../middleware/authMiddleware.js'
import {
    getBrands,
    getBrand,
    newBrand,
    updateBrand,
    deleteBrand,
} from '../controllers/brandController.js'

// @route /api/brands/
const router = express.Router()
router.route('/')
    .get(protect, staff, getBrands)

router.route('/edit/:id')
    .get(protect, staff, getBrand)
    .post(protect, staff, newBrand)
    .put(protect, staff, updateBrand)
    .delete(protect, staff, deleteBrand)

export default router