import { createContext, useContext, useState } from "react";

export const ClassContext = createContext();

export function ClassProvider({ children }) {
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classes, setClasses] = useState([]);

  return (
    <ClassContext.Provider value={{ selectedClassId, setSelectedClassId, classes, setClasses }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClassContext() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
}
