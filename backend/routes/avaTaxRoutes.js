import express from 'express'
import { staff, protect } from '../middleware/authMiddleware.js'
import {
    addressTax,
    fetchTax,
} from '../controllers/avaTaxController.js'


// @ /api/tax
const router = express.Router()

router.route('/fetch')
    .post(fetchTax)
router.route('/address')
    .get(addressTax)


export default router