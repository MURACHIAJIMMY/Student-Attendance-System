import { useState, useEffect } from "react";
import { ClassContext } from "./ClassContext";
import useClassActions from "@/hooks/useClassActions";
import { useAuth } from "@/context/AuthContext";

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);

  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const {
    fetchStudents,
    addStudentToClass,
    removeStudentFromClass,
  } = useClassActions(selectedClassId);

  // 📚 Fetch all classes on mount
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch(`${BASE_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch classes");
        }

        const data = await res.json();
        setClasses(data);

        if (!selectedClassId && data.length > 0) {
          setSelectedClassId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    }

    if (token) {
      fetchClasses();
    }
  }, [token, BASE_URL, selectedClassId]); // ✅ ESLint-safe

  // 👥 Fetch students when selected class changes
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    }

    if (selectedClassId) {
      loadStudents();
    }
  }, [selectedClassId, fetchStudents]); // ✅ ESLint-safe

  const addStudent = async (studentIdentifier) => {
    try {
      await addStudentToClass(studentIdentifier);
      setStudents((prev) => [...prev, studentIdentifier]);
    } catch (err) {
      console.error("Failed to add student:", err);
    }
  };

  const removeStudent = async (studentId, admNo) => {
    try {
      await removeStudentFromClass(studentId, admNo);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      console.error("Failed to remove student:", err);
    }
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
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
