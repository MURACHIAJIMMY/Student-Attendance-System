import Attendance from '../models/Attendance.js'
import User from '../models/User.js'
import { NotificationService } from '../services/NotificationService.js'
import { Parser } from 'json2csv'
import AttendanceTrend from '../models/AttendanceTrend.js'
import { updateStatsCache } from '../utils/statsCache.js'

/**
 * Mark single attendance
 */
export const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, reason, excused } = req.body

    // 🔒 Basic input validation
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields: studentId, classId, date, and status are mandatory.' })
    }
    const record = await Attendance.create({
      student: studentId,
      class: classId,
      date,
      status,
      reason,
      excused,
        markedBy: {
    _id: req.user._id,
    name: req.user.name
  }
    })

    if (status === 'absent' && !excused) {
      const student = await User.findById(studentId)

      if (student) {
        await NotificationService.send({
          recipient: student._id,
          type: 'absence',
          message: `You missed class on ${new Date(date).toDateString()}.`,
          deliveryMethod: 'email',
          metadata: {
            attendanceId: record._id,
            date,
            classId,
            reason,
            excused
          }
        })
      }
    }

    req.io.emit('attendance:marked', {
      studentId,
      classId,
      date,
      status,
      excused,
        markedBy: {
    _id: req.user._id,
    name: req.user.name
  }
    })

    res.status(201).json({ message: 'Attendance recorded', record })
  } catch (err) {
    console.error('[markAttendance]', err)
    res.status(500).json({ error: 'Server error while marking attendance' })
  }
}
/**
 * Mark attendance via biometric fingerprint
 */
export const markBiometricAttendance = async (req, res) => {
  try {
    const { fingerprintHash, classId, date } = req.body
    const attendanceDate = date ? new Date(date) : new Date()

    const student = await User.findOne({ fingerprintHash })
    if (!student) {
      return res.status(404).json({ error: 'Fingerprint not recognized' })
    }

    const existing = await Attendance.findOne({
      student: student._id,
      class: classId,
      date: attendanceDate
    })

    if (existing) {
      return res.status(409).json({ error: 'Attendance already marked for this student' })
    }

   const record = await Attendance.create({
  student: student._id,
  class: classId,
  date: attendanceDate,
  status: 'present',
  markedBy: req.user
    ? { _id: req.user._id, name: req.user.name }
    : { _id: null, name: 'System' },
  source: 'biometric'
})

req.io.emit('attendance:marked', {
  studentId: student._id,
  classId,
  date: attendanceDate,
  status: 'present',
  markedBy: req.user
    ? { _id: req.user._id, name: req.user.name }
    : { _id: null, name: 'System' },
  source: 'biometric'
})

    res.status(201).json({ message: 'Biometric attendance recorded', record })
  } catch (err) {
    console.error('[markBiometricAttendance]', err)
    res.status(500).json({ error: 'Failed to record biometric attendance' })
  }
}

/**
 * Mark batch attendance
 */
export const markBatchAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body
    const results = []

   for (const record of records) {
  const { studentId, status, reason, excused } = record

  const attendance = await Attendance.create({
    student: studentId,
    class: classId,
    date,
    status,
    reason,
    excused,
    markedBy: {
      _id: req.user._id,
      name: req.user.name
    }
  })

  if (status === 'absent' && !excused) {
    const student = await User.findById(studentId)

    if (student) {
      await NotificationService.send({
        recipient: student._id,
        type: 'absence',
        message: `You missed class on ${new Date(date).toDateString()}.`,
        deliveryMethod: 'email',
        metadata: {
          attendanceId: attendance._id,
          date,
          classId,
          reason,
          excused
        }
      })
    }
  }

  results.push(attendance)
}

req.io.emit('attendance:batchMarked', {
  classId,
  date,
  count: results.length,
  markedBy: {
    _id: req.user._id,
    name: req.user.name
  }
})
    res.status(201).json({ message: 'Batch attendance recorded', records: results })
  } catch (err) {
    console.error('[markBatchAttendance]', err)
    res.status(500).json({ error: 'Failed to record batch attendance' })
  }
}

/**
 * Update existing attendance record
 */
