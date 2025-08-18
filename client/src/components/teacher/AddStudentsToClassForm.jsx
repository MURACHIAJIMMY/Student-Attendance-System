import { useState } from "react";
import { useClassContext } from "@/context/ClassContext";
import { addStudentsToClass } from "@/api/classStudentApi";
import { useAuth } from "@/context/AuthContext"; // ✅ Fixed import

export default function AddStudentsToClassForm() {
  const { selectedClass, refreshStudents } = useClassContext();
  const { token } = useAuth(); // ✅ Updated hook usage
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !selectedClass?.id) return;

    try {
      setLoading(true);

      // Simulate student ID creation (replace with real logic if needed)
      const newStudent = { id: Date.now(), name };

      // Call backend to add student
      await addStudentsToClass(selectedClass.id, [newStudent.id], token);

      // Optionally refresh student list
      refreshStudents();

      setName("");
    } catch (error) {
      console.error("Failed to add student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Add Student</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
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
