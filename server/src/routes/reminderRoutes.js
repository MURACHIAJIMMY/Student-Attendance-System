import express from 'express'
import { sendAttendanceReminders } from '../cronJobs/attendanceReminder.js'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// 🔒 Protect this route to avoid accidental or unauthorized triggering
router.get('/test', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await sendAttendanceReminders()
    res.status(200).json({ message: '✅ Test reminders dispatched successfully.' })
  } catch (error) {
    console.error('Reminder test failed:', error)
    res.status(500).json({ error: '❌ Failed to dispatch test reminders.' })
  }
})

export default router
