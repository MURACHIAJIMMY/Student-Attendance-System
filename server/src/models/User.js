import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    admNo: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      default: "student",
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    fingerprintHash: { type: String, unique: true, sparse: true }, // optional default
    fingerprintLeft: { type: String, unique: true, sparse: true },
    fingerprintRight: { type: String, unique: true, sparse: true },
    className: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "student";
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: function () {
        return this.role === "student";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema)
export default User
