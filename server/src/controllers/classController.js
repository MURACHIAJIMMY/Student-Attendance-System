import Class from '../models/Class.js'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler'
export const getStudentsByClass = async (req, res) => {
  try {
    const classId = req.params.id
    const classDoc = await Class.findById(classId).populate('students', '-password') // exclude sensitive data

    if (!classDoc) {
      return res.status(404).json({ error: 'Class not found' })
    }

    res.json(classDoc.students)
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}
// @desc    Create a new class
// @route   POST /api/classes
// @access  Admin or Teacher
export const createClass = asyncHandler(async (req, res) => {
  const { name, teacher, students, schedule } = req.body

  // Validate teacher
  const teacherExists = await User.findOne({ _id: teacher, role: 'teacher' })
  if (!teacherExists) {
    res.status(400)
    throw new Error('Invalid teacher ID or role')
  }

  // Validate students
  const validStudents = await User.find({ _id: { $in: students }, role: 'student' })
  if (validStudents.length !== students.length) {
    res.status(400)
    throw new Error('One or more student IDs are invalid or not students')
  }

  const newClass = await Class.create({ name, teacher, students, schedule })
  res.status(201).json(newClass)
})

// @desc    Update class details
// @route   PUT /api/classes/:id
// @access  Admin or Teacher
export const updateClass = asyncHandler(async (req, res) => {
  const classId = req.params.id
  const updates = req.body

  const existingClass = await Class.findById(classId)
  if (!existingClass) {
    res.status(404)
    throw new Error('Class not found')
  }

  if (updates.teacher) {
    const teacherExists = await User.findOne({ _id: updates.teacher, role: 'teacher' })
    if (!teacherExists) {
      res.status(400)
      throw new Error('Invalid teacher ID or role')
    }
  }

  if (updates.students) {
    const validStudents = await User.find({ _id: { $in: updates.students }, role: 'student' })
    if (validStudents.length !== updates.students.length) {
      res.status(400)
      throw new Error('One or more student IDs are invalid or not students')
    }
  }

  const updatedClass = await Class.findByIdAndUpdate(classId, updates, { new: true })
  res.json(updatedClass)
})

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Admin only
export const deleteClass = asyncHandler(async (req, res) => {
  const classId = req.params.id
  const existingClass = await Class.findById(classId)

  if (!existingClass) {
    res.status(404)
    throw new Error('Class not found')
  }

  await existingClass.deleteOne()
  res.json({ message: 'Class deleted successfully' })
})

// @desc    Get a single class
// @route   GET /api/classes/:id
// @access  Admin or Teacher
export const getClassById = asyncHandler(async (req, res) => {
  const classId = req.params.id
  const classData = await Class.findById(classId)
    .populate('teacher', 'name email role')
    .populate('students', 'name email role')

  if (!classData) {
    res.status(404)
    throw new Error('Class not found')
  }

  res.json(classData)
})

// @desc    Get all classes
// @route   GET /api/classes
// @access  Admin or Teacher
export const getAllClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find()
    .populate('teacher', 'name email role')
    .populate('students', 'name email role')

  res.json(classes)
})