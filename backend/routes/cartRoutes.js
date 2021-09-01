import express from 'express'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    getCart,
    saveCart
} from '../controllers/cartController.js'

const router = express.Router()

router.route('/')
    .post(protect, staff, saveCart)
router.route('/:id')
    .get(getCart)

export default router