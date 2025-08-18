import { useContext, useState } from "react";
import { ClassContext } from "@/context/ClassContext";
import { removeStudentFromClass } from "@/api/classStudentApi";
import { useAuth } from "@/context/AuthContext"; // ✅ Corrected import

export default function RemoveStudentFromClassForm() {
  const { selectedClassId, students, setStudents } = useContext(ClassContext);
  const { token } = useAuth(); // ✅ Matches your context hook
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveStudent = async (studentId) => {
    if (!selectedClassId || !studentId) return;

    try {
      setRemovingId(studentId);
      await removeStudentFromClass(selectedClassId, studentId, token);

      // Update local state
      const updatedStudents = students.filter((s) => s._id !== studentId);
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Failed to remove student:", error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Remove Student</h2>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student._id} className="flex justify-between items-center mb-2">
            <span>
              {student.name} ({student.admNo})
            </span>
            <button
              onClick={() => handleRemoveStudent(student._id)}
              disabled={removingId === student._id}
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              {removingId === student._id ? "Removing..." : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
