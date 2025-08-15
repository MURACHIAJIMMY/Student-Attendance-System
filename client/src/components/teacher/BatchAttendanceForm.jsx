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

  // Initialize records when students change
  useEffect(() => {
    const initial = students.map((s) => ({
      studentId: s._id,
      status: "present",
      reason: "",
      excused: false,
    }));
    setRecords(initial);
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
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("/api/attendance/mark-batch", {
        classId,
        date,
        records,
      });
      setMessage("Batch attendance submitted.");
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to submit batch attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Batch Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <div className="max-h-[400px] overflow-y-auto">
          {students.map((student) => {
            const record = records.find((r) => r.studentId === student._id);
            return (
              <StudentAttendanceRow
                key={student._id}
                student={student}
                record={record}
                onUpdate={updateRecord}
              />
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Batch"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
