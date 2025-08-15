import { useClassContext } from "@/context/ClassProvider";

export default function RemoveStudentFromClassForm() {
  const { students, removeStudent } = useClassContext();

  return (
    <div>
      <h3 className="font-medium mb-2">Remove Student</h3>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student.id} className="flex justify-between items-center">
            <span>{student.name}</span>
            <button
              onClick={() => removeStudent(student.id)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
