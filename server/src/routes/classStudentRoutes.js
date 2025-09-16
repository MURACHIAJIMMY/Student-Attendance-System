import express from 'express';
import {
  addStudentsToClass,
  removeStudentFromClass,
  listStudentsInClass
} from '../controllers/classStudentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// ✅ Diagnostic log to confirm route is matched
router.use((req, res, next) => {
  console.log(`✅ /students route hit for classId: ${req.params.classId}`);
  next();
});

// 📋 List all students in a class
router.get('/', protect, authorizeRoles('admin', 'teacher'), listStudentsInClass);

// ➕ Add students to a class
router.put('/', protect, authorizeRoles('admin', 'teacher'), addStudentsToClass);

// ❌ Remove a student from a class
router.delete('/:studentId', protect, authorizeRoles('admin', 'teacher'), removeStudentFromClass);

export default router;
