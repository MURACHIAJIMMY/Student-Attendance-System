// // src/hooks/useClassActions.js

// export default function useClassActions(selectedClassId) {
//   /**
//    * Fetch all students in the selected class
//    * GET /api/classes/:classId/students
//    */
//   async function fetchStudents() {
//   if (!selectedClassId) return [];

//   const res = await fetch(`/api/classes/${selectedClassId}/students`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const contentType = res.headers.get("content-type") || "";

//   // Read the body once based on content type
//   const body = contentType.includes("application/json")
//     ? await res.json()
//     : await res.text();

//   if (!res.ok) {
//     const message = typeof body === "string" ? body : body?.message;
//     throw new Error(message || "Failed to fetch students");
//   }

//   return body;
// }

//   /**
//    * Add a student to the selected class
//    * PUT /api/classes/:classId/students
//    * Accepts: student identifier (ID, admNo, or name)
//    */
//   async function addStudentToClass(studentIdentifier) {
//     if (!selectedClassId) throw new Error("No class selected");

//     const res = await fetch(`/api/classes/${selectedClassId}/students`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ students: [studentIdentifier] }),
//     });

//     const contentType = res.headers.get("content-type");
//     let data;

//     if (contentType && contentType.includes("application/json")) {
//       data = await res.json();
//     } else {
//       const text = await res.text();
//       throw new Error(text || "Failed to add student");
//     }

//     if (!res.ok) {
//       throw new Error(data?.message || "Failed to add student");
//     }

//     return data; // { message, added, total }
//   }

//   /**
//    * Remove a student from the selected class
//    * DELETE /api/classes/:classId/students/:studentId?admNo=...
//    */
//   async function removeStudentFromClass(studentId, admNo) {
//     if (!selectedClassId) throw new Error("No class selected");
//     if (!studentId || !admNo) throw new Error("Both studentId and admNo are required");

//     const res = await fetch(
//       `/api/classes/${selectedClassId}/students/${studentId}?admNo=${admNo}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const contentType = res.headers.get("content-type");
//     let data;

//     if (contentType && contentType.includes("application/json")) {
//       data = await res.json();
//     } else {
//       const text = await res.text();
//       throw new Error(text || "Failed to remove student");
//     }

//     if (!res.ok) {
//       throw new Error(data?.message || "Failed to remove student");
//     }

//     return data; // { message, removed, remaining }
//   }

//   return {
//     fetchStudents,
//     addStudentToClass,
//     removeStudentFromClass,
//   };
// }

// src/hooks/useClassActions.js

import { useCallback } from "react";

export default function useClassActions(selectedClassId) {
  /**
   * Fetch all students in the selected class
   * GET /api/classes/:classId/students
   */
  const fetchStudents = useCallback(async () => {
    if (!selectedClassId) return [];

    const res = await fetch(`/api/classes/${selectedClassId}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message = typeof body === "string" ? body : body?.message;
      throw new Error(message || "Failed to fetch students");
    }

    return body;
  }, [selectedClassId]);

  /**
   * Add a student to the selected class
   * PUT /api/classes/:classId/students
   * Accepts: student identifier (ID, admNo, or name)
   */
  const addStudentToClass = useCallback(async (studentIdentifier) => {
    if (!selectedClassId) throw new Error("No class selected");

    const res = await fetch(`/api/classes/${selectedClassId}/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students: [studentIdentifier] }),
    });

    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message = typeof body === "string" ? body : body?.message;
      throw new Error(message || "Failed to add student");
    }

    return body; // { message, added, total }
  }, [selectedClassId]);

  /**
   * Remove a student from the selected class
   * DELETE /api/classes/:classId/students/:studentId?admNo=...
   */
  const removeStudentFromClass = useCallback(async (studentId, admNo) => {
    if (!selectedClassId) throw new Error("No class selected");
    if (!studentId || !admNo) throw new Error("Both studentId and admNo are required");

    const res = await fetch(
      `/api/classes/${selectedClassId}/students/${studentId}?admNo=${admNo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message = typeof body === "string" ? body : body?.message;
      throw new Error(message || "Failed to remove student");
    }

    return body; // { message, removed, remaining }
  }, [selectedClassId]);

  return {
    fetchStudents,
    addStudentToClass,
    removeStudentFromClass,
  };
}
