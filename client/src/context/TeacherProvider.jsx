import { useState } from "react";
import { TeacherContext } from "./TeacherContext";

export function TeacherProvider({ children }) {
  const [students, setStudents] = useState([]);

  return (
    <TeacherContext.Provider value={{ students, setStudents }}>
      {children}
    </TeacherContext.Provider>
  );
}
