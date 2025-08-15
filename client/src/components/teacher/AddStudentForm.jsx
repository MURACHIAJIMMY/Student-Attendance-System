import { useState } from "react";
import { useClassContext } from "@/hooks/useClassActions";
import axios from "axios";

export default function AddStudentForm() {
  const { selectedClassId, students, setStudents } = useClassContext();
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return;

    setLoading(true);
    setError("");

    try {
      const { data: newStudent } = await axios.post("/api/students", {
        name,
        admNo,
        classId: selectedClassId,
      });

      setStudents([...students, newStudent]);
      setName("");
      setAdmNo("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddStudent} className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Add Student</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
          required
        />
        <input
          type="text"
          placeholder="Admission Number"
          value={admNo}
          onChange={(e) => setAdmNo(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Student"}
      </button>
    </form>
  );
}
