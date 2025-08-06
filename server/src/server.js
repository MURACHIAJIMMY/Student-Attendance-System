import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/auth', authRoutes)

// Root route
app.get('/', (req, res) => {
  res.send('🎓 Student Attendance API is live.')
})

// Connect to DB and start server
const PORT = process.env.PORT || 5000
connectDB()

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...')
  server.close(() => {
    process.exit(0)
  })
})
