import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { NotificationService } from "../services/NotificationService.js";
import { Parser } from "json2csv";
import AttendanceTrend from "../models/AttendanceTrend.js";
import { updateStatsCache } from "../utils/statsCache.js";
/**
 * Resolve studentId from admNo if needed
 */
const resolveStudentId = async ({ studentId, admNo }) => {
  if (studentId) return studentId;

  if (!admNo) throw new Error("Either studentId or admNo must be provided.");

  const student = await User.findOne({ admNo }).select("_id");
  if (!student) throw new Error(`No student found with admNo: ${admNo}`);

  return student._id;
};

/**
 * Notify student of unexcused absence
 */
const notifyAbsence = async ({
  studentId,
  attendanceDate,
  classId,
  reason,
  excused,
  recordId,
}) => {
  const student = await User.findById(studentId).select("name email");
  if (!student) return;

  await NotificationService.send({
    recipient: student._id,
    type: "absence",
    message: `You missed class on ${attendanceDate.toDateString()}.`,
    deliveryMethod: "email",
    metadata: {
      attendanceId: recordId,
      date: attendanceDate,
      classId,
      reason,
      excused,
    },
  });
};

/**
 * Mark single attendance
 */
export const markAttendance = async (req, res) => {
  try {
    const { studentId, admNo, classId, date, status, reason, excused } =
      req.body;

    // Basic validation
    if (!classId || !date || !status) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: classId, date, and status are mandatory.",
        });
    }

    const resolvedStudentId = await resolveStudentId({ studentId, admNo });
    const attendanceDate = new Date(date);

    // Prevent duplicate attendance
    const existing = await Attendance.findOne({
      student: resolvedStudentId,
      class: classId,
      date: attendanceDate,
    });

    if (existing) {
      return res
        .status(409)
        .json({
          error: "Attendance already marked for this student on this date.",
        });
    }

    // Create attendance record
    const record = await Attendance.create({
      student: resolvedStudentId,
      class: classId,
      date: attendanceDate,
      status,
      reason,
      excused,
      markedBy: {
        _id: req.user._id,
        name: req.user.name,
      },
    });

    // Notify if absent and not excused
    if (status === "absent" && !excused) {
      await notifyAbsence({
        studentId: resolvedStudentId,
        attendanceDate,
        classId,
        reason,
        excused,
        recordId: record._id,
      });
    }

    // Emit real-time update
    req.io.emit("attendance:marked", {
      studentId: resolvedStudentId,
      classId,
      date: attendanceDate,
      status,
      excused,
      markedBy: {
        _id: req.user._id,
        name: req.user.name,
      },
    });

    // Populate student and class info for response
    const populatedRecord = await Attendance.findById(record._id)
      .populate("student", "name admNo")
      .populate("class", "name");

    res
      .status(201)
      .json({ message: "Attendance recorded", record: populatedRecord });
  } catch (err) {
    console.error("[markAttendance]", err);
    res
      .status(500)
      .json({ error: err.message || "Server error while marking attendance" });
  }
};
// mark attendance using biometric data
export const markBiometricAttendance = async (req, res) => {
  try {
    const { fingerprintHash, classId, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();

    if (!fingerprintHash || !classId) {
      return res.status(400).json({ error: 'Missing required fields: fingerprintHash and classId are mandatory.' });
    }

    const student = await User.findOne({ fingerprintHash });
    if (!student) {
      return res.status(404).json({ error: 'Fingerprint not recognized' });
    }

    const existing = await Attendance.findOne({
      student: student._id,
      class: classId,
      date: attendanceDate
    });

    if (existing) {
      return res.status(409).json({ error: 'Attendance already marked for this student' });
    }

    const markedBy = req.user
      ? { _id: req.user._id, name: req.user.name }
      : { _id: null, name: 'System' };

    const record = await Attendance.create({
      student: student._id,
      class: classId,
      date: attendanceDate,
      status: 'present',
      markedBy,
      source: 'biometric'
    });

    req.io.emit('attendance:marked', {
      studentId: student._id,
      classId,
      date: attendanceDate,
      status: 'present',
      markedBy,
      source: 'biometric'
    });

    const populatedRecord = await Attendance.findById(record._id)
      .populate('student', 'name admNo')
      .populate('class', 'name');

    res.status(201).json({ message: 'Biometric attendance recorded', record: populatedRecord });
  } catch (err) {
    console.error('[markBiometricAttendance]', err);
    res.status(500).json({ error: err.message || 'Failed to record biometric attendance' });
  }
};


// mark batch attendance
/**
 * Mark batch attendance
 */
export const markBatchAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();
    const results = [];

    for (const record of records) {
      const { studentId, status, reason, excused } = record;

      const attendance = await Attendance.create({
        student: studentId,
        class: classId,
        date: attendanceDate,
        status,
        reason,
        excused,
        markedBy: {
          _id: req.user._id,
          name: req.user.name,
        },
        source: 'manual'
      });

      if (status === 'absent' && !excused) {
        const student = await User.findById(studentId);
        if (student) {
          await NotificationService.send({
            recipient: student._id,
            type: 'absence',
            message: `You missed class on ${attendanceDate.toDateString()}.`,
            deliveryMethod: 'email',
            metadata: {
              attendanceId: attendance._id,
              date: attendanceDate,
              classId,
              reason,
              excused,
            },
          });
        }
      }

      const populated = await Attendance.findById(attendance._id)
        .populate('student', 'name admNo')
        .populate('class', 'name');

      results.push(populated);
    }

    req.io.emit('attendance:batchMarked', {
      classId,
      date: attendanceDate,
      count: results.length,
      markedBy: {
        _id: req.user._id,
        name: req.user.name,
      },
    });

    res.status(201).json({
      message: 'Batch attendance recorded',
      records: results,
    });
  } catch (err) {
    console.error('[markBatchAttendance]', err);
    res.status(500).json({ error: 'Failed to record batch attendance' });
  }
};

