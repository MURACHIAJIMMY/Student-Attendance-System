import { useContext } from "react";
import { ClassContext } from "@/context/ClassContext";

export default function RemoveStudentFromClassForm() {
  const { selectedClassId, students, setStudents } = useContext(ClassContext);

  const handleRemoveStudent = (studentId) => {
    if (!selectedClassId) return;

    const updatedStudents = students.filter((s) => s._id !== studentId);
    setStudents(updatedStudents);
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
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
