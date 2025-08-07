// models/AttendanceTrend.js
import mongoose from 'mongoose'

const AttendanceTrendSchema = new mongoose.Schema({
  classId: String,
  date: Date,
  present: Number,
  absent: Number,
  percentage: Number
})

export default mongoose.model('AttendanceTrend', AttendanceTrendSchema)
