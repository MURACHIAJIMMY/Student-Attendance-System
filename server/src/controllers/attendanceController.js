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
    const { studentId, classId, date, status, reason, excused } = req.body;

    // 🔒 Basic input validation
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({
        error: 'Missing required fields: studentId, classId, date, and status are mandatory.'
      });
    }

    // 🔍 Fetch student and class details
    const student = await User.findById(studentId);
    const classDoc = await Class.findById(classId);

    if (!student || !classDoc) {
      return res.status(404).json({ error: 'Invalid student or class ID' });
    }

    // 📝 Create attendance record with embedded names
    const record = await Attendance.create({
      student: {
        _id: student._id,
        name: student.name
      },
      class: {
        _id: classDoc._id,
        name: classDoc.name
      },
      date,
      status,
      reason,
      excused,
      markedBy: {
        _id: req.user._id,
        name: req.user.name
      }
    });

    // 📧 Trigger notification if absent and not excused
    if (status === 'absent' && !excused) {
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
      });
    }

    // 📡 Emit real-time event
    req.io.emit('attendance:marked', {
      student: {
        _id: student._id,
        name: student.name
      },
      class: {
        _id: classDoc._id,
        name: classDoc.name
      },
      date,
      status,
      excused,
      markedBy: {
        _id: req.user._id,
        name: req.user.name
      }
    });

    // ✅ Respond with success
    res.status(201).json({ message: 'Attendance recorded', record });
  } catch (err) {
    console.error('[markAttendance]', err);
    res.status(500).json({ error: 'Server error while marking attendance' });
  }
};
/**
 * Mark attendance via biometric fingerprint
 */
export const markBiometricAttendance = async (req, res) => {
  try {
    const { fingerprintHash, classId, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();

    // 🔍 Identify student by fingerprint
    const student = await User.findOne({ fingerprintHash });
    if (!student) {
      return res.status(404).json({ error: 'Fingerprint not recognized' });
    }

    // 🔍 Fetch class details
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: 'Invalid class ID' });
    }

    // 🔎 Check for existing attendance
    const existing = await Attendance.findOne({
      'student._id': student._id,
      'class._id': classDoc._id,
      date: attendanceDate
    });

    if (existing) {
      return res.status(409).json({ error: 'Attendance already marked for this student' });
    }

    // 📝 Create attendance record with embedded names
    const record = await Attendance.create({
      student: {
        _id: student._id,
        name: student.name
      },
      class: {
        _id: classDoc._id,
        name: classDoc.name
      },
      date: attendanceDate,
      status: 'present',
      markedBy: req.user
        ? { _id: req.user._id, name: req.user.name }
        : { _id: null, name: 'System' },
      source: 'biometric'
    });

    // 📡 Emit real-time event
    req.io.emit('attendance:marked', {
      student: {
        _id: student._id,
        name: student.name
      },
      class: {
        _id: classDoc._id,
        name: classDoc.name
      },
      date: attendanceDate,
      status: 'present',
      markedBy: req.user
        ? { _id: req.user._id, name: req.user.name }
        : { _id: null, name: 'System' },
      source: 'biometric'
    });

    // ✅ Respond with success
    res.status(201).json({ message: 'Biometric attendance recorded', record });
  } catch (err) {
    console.error('[markBiometricAttendance]', err);
    res.status(500).json({ error: 'Failed to record biometric attendance' });
  }
};
/**
 * Mark batch attendance
 */
