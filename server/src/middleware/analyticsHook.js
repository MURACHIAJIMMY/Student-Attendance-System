import AttendanceTrend from '../models/AttendanceTrend.js'
import { updateStatsCache } from '../utils/statsCache.js'

export const analyticsHook = async (req, res, next) => {
  const { classId, date } = req.body

  if (!classId || !date) {
    console.warn('⚠️ analyticsHook skipped: missing classId or date')
    return next()
  }

  try {
    const stats = await updateStatsCache(classId, date)

    await AttendanceTrend.findOneAndUpdate(
      { classId, date: stats.date },
      { $set: stats },
      { upsert: true, new: true }
    )

    console.log(`📈 Analytics updated for ${stats.date} | Class ${classId}`)
    next()
  } catch (err) {
    console.error('❌ Analytics Hook Error:', err)
    next()
  }
}
