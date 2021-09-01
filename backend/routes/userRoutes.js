import express from 'express'
import { admin, protect, staff } from '../middleware/authMiddleware.js'
import {
    addCartToUser,
    authUser,
    deleteUser,
    getCartFromUser,
    getUserById,
    getUserProfile,
    getUsers,
    registerUser,
    updateUser,
    updateUserProfile
} from '../controllers/userController.js'

const router = express.Router()

router.route('/')
    .post(registerUser)
    .get(protect, staff, getUsers)
router.post('/login', authUser)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router.route('/:id')
    .delete(protect, staff, deleteUser)
    .get(protect, staff, getUserById)
    .put(protect, staff, updateUser)
router.route('/cart')
    .get(protect, getCartFromUser)
    .post(protect, addCartToUser)

export default router