import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  const { token } = useAuth();
  const [activeClass, setActiveClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState("");

  // Fetch students when activeClass changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!activeClass?._id) return;

      setLoadingStudents(true);
      setStudentError("");

      try {
        const res = await axios.get(
          `/api/classes/${activeClass._id}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data);
      } catch (err) {
        setStudentError(
          err?.response?.data?.message || "Failed to load students."
        );
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [activeClass?._id, token]);

  return (
    <TeacherContext.Provider
      value={{
        activeClass,
        setActiveClass,
        students,
        setStudents,
        loadingStudents,
        studentError,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}
