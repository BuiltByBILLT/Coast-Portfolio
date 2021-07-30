import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import {
    getCategories,
    getCategoryDetails,
    getCategoryProducts,
    getTopCategories
} from '../controllers/categoryController.js'

const router = express.Router()
router.route('/')
    .get(getCategories)
router.route('/top')
    .get(getTopCategories)
router.route('/:id')
    .get(getCategoryDetails)
router.route('/:id/products')
    .get(getCategoryProducts)


export default router