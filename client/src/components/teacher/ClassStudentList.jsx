// import { useEffect, useState } from "react";
// import { useTeacher } from "@/context/useTeacher";
// import { listStudentsInClass } from "@/api/classStudentApi";
// import { useAuthContext } from "@/context/AuthContext";
// import { useContext } from "react";
// import { ClassContext } from "@/context/ClassContext";

// export default function ClassStudentList() {
//   const { students, setStudents } = useTeacher();
//   const { token } = useAuthContext();
//   const { selectedClassId } = useContext(ClassContext);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!selectedClassId) return;

//       setLoading(true);
//       setError("");

//       try {
//         const res = await listStudentsInClass(selectedClassId, token);
//         setStudents(res.data);
//       } catch (err) {
//         setError(
//           err?.response?.data?.message || err.message || "Failed to fetch students."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [selectedClassId, token, setStudents]);

//   return (
//     <div className="p-4 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Students in Selected Class</h2>

//       {loading && <p>Loading students...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {students.length > 0 ? (
//         <table className="w-full border mt-4">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 text-left">Adm No</th>
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Class</th>
//               <th className="p-2 text-left">Fingerprint</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((s) => (
//               <tr key={s._id} className="border-t">
//                 <td className="p-2">{s.admNo}</td>
//                 <td className="p-2">{s.fullName}</td>
//                 <td className="p-2">{s.class}</td>
//                 <td className="p-2">
//                   {s.fingerprintRegistered ? "✅" : "❌"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-gray-500">No students found for this class.</p>
//       )}
//     </div>
//   );
// }

import { useTeacher } from "@/context/useTeacher";

export default function ClassStudentList() {
  const { students, activeClass, loadingStudents, studentError } = useTeacher();

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Students in {activeClass?.name || "Selected Class"}
      </h2>

      {loadingStudents && <p>Loading students...</p>}
      {studentError && <p className="text-red-500">{studentError}</p>}

      {students.length > 0 ? (
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
                <td className="p-2">{activeClass?.name}</td>
                <td className="p-2">
                  {s.fingerprintRegistered ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No students found for this class.</p>
      )}
    </div>
  );
}
