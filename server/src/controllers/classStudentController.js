import Class from '../models/Class.js'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler'

// @desc    Add students to a class
export const addStudentsToClass = asyncHandler(async (req, res) => {
  const { classId } = req.params
  const { students } = req.body // array of student IDs

  const classDoc = await Class.findById(classId)
  if (!classDoc) {
    res.status(404)
    throw new Error('Class not found')
  }

  const validStudents = await User.find({ _id: { $in: students }, role: 'student' })
  if (validStudents.length !== students.length) {
    res.status(400)
    throw new Error('One or more student IDs are invalid or not students')
  }

  // Avoid duplicates
  const uniqueStudents = students.filter(id => !classDoc.students.includes(id))
  classDoc.students.push(...uniqueStudents)
  await classDoc.save()

  res.json({ message: 'Students added successfully', students: classDoc.students })
})

// @desc    Remove a student from a class
export const removeStudentFromClass = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params

  const classDoc = await Class.findById(classId)
  if (!classDoc) {
    res.status(404)
    throw new Error('Class not found')
  }

  classDoc.students = classDoc.students.filter(id => id.toString() !== studentId)
  await classDoc.save()

  res.json({ message: 'Student removed successfully', students: classDoc.students })
})

// @desc    List all students in a class
export const listStudentsInClass = asyncHandler(async (req, res) => {
  const { classId } = req.params

  const classDoc = await Class.findById(classId).populate('students', 'name email role')
  if (!classDoc) {
    res.status(404)
    throw new Error('Class not found')
  }

  res.json(classDoc.students)
})
