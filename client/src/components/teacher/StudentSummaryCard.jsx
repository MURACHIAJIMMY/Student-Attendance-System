import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentSummaryCard({ studentId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`/api/attendance/student/${studentId}/summary`);
        setSummary(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch summary.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchSummary();
  }, [studentId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {summary && (
        <ul className="space-y-2 text-gray-700">
          <li><strong>Total Days:</strong> {summary.totalDays}</li>
          <li><strong>Present:</strong> {summary.present}</li>
          <li><strong>Absent:</strong> {summary.absent}</li>
          <li><strong>Late:</strong> {summary.late}</li>
          <li><strong>Excused Absences:</strong> {summary.excused}</li>
          <li><strong>Attendance Rate:</strong> {summary.attendanceRate}%</li>
        </ul>
      )}
    </div>
  );
}
