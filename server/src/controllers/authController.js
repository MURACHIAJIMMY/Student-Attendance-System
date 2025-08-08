// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role,
      ...(user.role === 'student' && { admNo: user.admNo }) // Include admNo for students
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, admNo } = req.body

    // Check for existing email
    const existingEmail = await User.findOne({ email })
    if (existingEmail) return res.status(400).json({ error: 'Email already in use' })

    // Check for existing admNo if role is student
    if (role === 'student') {
      if (!admNo) return res.status(400).json({ error: 'Admission number is required for students' })
      const existingAdmNo = await User.findOne({ admNo })
      if (existingAdmNo) return res.status(400).json({ error: 'Admission number already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'student' && { admNo }) // Only include admNo for students
    })

    const token = generateToken(newUser)
    res.status(201).json({ user: newUser, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const token = generateToken(user)
    res.status(200).json({ user, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
