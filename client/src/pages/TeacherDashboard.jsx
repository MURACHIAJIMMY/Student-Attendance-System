import { useState } from "react";
import { TeacherProvider } from "@/context/TeacherProvider";
import { ClassProvider } from "@/context/ClassProvider";

import AttendanceForm from "@/components/teacher/AttendanceForm";
import BiometricCapture from "@/components/teacher/BiometricCapture";
import ClassTrendsGenerator from "@/components/teacher/ClassTrendsGenerator";
import StudentAttendanceView from "@/components/teacher/StudentAttendanceViewer";
import StudentSummaryCard from "@/components/teacher/StudentSummaryCard";
import ClassRosterManager from "@/components/teacher/UpdateAttendanceForm";
import StudentList from "@/components/teacher/StudentList";
import AddStudentForm from "@/components/teacher/AddStudentForm"; // ✅ new import
import FingerprintRegister from "@/components/teacher/FingerprintRegister";
import ClassSelector from "@/components/teacher/ClassSelector";

export default function TeacherDashboard() {
  const [view, setView] = useState("attendance");

  const views = {
    attendance: <AttendanceForm />,
    biometric: <BiometricCapture />,
    trends: <ClassTrendsGenerator />,
    studentAttendance: <StudentAttendanceView />,
    studentSummary: <StudentSummaryCard />,
    roster: <ClassRosterManager />,
    classList: (
      <>
        <AddStudentForm />
        <StudentList />
      </>
    ), // ✅ combined view
    fingerprint: <FingerprintRegister />,
  };

  return (
    <TeacherProvider>
      <ClassProvider>
        <div>
          <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

          {/* ✅ Class selector dropdown */}
          <ClassSelector />

          {/* View switcher buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {Object.keys(views).map((key) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`px-4 py-2 rounded text-sm ${
                  view === key ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Active view */}
          <div className="bg-white p-4 rounded shadow">{views[view]}</div>
        </div>
      </ClassProvider>
    </TeacherProvider>
  );
}
