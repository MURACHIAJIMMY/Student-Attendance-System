// import { useContext } from "react";
// import { ClassContext } from "@/context/ClassContext";

// export default function StudentList() {
//   const { students, selectedClassId } = useContext(ClassContext);

//   if (!selectedClassId) return <p>Please select a class.</p>;
//   if (!students || students.length === 0) return <p>No students found for this class.</p>;

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">Students in Class</h2>
//       <ul className="list-disc pl-5">
//         {students.map((student) => (
//           <li key={student._id}>
//             {student.name} ({student.admNo})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import { useTeacher } from "@/context/useTeacher";

export default function StudentList() {
  const { students, activeClass } = useTeacher();

  if (!activeClass?._id) return <p>Please select a class.</p>;
  if (!students || students.length === 0) return <p>No students found for this class.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">
        Students in {activeClass.name}
      </h2>
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
