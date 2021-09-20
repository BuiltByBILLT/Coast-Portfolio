import express from 'express'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    getLowInv,
    getAverage
} from '../controllers/reportController.js'

const router = express.Router()

// /api/reports
router.route('/average')
    .get(protect, staff, getAverage)
router.route('/low')
    .get(protect, staff, getLowInv)

export default router