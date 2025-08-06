// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verify token middleware
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password') // attach user to request
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Role-based access middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' })
    }
    next()
  }
}
