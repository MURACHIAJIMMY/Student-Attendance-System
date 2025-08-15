import { useClassContext } from "@/hooks/useClassActions";

export default function StudentList() {
  const { students, selectedClassId } = useClassContext();

  if (!selectedClassId) return <p>Please select a class.</p>;
  if (students.length === 0) return <p>No students found for this class.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Students in Class</h2>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student._id}>
            {student.name} ({student.admNo})
          </li>
        ))}
      </ul>
    </div>
  );
}
