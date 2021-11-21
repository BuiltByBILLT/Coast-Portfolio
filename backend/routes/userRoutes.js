import express from 'express'
import { admin, protect, staff } from '../middleware/authMiddleware.js'
import {
    addCartToUser,
    addWishToUser,
    authUser,
    deleteUser,
    getCartFromUser,
    getUserById,
    getUserProfile,
    getUsers,
    registerUser,
    removeWishFromUser,
    updateUser,
    updateUserProfile
} from '../controllers/userController.js'

const router = express.Router()

router.route('/')
    .get(protect, staff, getUsers)

router.post('/login', authUser) // Updated
router.post('/register', registerUser) // Updated

router.route('/profile')
    .get(protect, getUserProfile) // Updated
    .put(protect, updateUserProfile) // Updated

router.route('/cart')
    .get(protect, getCartFromUser)
    .post(protect, addCartToUser)

router.route('/wish/:pID')
    .post(protect, addWishToUser)
    .delete(protect, removeWishFromUser)

router.route('/:id')
    .delete(protect, staff, deleteUser)
    .get(protect, staff, getUserById)
    .put(protect, staff, updateUser)

export default router