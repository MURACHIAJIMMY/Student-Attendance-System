import { useState } from "react";
import axios from "axios";
import { useTeacher } from "@/context/useTeacher";

export default function ClassStudentList() {
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { students, setStudents } = useTeacher();

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/classes/${classId}/students`);
      setStudents(res.data); // ✅ Share with context
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to fetch students."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">View Students by Class</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter class ID or name"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={fetchStudents}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {students.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Adm No</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Class</th>
              <th className="p-2 text-left">Fingerprint</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-2">{s.admNo}</td>
                <td className="p-2">{s.fullName}</td>
                <td className="p-2">{s.class}</td>
                <td className="p-2">
                  {s.fingerprintRegistered ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
