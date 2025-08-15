import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentAttendanceViewer({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`/api/attendance/student/${studentId}`);
        setRecords(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch attendance.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchAttendance();
  }, [studentId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Student Attendance History</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && records.length === 0 && <p>No attendance records found.</p>}

      <ul className="space-y-2">
        {records.map((record) => (
          <li key={record._id} className="border p-3 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{record.date}</span>
              <span className="capitalize">{record.status}</span>
            </div>
            {record.status === "absent" && (
              <div className="text-sm text-gray-600 mt-1">
                Reason: {record.reason || "—"} | Excused: {record.excused ? "Yes" : "No"}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
