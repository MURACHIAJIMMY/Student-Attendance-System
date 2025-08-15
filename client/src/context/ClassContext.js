import { createContext, useState } from "react";

export const ClassContext = createContext();

export function ClassProvider({ children }) {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);

  return (
    <ClassContext.Provider
      value={{
        selectedClassId,
        setSelectedClassId,
        students,
        setStudents,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