export const markBatchAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;
    const results = [];

    // 🔍 Fetch class details once
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ error: 'Invalid class ID' });
    }

    for (const record of records) {
      const { studentId, status, reason, excused } = record;

      // 🔍 Fetch student details
      const student = await User.findById(studentId);
      if (!student) {
        results.push({ error: `Student not found: ${studentId}` });
        continue;
      }

      // 📝 Create attendance record with embedded names
      const attendance = await Attendance.create({
        student: {
          _id: student._id,
          name: student.name
        },
        class: {
          _id: classDoc._id,
          name: classDoc.name
        },
        date,
        status,
        reason,
        excused,
        markedBy: {
          _id: req.user._id,
          name: req.user.name
        }
      });

      // 📧 Trigger notification if absent and not excused
      if (status === 'absent' && !excused) {
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
        });
      }

      results.push(attendance);
    }

    // 📡 Emit real-time batch event
    req.io.emit('attendance:batchMarked', {
      class: {
        _id: classDoc._id,
        name: classDoc.name
      },
      date,
      count: results.length,
      markedBy: {
        _id: req.user._id,
        name: req.user.name
      }
    });

    // ✅ Respond with success
    res.status(201).json({ message: 'Batch attendance recorded', records: results });
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

    // 🔍 Find existing record
    const record = await Attendance.findById(attendanceId);
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // ✅ Apply allowed updates
    const allowedFields = ['status', 'reason', 'excused'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        record[field] = updates[field];
      }
    });

    // 📝 Optionally track who updated it
    record.markedBy = {
      _id: req.user._id,
      name: req.user.name
    };

    const updated = await record.save();

    // 📡 Emit real-time update event
    req.io.emit('attendance:updated', {
      attendanceId,
      student: record.student,
      class: record.class,
      updates: {
        status: updated.status,
        reason: updated.reason,
        excused: updated.excused
      },
      updatedBy: {
        _id: req.user._id,
        name: req.user.name
      }
    });

    // ✅ Respond with success
    res.status(200).json({ message: 'Attendance updated', updated });
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

    const records = await Attendance.find({ 'student._id': studentId })
      .sort({ date: -1 });

    res.status(200).json(records);
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

    const records = await Attendance.find({ 'class._id': classId })
      .sort({ date: -1 });

    res.status(200).json(records);
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

    // 🔍 Query against embedded class._id
    const records = await Attendance.find({ 'class._id': classId });

    // 📊 Aggregate attendance stats
    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );

    // 🧾 Include class name if available
    const className = records[0]?.class?.name || 'Unknown';

    res.status(200).json({
      class: {
        _id: classId,
        name: className
      },
      stats
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

    // 🔍 Query against embedded student._id
    const query = { 'student._id': studentId };
    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    }

    const records = await Attendance.find(query);

    // 📊 Aggregate attendance stats
    const stats = records.reduce(
      (acc, record) => {
        acc.total += 1;
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );

    // 📈 Calculate attendance percentage
    const percentage = stats.total > 0
      ? ((stats.present / stats.total) * 100).toFixed(2)
      : '0.00';

    const belowThreshold = parseFloat(percentage) < 75;

    // 🧾 Include student name if available
    const studentName = records[0]?.student?.name || 'Unknown';

    res.status(200).json({
      student: {
        _id: studentId,
        name: studentName
      },
      stats,
      percentage: `${percentage}%`,
      belowThreshold
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

    // 🔍 Query against embedded class._id
    const records = await Attendance.find({ 'class._id': classId }).sort({ date: 1 });

    const data = records.map(r => ({
      studentName: r.student?.name || 'Unknown',
      studentEmail: r.student?.email || '',
      date: r.date.toISOString().split('T')[0],
      status: r.status,
      reason: r.reason || '',
      excused: r.excused ? 'Yes' : 'No'
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`class_${classId}_attendance.csv`);
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

    // 🔍 Fetch all attendance records for the class
    const records = await Attendance.find({ 'class._id': classId });

    // 🧠 Group records by student._id
    const studentMap = new Map();

    for (const r of records) {
      const id = r.student._id;
      if (!studentMap.has(id)) {
        studentMap.set(id, {
          student: r.student,
          records: []
        });
      }
      studentMap.get(id).records.push(r);
    }

    // 🚨 Identify violations
    const violations = [];

    for (const { student, records } of studentMap.values()) {
      const stats = records.reduce(
        (acc, r) => {
          acc.total += 1;
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        },
        { total: 0, present: 0, absent: 0, late: 0 }
      );

      const percentage = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;

      if (percentage < 75) {
        violations.push({
          studentId: student._id,
          name: student.name || 'Unknown',
          email: student.email || 'Unknown',
          percentage: percentage.toFixed(2)
        });
      }
    }

    res.status(200).json({ classId, violations });
  } catch (err) {
    console.error('[getClassThresholdViolations]', err);
    res.status(500).json({ error: 'Failed to fetch threshold violations' });
  }
};

/**
 * Get attendance trends for a class
 */
export const getClassTrends = async (req, res) => {
  const classId = req.params.id;

  try {
    // 🔍 Query against embedded class._id
    const trends = await AttendanceTrend.find({ 'class._id': classId }).sort({ date: 1 });

    // 📊 Format for frontend charting
    const formatted = trends.map(t => ({
      date: t.date.toISOString().split('T')[0],
      present: t.present,
      absent: t.absent,
      late: t.late,
      className: t.class?.name || 'Unknown'
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('[getClassTrends]', err);
    res.status(500).json({ message: 'Failed to fetch trends' });
  }
};