/**
 * Update existing attendance record
 */
export const updateAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const updates = req.body;

    const record = await Attendance.findById(attendanceId);
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    const allowedFields = ['status', 'reason', 'excused'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        record[field] = updates[field];
      }
    });

    const updated = await record.save();

    req.io.emit('attendance:updated', {
      attendanceId,
      updates,
      updatedBy: req.user._id,
    });

    const populated = await Attendance.findById(updated._id)
      .populate('student', 'name admNo')
      .populate('class', 'name');

    res.status(200).json({
      message: 'Attendance updated',
      record: populated,
    });
  } catch (err) {
    console.error('[updateAttendance]', err);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

/**
 * Fetch attendance by student
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;

    const records = await Attendance.find({ student: studentId })
      .populate('class', 'name')
      .populate('student', 'name admNo')
      .sort({ date: -1 });

    res.status(200).json({
      studentId,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error('[getStudentAttendance]', err);
    res.status(500).json({ error: 'Error fetching attendance records' });
  }
};

/**
 * Fetch full class attendance
 */
export const getClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id;

    const records = await Attendance.find({ class: classId })
      .populate('student', 'name admNo')
      .populate('class', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      classId,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error('[getClassAttendance]', err);
    res.status(500).json({ error: 'Error fetching class attendance' });
  }
};

/**
 * Fetch summary stats for a class
 */
export const getClassSummary = async (req, res) => {
  try {
    const classId = req.params.id;

    const records = await Attendance.find({ class: classId });

    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );

    res.status(200).json({
      classId,
      count: records.length,
      stats,
    });
  } catch (err) {
    console.error('[getClassSummary]', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

/**
 * Fetch summary stats for a student
 */
export const getStudentSummary = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { from, to } = req.query;

    const query = { student: studentId };
    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const records = await Attendance.find(query);

    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );

    const percentage =
      stats.total > 0
        ? ((stats.present / stats.total) * 100).toFixed(2)
        : '0.00';

    const belowThreshold = parseFloat(percentage) < 75;

    res.status(200).json({
      studentId,
      range: from && to ? { from, to } : null,
      count: records.length,
      stats,
      percentage: `${percentage}%`,
      belowThreshold,
    });
  } catch (err) {
    console.error('[getStudentSummary]', err);
    res.status(500).json({ error: 'Failed to generate student summary' });
  }
};

/**
 * Export class attendance as CSV
 */
export const exportClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id;

    const records = await Attendance.find({ class: classId })
      .populate('student', 'name email admNo')
      .populate('class', 'name')
      .sort({ date: 1 });

    const data = records.map((r) => ({
      AdmissionNo: r.student.admNo,
      StudentName: r.student.name,
      StudentEmail: r.student.email,
      Class: r.class?.name || '',
      Date: r.date.toISOString().split('T')[0],
      Status: r.status,
      Reason: r.reason || '',
      Excused: r.excused ? 'Yes' : 'No',
      Source: r.source || 'manual',
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    const className = records[0]?.class?.name?.replace(/\s+/g, '_') || 'class';
    res.header('Content-Type', 'text/csv');
    res.attachment(`${className}_${classId}_attendance.csv`);
    res.send(csv);
  } catch (err) {
    console.error('[exportClassAttendance]', err);
    res.status(500).json({ error: 'Failed to export attendance' });
  }
};
/**
 * Get students below attendance threshold in a class
 */
export const getClassThresholdViolations = async (req, res) => {
  try {
    const classId = req.params.id;
    const students = await Attendance.distinct('student', { class: classId });

    const violations = [];

    for (const studentId of students) {
      const records = await Attendance.find({
        class: classId,
        student: studentId,
      });

      const stats = records.reduce(
        (acc, r) => {
          acc.total += 1;
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        },
        { total: 0, present: 0, absent: 0, late: 0 }
      );

      const percentage =
        stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

      if (percentage < 75) {
        const student = await User.findById(studentId).select('name email admNo');
        violations.push({
          studentId,
          admNo: student?.admNo || 'N/A',
          name: student?.name || 'Unknown',
          email: student?.email || 'Unknown',
          percentage: percentage.toFixed(2),
          totalSessions: stats.total,
          presentSessions: stats.present,
        });
      }
    }

    res.status(200).json({
      classId,
      count: violations.length,
      violations,
    });
  } catch (err) {
    console.error('[getClassThresholdViolations]', err);
    res.status(500).json({ error: 'Failed to fetch threshold violations' });
  }
};

// Get attendance trends for a class
export const getClassTrends = async (req, res) => {
  const classId = req.params.id;

  try {
    const trends = await AttendanceTrend.find({ classId }).sort({ date: 1 });

    res.status(200).json({
      classId,
      count: trends.length,
      trends,
    });
  } catch (err) {
    console.error('[getClassTrends]', err);
    res.status(500).json({ message: 'Failed to fetch trends' });
  }
};


export const generateClassTrends = async (req, res) => {
  const { id: classId } = req.params

  try {
    // Aggregate attendance by date for the given class
    const trends = await Attendance.aggregate([
      { $match: { classId } },
      {
        $group: {
          _id: '$date',
          totalMarked: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          absentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 } // Sort by date ascending
      }
    ])

    // Format response
    const formatted = trends.map(t => ({
      date: t._id,
      present: t.presentCount,
      absent: t.absentCount,
      total: t.totalMarked
    }))

    res.status(200).json({ classId, trends: formatted })
  } catch (error) {
    console.error('Trend generation failed:', error)
    res.status(500).json({ error: 'Failed to generate class trends' })
  }
}
