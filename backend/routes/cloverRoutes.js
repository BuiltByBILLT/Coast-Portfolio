import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import {
    fetchTax,
    orderClover,
} from '../controllers/cloverController.js'

const router = express.Router()
router.route('/')
    .post(orderClover)
router.route('/tax')
    .post(fetchTax)



export default router