// client/src/components/teacher/ClassSelector.jsx
import React, { useEffect, useState } from 'react';

export default function ClassSelector({ onSelect }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // or from context
          },
        });

        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  const handleChange = e => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (onSelect) onSelect(classId); // optional callback
  };

  return (
    <div className="mb-4">
      <label htmlFor="class" className="block font-medium mb-1">
        Select Class:
      </label>
      <select
        id="class"
        value={selectedClass}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        disabled={loading}
      >
        <option value="">-- Choose a class --</option>
        {classes.map(cls => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
  );
}
