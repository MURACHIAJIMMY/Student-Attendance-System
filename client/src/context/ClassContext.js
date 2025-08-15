import { createContext, useContext } from "react";

export const ClassContext = createContext();

export function useClassContext() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
}
