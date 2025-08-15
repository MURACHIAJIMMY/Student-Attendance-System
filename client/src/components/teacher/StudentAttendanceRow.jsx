export default function StudentAttendanceRow({ student, record, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate(student._id, { [field]: value });
  };

  return (
    <div className="border p-3 rounded mb-2 space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">
          {student.fullName} ({student.admNo})
        </span>
        <select
          value={record.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
      </div>

      {record.status === "absent" && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Reason (optional)"
            value={record.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={record.excused}
              onChange={(e) => handleChange("excused", e.target.checked)}
            />
            Excused
          </label>
        </div>
      )}
    </div>
  );
}
