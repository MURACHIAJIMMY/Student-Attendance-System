import { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateAttendanceForm({ attendanceId }) {
  const [status, setStatus] = useState("present");
  const [reason, setReason] = useState("");
  const [excused, setExcused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Optional: fetch existing record
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data } = await axios.get(`/api/attendance/${attendanceId}`);
        setStatus(data.status);
        setReason(data.reason || "");
        setExcused(data.excused || false);
      } catch (err) {
        console.error("Failed to fetch attendance record:", err);
      }
    };

    if (attendanceId) fetchRecord();
  }, [attendanceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.put(`/api/attendance/${attendanceId}`, {
        status,
        reason,
        excused,
      });
      setMessage("Attendance updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Update Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>

        {status === "absent" && (
          <>
            <input
              type="text"
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excused}
                onChange={(e) => setExcused(e.target.checked)}
              />
              Excused
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Attendance"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
