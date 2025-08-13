export default function TeacherDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Attendance Tools</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Mark single attendance</li>
            <li>Mark biometric attendance</li>
            <li>Mark batch attendance</li>
            <li>Update attendance</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Analytics & Trends</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Generate class trends</li>
            <li>View class trends</li>
            <li>Threshold violations</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Class Management</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>View classes</li>
            <li>Create/update/delete class</li>
            <li>Add/remove students</li>
            <li>View students by class</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
