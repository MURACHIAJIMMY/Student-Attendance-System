import Attendance from '../models/Attendance.js'

export const updateStatsCache = async (classId, date) => {
  if (!classId || !date) {
    throw new Error('Missing classId or date for stats cache update')
  }

  // Parse date and define UTC-safe range
  const targetDate = new Date(date)
  const startOfDay = new Date(targetDate)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date(targetDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  // Fetch attendance records for the class on the given date
  const records = await Attendance.find({
    classId,
    date: { $gte: startOfDay, $lte: endOfDay }
  })

  const totalPresent = records.filter(r => r.status === 'present').length
  const totalAbsent = records.length - totalPresent

  const stats = {
    classId,
    date: targetDate.toISOString().split('T')[0],
    totalMarked: records.length,
    totalPresent,
    totalAbsent
  }

  // Optional: log for audit/debug
  console.log(`📊 Stats cached for ${stats.date} | Class ${classId}: ${totalPresent} present, ${totalAbsent} absent`)

  return stats
}
