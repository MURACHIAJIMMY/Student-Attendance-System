import mongoose from 'mongoose';

const biometricLogSchema = new mongoose.Schema({
  fingerprintHash: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  matchedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  success: Boolean,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('BiometricLog', biometricLogSchema);
