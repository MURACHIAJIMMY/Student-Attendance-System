import mongoose from 'mongoose';
import Class from '../models/Class.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

//
// ➕ Add students to a class
// PUT /api/classes/:classId/students
//
export const addStudentsToClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { students } = req.body; // array of _id, admNo, or name

  if (!Array.isArray(students) || students.length === 0) {
    res.status(400);
    throw new Error('Students array is required');
  }

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    res.status(404);
    throw new Error('Class not found');
  }

  // Categorize identifiers
  const ids = students.filter(mongoose.Types.ObjectId.isValid);
  const admNos = students.filter(s => typeof s === 'string' && /^[A-Z0-9]+$/.test(s));
  const names = students.filter(s => typeof s === 'string' && !/^[A-Z0-9]+$/.test(s));

  // Find matching students
  const matchedStudents = await User.find({
    role: 'student',
    $or: [
      ...(ids.length ? [{ _id: { $in: ids } }] : []),
      ...(admNos.length ? [{ admNo: { $in: admNos } }] : []),
      ...(names.length ? [{ name: { $in: names } }] : [])
    ]
  });

  if (matchedStudents.length === 0) {
    res.status(400);
    throw new Error('No valid students found');
  }

  // Deduplicate
  const seen = new Set();
  const uniqueStudents = matchedStudents.filter(s => {
    const key = s.admNo || s._id.toString();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Filter out already enrolled
  const existingIds = classDoc.students.map(id => id.toString());
  const newIds = uniqueStudents
    .map(s => s._id.toString())
    .filter(id => !existingIds.includes(id));

  classDoc.students.push(...newIds);
  await classDoc.save();

  res.json({
    message: 'Students added successfully',
    added: newIds,
    total: classDoc.students.length
  });
});

//
// ❌ Remove student from class
// DELETE /api/classes/:classId/students/:studentId?admNo=ADM123
//
export const removeStudentFromClass = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params;
  const { admNo } = req.query;

  if (!admNo) {
    res.status(400);
    throw new Error('admNo is required for student removal');
  }

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    res.status(404);
    throw new Error('Class not found');
  }

  const student = await User.findOne({ _id: studentId, admNo, role: 'student' });
  if (!student) {
    res.status(404);
    throw new Error('Student not found or admNo does not match');
  }

  const studentIdStr = student._id.toString();
  const wasInClass = classDoc.students.some(id => id.toString() === studentIdStr);

  if (!wasInClass) {
    res.status(400);
    throw new Error('Student is not enrolled in this class');
  }

  classDoc.students = classDoc.students.filter(id => id.toString() !== studentIdStr);
  await classDoc.save();

  res.json({
    message: 'Student removed successfully',
    removed: studentIdStr,
    remaining: classDoc.students
  });
});

//
// 📋 List students in a class
// GET /api/classes/:classId/students?admNo=ADM123&name=John
//
export const listStudentsInClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { admNo, name } = req.query;

  const classDoc = await Class.findById(classId).populate({
    path: 'students',
    select: 'name admNo',
    match: {
      ...(admNo && { admNo }),
      ...(name && { name: { $regex: new RegExp(name, 'i') } })
    }
  });

  if (!classDoc) {
    res.status(404);
    throw new Error('Class not found');
  }

  res.json(classDoc.students);
});
