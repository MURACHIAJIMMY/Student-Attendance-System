import { useContext } from "react";
import { ClassContext } from "@/context/ClassContext";

export function useClassContext() {
  const context = useContext(ClassContext);
  if (!context) throw new Error("useClassContext must be used within ClassProvider");
  return context;
}
