// routes/reminderRoutes.js
import express from 'express'
import { sendAttendanceReminders } from '../cronJobs/attendanceReminder.js'

const router = express.Router()

router.get('/test', async (req, res) => {
  await sendAttendanceReminders()
  res.send('Test reminders sent.')
})

export default router
