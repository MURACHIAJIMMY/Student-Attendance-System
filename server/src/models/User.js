import mongoose from 'mongoose';
import Class from './Class.js'; // ✅ Import Class model

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
      index: true,
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
    fingerprintHash: { type: String, unique: true, sparse: true },
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

// ✅ Auto-enroll student into class after save
userSchema.post('save', async function (doc) {
  if (doc.role === 'student' && doc.className) {
    try {
      const result = await Class.findOneAndUpdate(
        { name: doc.className },
        { $addToSet: { students: doc._id } }
      );
      if (result) {
        console.log(`✅ Enrolled ${doc.name} into class ${doc.className}`);
      } else {
        console.warn(`⚠️ Class "${doc.className}" not found for ${doc.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to enroll ${doc.name}:`, err.message);
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;
