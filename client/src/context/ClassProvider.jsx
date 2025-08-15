import { useState, useEffect } from "react";
import { ClassContext } from "./ClassContext";
import { useClassActions } from "@/hooks/useClassActions";

export function ClassProvider({ children }) {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);

  const {
    fetchStudents,
    addStudentToClass,
    removeStudentFromClass,
  } = useClassActions(selectedClassId);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents().then(setStudents);
    }
  }, [selectedClassId, fetchStudents]);

  const addStudent = async (student) => {
    await addStudentToClass(student);
    setStudents((prev) => [...prev, student]);
  };

  const removeStudent = async (studentId) => {
    await removeStudentFromClass(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  return (
    <ClassContext.Provider
      value={{
        selectedClassId,
        setSelectedClassId,
        students,
        addStudent,
        removeStudent,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