export const updateAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id
    const updates = req.body

    const record = await Attendance.findById(attendanceId)
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' })
    }

    const allowedFields = ['status', 'reason', 'excused']
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        record[field] = updates[field]
      }
    })

    const updated = await record.save()

    req.io.emit('attendance:updated', {
      attendanceId,
      updates,
      updatedBy: req.user._id
    })

    res.status(200).json({ message: 'Attendance updated', updated })
  } catch (err) {
    console.error('[updateAttendance]', err)
    res.status(500).json({ error: 'Failed to update attendance' })
  }
}

/**
 * Fetch attendance by student
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id
    const records = await Attendance.find({ student: studentId })
      .populate('class', 'name')
      .sort({ date: -1 })

    res.status(200).json(records)
  } catch (err) {
    console.error('[getStudentAttendance]', err)
    res.status(500).json({ error: 'Error fetching attendance records' })
  }
}

/**
 * Fetch full class attendance
 */
export const getClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id
    const records = await Attendance.find({ class: classId })
      .populate('student', 'name')
      .sort({ date: -1 })

    res.status(200).json(records)
  } catch (err) {
    console.error('[getClassAttendance]', err)
    res.status(500).json({ error: 'Error fetching class attendance' })
  }
}

/**
 * Fetch summary stats for a class
 */
export const getClassSummary = async (req, res) => {
  try {
    const classId = req.params.id
    const records = await Attendance.find({ class: classId })

    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1
        acc[record.status] = (acc[record.status] || 0) + 1
        return acc
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    )

    res.status(200).json({ classId, stats })
  } catch (err) {
    console.error('[getClassSummary]', err)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
}

/**
 * Fetch summary stats for a student
 */
export const getStudentSummary = async (req, res) => {
  try {
    const studentId = req.params.id
    const { from, to } = req.query

    const query = { student: studentId }
    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) }
    }

    const records = await Attendance.find(query)

    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1
        acc[record.status] = (acc[record.status] || 0) + 1
        return acc
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    )

    const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : '0.00'
    const belowThreshold = parseFloat(percentage) < 75

    res.status(200).json({
      studentId,
      stats,
      percentage: `${percentage}%`,
      belowThreshold
    })
  } catch (err) {
    console.error('[getStudentSummary]', err)
    res.status(500).json({ error: 'Failed to generate student summary' })
  }
}

/**
 * Export class attendance as CSV
 */
export const exportClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id
    const records = await Attendance.find({ class: classId })
      .populate('student', 'name email')
      .sort({ date: 1 })

    const data = records.map(r => ({
      studentName: r.student.name,
      studentEmail: r.student.email,
      date: r.date.toISOString().split('T')[0],
      status: r.status,
      reason: r.reason || '',
      excused: r.excused ? 'Yes' : 'No'
    }))

    const parser = new Parser()
    const csv = parser.parse(data)

    res.header('Content-Type', 'text/csv')
    res.attachment(`class_${classId}_attendance.csv`)
    res.send(csv)
  } catch (err) {
    console.error('[exportClassAttendance]', err)
    res.status(500).json({ error: 'Failed to export attendance' })
  }
}

/**
 * Get students below attendance threshold in a class
 */
export const getClassThresholdViolations = async (req, res) => {
  try {
    const classId = req.params.id
    const students = await Attendance.distinct('student', { class: classId })

    const violations = []

    for (const studentId of students) {
      const records = await Attendance.find({ class: classId, student: studentId })
      const stats = records.reduce(
        (acc, r) => {
          acc.total += 1
          acc[r.status] = (acc[r.status] || 0) + 1
          return acc
        },
        { total: 0, present: 0, absent: 0, late: 0 }
      )
      const percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0
      if (percentage < 75) {
        const student = await User.findById(studentId).select('name email')
        violations.push({
          studentId,
          name: student?.name || "Unknown",
          email: student?.email || "Unknown",
          percentage: percentage.toFixed(2),
        });
      }
    }

    res.status(200).json({ classId, violations })
  } catch (err) {
    console.error('[getClassThresholdViolations]', err)
    res.status(500).json({ error: 'Failed to fetch threshold violations' })
  }
}
// Get attendance trends for a class

export const getClassTrends = async (req, res) => {
  const classId = req.params.id

  try {
    const trends = await AttendanceTrend.find({ classId }).sort({ date: 1 })
    res.status(200).json(trends)
  } catch (err) {
    console.error('Trend fetch error:', err)
    res.status(500).json({ message: 'Failed to fetch trends' })
  }
}
