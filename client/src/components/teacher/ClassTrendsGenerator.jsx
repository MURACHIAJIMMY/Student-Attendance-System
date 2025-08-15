import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function ClassTrendsGenerator({ classId }) {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/api/class/${classId}/trends`);
      setTrends(data.trends);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch trends.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) fetchTrends();
  }, [classId, fetchTrends]);

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">📊 Class Attendance Trends</h2>

      {loading && <p>Loading trends...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && trends.length === 0 && (
        <p>No trends available for this class.</p>
      )}

      {!loading && trends.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Present</th>
              <th className="border px-4 py-2 text-left">Absent</th>
              <th className="border px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((t) => (
              <tr key={t.date}>
                <td className="border px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{t.present}</td>
                <td className="border px-4 py-2">{t.absent}</td>
                <td className="border px-4 py-2">{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
