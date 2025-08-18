import { useState } from "react";
import { useClassContext } from "@/context/ClassContext";
import { addStudentsToClass } from "@/api/classStudentApi";
import { useAuth } from "@/context/AuthContext"; // ✅ Fixed import

export default function AddStudentsToClassForm() {
  const { selectedClass, refreshStudents } = useClassContext();
  const { token } = useAuth(); // ✅ Updated hook usage
  const [name, setName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !admNo.trim() || !selectedClass?.id) return;

    try {
      setLoading(true);

      const newStudent = {
        id: Date.now().toString(), // Simulated ID
        name,
        admNo,
      };

      // Backend expects array of student objects
      await addStudentsToClass(selectedClass.id, [newStudent], token);

      refreshStudents();
      setName("");
      setAdmNo("");
    } catch (error) {
      console.error("Failed to add student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Add Student</h3>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          value={admNo}
          onChange={(e) => setAdmNo(e.target.value)}
          placeholder="Admission number"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
