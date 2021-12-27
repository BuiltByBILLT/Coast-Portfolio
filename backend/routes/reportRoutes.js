import express from 'express'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    getLowInv,
    // getAverage,
    customRangeReport,
    dodReport,
    momReport,
    yoyReport
} from '../controllers/reportController.js'

const router = express.Router()

// @ /api/reports
// router.route('/average')
//     .get(protect, staff, getAverage)
router.route('/low')
    .get(protect, staff, getLowInv)
router.route('/custom')
    .post(protect, staff, customRangeReport)
router.route('/dod')
    .post(protect, staff, dodReport)
router.route('/mom')
    .post(protect, staff, momReport)
router.route('/yoy')
    .post(protect, staff, yoyReport)

export default router