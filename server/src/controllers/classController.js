import Class from '../models/Class.js'

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
