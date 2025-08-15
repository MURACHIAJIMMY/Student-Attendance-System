import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function ThresholdViolations({ classId }) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/api/class/${classId}/violations`);
      setViolations(data.violations);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch violations.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) fetchViolations();
  }, [classId, fetchViolations]);

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">🚨 Attendance Threshold Violations</h2>

      {loading && <p>Loading violations...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && violations.length === 0 && (
        <p>No violations found for this class.</p>
      )}

      {!loading && violations.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Adm No</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Attendance %</th>
              <th className="border px-4 py-2 text-left">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.studentId}>
                <td className="border px-4 py-2">{v.admNo}</td>
                <td className="border px-4 py-2">{v.name}</td>
                <td className="border px-4 py-2">{v.email}</td>
                <td className="border px-4 py-2">{v.percentage}%</td>
                <td className="border px-4 py-2">{v.presentSessions}/{v.totalSessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
