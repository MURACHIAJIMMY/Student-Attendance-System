import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cron from 'node-cron';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import biometricRoutes from './routes/biometricRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import classRoutes from './routes/classRoutes.js'; // ✅ includes nested student routes
import { sendAttendanceReminders } from './cronJobs/attendanceReminder.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Secure Socket.IO CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// 🔌 Attach io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 🕒 Daily cron job at 7:00 AM
cron.schedule('0 7 * * *', () => {
  sendAttendanceReminders();
});

// ✅ Secure CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/classes', classRoutes); // ✅ handles /:classId/students too

// Root route
app.get('/', (req, res) => {
  res.send('🎓 Student Attendance API is live.');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
