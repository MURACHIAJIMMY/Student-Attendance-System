// client/src/components/teacher/ClassSelector.jsx
import React from 'react';

export default function ClassSelector() {
  return (
    <div className="mb-4">
      <label htmlFor="class" className="block font-medium mb-1">
        Select Class:
      </label>
      <select id="class" className="border rounded px-3 py-2 w-full">
        <option value="">-- Choose a class --</option>
        {/* Populate dynamically later */}
      </select>
    </div>
  );
}
