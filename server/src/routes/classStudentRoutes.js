import express from 'express'
import {
  addStudentsToClass,
  removeStudentFromClass,
  listStudentsInClass
} from '../controllers/classStudentController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

// Add students to a class by ID
router.put('/:classId/students', protect, authorizeRoles('admin', 'teacher'), addStudentsToClass)

// Remove a student from a class
router.delete('/:classId/students/:studentId', protect, authorizeRoles('admin', 'teacher'), removeStudentFromClass)

// List all students in a class (supports ID or name)
router.get('/:idOrName/students', protect, authorizeRoles('admin', 'teacher'), listStudentsInClass)

export default router
