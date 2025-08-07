// cronJobs/attendanceReminder.js
import Attendance from '../models/Attendance.js'
import Class from '../models/Class.js'
import User from '../models/User.js'
import { NotificationService } from '../services/NotificationService.js'

export const sendAttendanceReminders = async () => {
  const today = new Date().toISOString().split('T')[0]
  const classes = await Class.find()

  for (const cls of classes) {
    const hasAttendance = await Attendance.exists({
      class: cls._id,
      date: today
    })

    if (!hasAttendance) {
      const teacher = await User.findById(cls.teacher)
      if (teacher) {
        await NotificationService.send({
          recipient: teacher._id,
          type: 'reminder',
          message: `Please submit attendance for ${cls.name} today.`,
          deliveryMethod: 'email'
        })
      }
    }
  }

  console.log(`✅ Reminders dispatched for ${today}`)
}
