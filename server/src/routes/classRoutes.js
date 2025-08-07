import express from 'express'
import { getStudentsByClass } from '../controllers/classController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:id/students', protect, authorizeRoles('teacher'), getStudentsByClass)

export default router
