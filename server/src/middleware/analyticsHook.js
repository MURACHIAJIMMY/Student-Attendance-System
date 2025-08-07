// middleware/analyticsHook.js
import AttendanceTrend from '../models/AttendanceTrend.js'
import { updateStatsCache } from '../utils/statsCache.js'

export const analyticsHook = async (req, res, next) => {
  const { classId, date } = req.body

  try {
    const stats = await updateStatsCache(classId, date)

    // Save to AttendanceTrend collection
    await AttendanceTrend.findOneAndUpdate(
      { classId, date: stats.date },
      stats,
      { upsert: true, new: true }
    )

    next()
  } catch (err) {
    console.error('Analytics Hook Error:', err)
    next()
  }
}
