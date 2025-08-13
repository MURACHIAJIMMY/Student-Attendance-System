import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Toaster } from "sonner";
import ProtectedRoute from "@/routes/ProtectedRoute";

// Role-based dashboards
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/unauthorized" element={<div>Access Denied</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
