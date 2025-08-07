import express from "express";
import {
  getStudentsByClass,
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllClasses,
} from "../controllers/classController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:id/students",
  protect,
  authorizeRoles("teacher"),
  getStudentsByClass
);
// Create a class (admin or teacher)
router.post("/", protect, authorizeRoles("admin", "teacher"), createClass);

// Update a class
router.put("/:id", protect, authorizeRoles("admin", "teacher"), updateClass);

// Delete a class
router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

// Get single class
router.get("/:id", protect, authorizeRoles("admin", "teacher"), getClassById);

// Get all classes
router.get("/", protect, authorizeRoles("admin", "teacher"), getAllClasses);

export default router;
