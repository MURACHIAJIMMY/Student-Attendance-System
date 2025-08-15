import express from 'express'
import {
  addStudentsToClass,
  removeStudentFromClass,
  listStudentsInClass
} from '../controllers/classStudentController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

// Add students to a class
router.put('/:classId', protect, authorizeRoles('admin', 'teacher'), addStudentsToClass)

// Remove a student from a class
router.delete('/:classId/:studentId', protect, authorizeRoles('admin', 'teacher'), removeStudentFromClass)

// List all students in a class
router.get('/:classId', protect, authorizeRoles('admin', 'teacher'), listStudentsInClass)

export default router
