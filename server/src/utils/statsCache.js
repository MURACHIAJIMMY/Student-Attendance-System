// utils/statsCache.js
import Attendance from '../models/Attendance.js'

export const updateStatsCache = async (classId, date) => {
  // Fetch attendance records for the class on the given date
  const records = await Attendance.find({ classId, date })

  const totalPresent = records.filter(r => r.status === 'present').length
  const totalAbsent = records.length - totalPresent

  return {
    classId,
    date,
    totalPresent,
    totalAbsent,
  }
}
