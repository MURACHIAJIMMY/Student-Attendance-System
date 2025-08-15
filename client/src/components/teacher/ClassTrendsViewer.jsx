import { useState, useEffect } from "react";
import axios from "axios";
import { useTeacher } from "@/context/useTeacher";

export default function ClassTrendsViewer() {
  const { activeClass } = useTeacher();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      if (!activeClass?._id) return;

      setLoading(true);
      setError("");

      try {
        const { data } = await axios.get(`/api/attendance/class/${activeClass._id}/trends`);
        setTrends(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch class trends.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [activeClass]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Class Attendance Trends</h2>

      {loading && <p>Loading trends...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {trends && (
        <div className="space-y-2 text-gray-700">
          <p><strong>Average Attendance Rate:</strong> {trends.averageRate}%</p>
          <p><strong>Most Absent Day:</strong> {trends.mostAbsentDay}</p>
          <p><strong>Peak Attendance Day:</strong> {trends.peakAttendanceDay}</p>
          <p><strong>Late Arrival Patterns:</strong> {trends.latePattern}</p>
          {/* Add charts or graphs here if needed */}
        </div>
      )}
    </div>
  );
}
