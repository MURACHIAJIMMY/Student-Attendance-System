import React, { useContext } from "react";
import { ClassContext } from "@/context/ClassContext";

export default function ClassSelector() {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
  } = useContext(ClassContext);

  const handleChange = (e) => {
    setSelectedClassId(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="class" className="block font-medium mb-1">
        Select Class:
      </label>
      <select
        id="class"
        value={selectedClassId || ""}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        disabled={classes.length === 0}
      >
        <option value="">-- Choose a class --</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>
      {classes.length === 0 && (
        <p className="text-sm text-gray-500 mt-1">Loading classes...</p>
      )}
    </div>
  );
}
