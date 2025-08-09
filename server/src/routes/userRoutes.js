import express from 'express'
import {
  registerFingerprint,
  getUserProfile,
  updateUser,
  getAllUsers,
  getUsersByRole
} from '../controllers/userController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// 👤 User  fingerprint registration
router.post('/students/:id/fingerprint', protect, authorizeRoles('admin', 'teacher'), registerFingerprint);

// 👤 Logged-in user views own profile
router.get('/profile', protect, getUserProfile)

// 🛠️ Logged-in user updates own profile
router.put('/update', protect, updateUser)

// 🧑‍⚖️ Admin-only: fetch all users (or filter by role)
router.get('/', protect, authorizeRoles('admin'), (req, res, next) => {
  // If there's a role query (e.g. /api/users?role=teacher), filter by role
  if (req.query.role) {
    return getUsersByRole(req, res)
  }
  return getAllUsers(req, res)
})

export default router
