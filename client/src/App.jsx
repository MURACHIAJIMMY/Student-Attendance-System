import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Public Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Protected Route Wrapper
import ProtectedRoute from "@/routes/ProtectedRoute";

// Dashboards
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";

// Teacher Views
import AttendanceDashboard from "@/pages/AttendanceDashboard";
import ClassDashboard from "@/pages/ClassDashboard";
import ClassTrendsGenerator from "@/components/teacher/ClassTrendsGenerator";
import ThresholdViolations from "@/components/teacher/ThresholdViolations";
import StudentSummary from "@/components/teacher/StudentSummary";

// Shared Layout
import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Redirect */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="mark-attendance" element={<AttendanceDashboard />} />
          <Route path="class-trends" element={<ClassDashboard />} />
          <Route path="class-trends/trends" element={<ClassTrendsGenerator />} />
          <Route path="class-trends/violations" element={<ThresholdViolations />} />
          <Route path="student/:id/summary" element={<StudentSummary />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="/unauthorized" element={<div>Access Denied</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
