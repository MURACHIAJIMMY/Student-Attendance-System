// src/hooks/useClassActions.js

export default function useClassActions(selectedClassId) {
  /**
   * Fetch all students in the selected class
   * GET /api/classes/:classId/students
   */
  async function fetchStudents() {
    if (!selectedClassId) return [];

    const res = await fetch(`/api/classes/${selectedClassId}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch students");
    }

    return await res.json();
  }

  /**
   * Add a student to the selected class
   * PUT /api/classes/:classId/students
   * Accepts: student identifier (ID, admNo, or name)
   */
  async function addStudentToClass(studentIdentifier) {
    if (!selectedClassId) throw new Error("No class selected");

    const res = await fetch(`/api/classes/${selectedClassId}/students`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students: [studentIdentifier] }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add student");
    }

    return await res.json(); // { message, added, total }
  }

  /**
   * Remove a student from the selected class
   * DELETE /api/classes/:classId/students/:studentId?admNo=...
   */
  async function removeStudentFromClass(studentId, admNo) {
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to remove student");
    }

    return await res.json(); // { message, removed, remaining }
  }

  return {
    fetchStudents,
    addStudentToClass,
    removeStudentFromClass,
  };
}
