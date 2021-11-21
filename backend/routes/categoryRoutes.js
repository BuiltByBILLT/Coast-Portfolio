import express from 'express'
import { protect, staff, check } from '../middleware/authMiddleware.js'
import {
    getCategories,
    getCategory,
    getCategoryDetails,
    getCategoryProducts,
    newCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js'


// Finished

// @route /api/categories/
const router = express.Router()
router.route('/')
    .get(check, getCategories)

router.route('/details/:id/')
    .get(getCategoryDetails)

router.route('/products/:id')
    .get(getCategoryProducts)

router.route('/edit/:id')
    .get(protect, staff, getCategory)
    .post(protect, staff, newCategory)
    .put(protect, staff, updateCategory)
    .delete(protect, staff, deleteCategory)




export default router