// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
    },
    class: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      name: { type: String, required: true },
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present",
    },
    reason: { type: String },
    excused: { type: Boolean, default: false },
    markedBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
