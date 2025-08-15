import { useClassContext } from "@/context/ClassContext";
import { useState } from "react";

export default function AddStudentsToClassForm() {
  const { addStudent } = useClassContext();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      addStudent({ id: Date.now(), name });
      setName("");
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Add Student</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>
    </div>
  );
}
