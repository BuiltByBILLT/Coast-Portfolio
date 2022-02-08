import express from 'express'
import { protect, staff } from '../middleware/authMiddleware.js'
import {
    getPos,
    getPo,
    newPo,
    updatePo,
    deletePo,
} from '../controllers/poController.js'

// @route /api/pos/
const router = express.Router()
router.route('/')
    .get(getPos)
    .post(protect, staff, newPo)

router.route('/edit/:id')
    .get(protect, staff, getPo)
    .put(protect, staff, updatePo)
    .delete(protect, staff, deletePo)

export default router