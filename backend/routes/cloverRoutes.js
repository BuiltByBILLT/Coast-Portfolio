import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import {
    fetchTax,
    orderClover,
    validate,
} from '../controllers/cloverController.js'

const router = express.Router()
router.route('/')
    .post(orderClover)
router.route('/tax')
    .post(fetchTax)
router.route('/validate')
    .post(validate)



export default router