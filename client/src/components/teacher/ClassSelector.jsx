import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';

export default function ClassSelector({ onSelect }) {
  const { token } = useAuthContext();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Could not load classes.');
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, [token]);

  const handleChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (onSelect) onSelect(classId);
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
        disabled={loading || error}
      >
        <option value="">-- Choose a class --</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>
      {loading && <p className="text-sm text-gray-500 mt-1">Loading classes...</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
