export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>Manage Users (View / Filter by Role)</li>
        <li>Create / Update / Delete Classes</li>
        <li>Add / Remove Students from Classes</li>
        <li>View Class Attendance</li>
        <li>Export Attendance as CSV</li>
        <li>View Class Summaries & Violations</li>
        <li>Register Fingerprints</li>
        <li>Generate & View Class Trends</li>
      </ul>
    </div>
  );
}
