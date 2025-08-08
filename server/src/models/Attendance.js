import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date cannot be in the future",
      },
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "absent", // default to absent unless explicitly marked present/late
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

// Prevent duplicate attendance for same student/class/date
attendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
