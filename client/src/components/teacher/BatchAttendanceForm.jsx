import { useState, useEffect } from "react";
import axios from "axios";
import { useTeacher } from "@/context/useTeacher";
import StudentAttendanceRow from "./StudentAttendanceRow";

export default function BatchAttendanceForm() {
  const { students, activeClass } = useTeacher();
  const classId = activeClass?._id;
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Initialize attendance records when students change
  useEffect(() => {
    if (students.length > 0) {
      const initial = students.map((s) => ({
        studentId: s._id,
        status: "present",
        reason: "",
        excused: false,
      }));
      setRecords(initial);
    } else {
      setRecords([]);
    }
  }, [students]);

  const updateRecord = (studentId, updates) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId ? { ...r, ...updates } : r
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classId || records.length === 0) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("/api/attendance/mark-batch", {
        classId,
        date,
        records,
      });

      // Reset records after submission
      const resetRecords = students.map((s) => ({
        studentId: s._id,
        status: "present",
        reason: "",
        excused: false,
      }));
      setRecords(resetRecords);

      setMessage("✅ Batch attendance submitted.");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "❌ Failed to submit batch attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = (checked) => {
    const updated = students.map((s) => ({
      studentId: s._id,
      status: checked ? "present" : "absent",
      reason: "",
      excused: false,
    }));
    setRecords(updated);
  };

  return (
    <div className="p-4 bg-white rounded shadow relative">
      <h2 className="text-xl font-semibold mb-4">Batch Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={(e) => handleMarkAll(e.target.checked)}
          />
          <span>Mark all as present</span>
        </label>

        <div className="max-h-[400px] overflow-y-auto border rounded p-2">
          {students.length > 0 ? (
            students.map((student) => {
              const record = records.find((r) => r.studentId === student._id);
              return (
                <StudentAttendanceRow
                  key={student._id}
                  student={student}
                  record={record}
                  onUpdate={updateRecord}
                />
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              No students found for this class.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || students.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Submit Batch"}
        </button>
      </form>

      {(message || error) && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white ${
            message ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message || error}
        </div>
      )}
    </div>
  );
}
