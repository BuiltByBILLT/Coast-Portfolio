import express from 'express'
import {
    deleteInventory,
    getCloverIDs,
    getInventory,
    getInventoryItem,
    newInventory,
    updateInventory
} from '../controllers/inventoryController.js'
import { staff, protect } from '../middleware/authMiddleware.js'

// @route /api/inventory/
const router = express.Router()

router.route('/')
    .get(protect, staff, getInventory)

router.route('/cloverids')
    .get(protect, staff, getCloverIDs)

router.route('/edit/:id')
    .get(getInventoryItem)
    .put(protect, staff, updateInventory)
    .delete(protect, staff, deleteInventory)

router.route('/new')
    .post(protect, staff, newInventory)

export default router