import { useContext } from "react";
import { TeacherContext } from "./TeacherContext";

export function useTeacher() {
  return useContext(TeacherContext);
}
