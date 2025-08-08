import mongoose from 'mongoose';

const AttendanceTrendSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  present: {
    type: Number,
    default: 0,
  },
  absent: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('AttendanceTrend', AttendanceTrendSchema);
