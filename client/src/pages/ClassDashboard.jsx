import { ClassProvider } from "@/context/ClassProvider";
import RemoveStudentFromClassForm from "@/components/teacher/RemoveStudentFromClassForm";
import AddStudentsToClassForm from "@/components/teacher/AddStudentsToClassForm";

export default function ClassDashboard() {
  return (
    <ClassProvider>
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-semibold">Class Management</h2>
        <AddStudentsToClassForm />
        <RemoveStudentFromClassForm />
      </div>
    </ClassProvider>
  );
}
