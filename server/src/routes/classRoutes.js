import express from "express";
import {
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllClasses,
} from "../controllers/classController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import classStudentRoutes from "./classStudentRoutes.js"; // 👈 import nested routes

const router = express.Router();

// ✅ Mount student routes first to avoid conflict with /:idOrName
router.use("/:classId/students", classStudentRoutes);

// ✅ Create a class (admin or teacher)
router.post("/", protect, authorizeRoles("admin", "teacher"), createClass);

// ✅ Update a class (strict ID only)
router.put("/:id", protect, authorizeRoles("admin", "teacher"), updateClass);

// ✅ Delete a class (strict ID only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

// ✅ Get all classes (with optional filters)
router.get("/", protect, authorizeRoles("admin", "teacher"), getAllClasses);

// ✅ Get single class by ID or name — placed last to avoid route collision
router.get("/:idOrName", protect, authorizeRoles("admin", "teacher"), getClassById);

export default router;
