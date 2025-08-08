import express from 'express'
import {
  markAttendance,
  markBiometricAttendance ,
  markBatchAttendance,
  generateClassTrends,
  getStudentAttendance,
  getClassAttendance,
  updateAttendance,
  getClassSummary,
  getStudentSummary,
  exportClassAttendance,
  getClassThresholdViolations,
  getClassTrends

} from '../controllers/attendanceController.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { analyticsHook } from '../middleware/analyticsHook.js'

const router = express.Router()

// ✅ Mark single attendance with analytics
router.post('/mark', protect, authorizeRoles('teacher'), markAttendance, analyticsHook)
// ✅ Mark biometric attendance with analytics
router.post('/biometric', markBiometricAttendance)
// ✅ Mark batch attendance with analytics
router.post('/mark-batch', protect, authorizeRoles('teacher'), markBatchAttendance, analyticsHook)
// 📊 Generate class trends for analytics
router.post('/class/:id/trends/generate', protect, authorizeRoles('teacher','admin'), generateClassTrends)

// 🔧 Update attendance record
router.put('/:id', protect, authorizeRoles('teacher', 'admin'), updateAttendance)

// 📄 Get attendance for a student
router.get('/student/:id', protect, authorizeRoles('teacher', 'admin'), getStudentAttendance)

// 📊 Get summary stats for a student
router.get('/student/:id/summary', protect, authorizeRoles('teacher', 'admin', 'student'), getStudentSummary)

// 🏫 Get full class attendance
router.get('/class/:id', protect, authorizeRoles('admin'), getClassAttendance)

// 📊 Get summary stats for a class
router.get('/class/:id/summary', protect, authorizeRoles('admin'), getClassSummary)

// 📁 Export class attendance as CSV
router.get('/class/:id/export', protect, authorizeRoles('admin'), exportClassAttendance)

// 🚨 Get students below attendance threshold
router.get('/class/:id/violations', protect, authorizeRoles('admin'), getClassThresholdViolations)

// 📈 Get class attendance trends for dashboard
router.get('/class/:id/trends', protect, authorizeRoles('admin', 'teacher'), getClassTrends)

export default router
