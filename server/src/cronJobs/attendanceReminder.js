import Attendance from '../models/Attendance.js'
import Class from '../models/Class.js'
import User from '../models/User.js'
import { NotificationService } from '../services/NotificationService.js'

export const sendAttendanceReminders = async () => {
  const today = new Date().toISOString().split('T')[0]

  // Define UTC-safe date range
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setUTCHours(23, 59, 59, 999)

  try {
    const classes = await Class.find()

    const reminders = await Promise.all(classes.map(async cls => {
      const hasAttendance = await Attendance.exists({
        class: cls._id,
        date: { $gte: startOfDay, $lte: endOfDay }
      })

      if (!hasAttendance) {
        const teacher = await User.findById(cls.teacher)
        if (teacher) {
          return NotificationService.send({
            recipient: teacher._id,
            type: 'reminder',
            message: `Please submit attendance for ${cls.name} today.`,
            deliveryMethod: 'email'
          })
        }
      }

      return null
    }))

    const sentCount = reminders.filter(Boolean).length
    console.log(`✅ ${sentCount} attendance reminders dispatched for ${today}`)
  } catch (error) {
    console.error('❌ Attendance reminder job failed:', error)
  }
}
