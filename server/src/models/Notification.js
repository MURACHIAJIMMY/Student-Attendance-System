import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['absence', 'reminder', 'lowAttendance', 'custom'],
      required: true
    },
    message: { type: String, required: true },
    deliveryMethod: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)
