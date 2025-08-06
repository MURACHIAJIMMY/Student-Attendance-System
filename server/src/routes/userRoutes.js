import express from 'express'
import {
  getUserProfile,
  updateUser,
  getAllUsers
} from '../controllers/userController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// Logged-in user views own profile
router.get('/profile', protect, getUserProfile)

// Logged-in user updates own profile
router.put('/update', protect, updateUser)

// Admin-only: fetch all users
router.get('/', protect, authorizeRoles('admin'), getAllUsers)

export default router
