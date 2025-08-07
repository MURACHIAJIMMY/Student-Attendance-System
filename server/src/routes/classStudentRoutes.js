import express from 'express'
import {
  addStudentsToClass,
  removeStudentFromClass,
  listStudentsInClass
} from '../controllers/classStudentController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

// Add students to a class
router.post('/', protect, authorizeRoles('admin', 'teacher'), addStudentsToClass)

// Remove a student from a class
router.delete('/:studentId', protect, authorizeRoles('admin', 'teacher'), removeStudentFromClass)

// List all students in a class
router.get('/', protect, authorizeRoles('admin', 'teacher'), listStudentsInClass)

export default router
