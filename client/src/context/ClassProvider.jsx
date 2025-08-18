import { useState, useEffect } from "react";
import { ClassContext } from "./ClassContext";
import useClassActions from "@/hooks/useClassActions";
import { useAuth } from "@/context/AuthContext"; // Adjust path if needed

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);

  const { token } = useAuth(); // 🔐 Auth token for API calls

  const {
    fetchStudents,
    addStudentToClass,
    removeStudentFromClass,
  } = useClassActions(selectedClassId);

  // 📚 Fetch all classes on mount
  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes", {
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

        // ✅ Auto-select first class if none selected
        if (!selectedClassId && data.length > 0) {
          setSelectedClassId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    }

    fetchClasses();
  }, [token]);

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
  }, [selectedClassId]);

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
