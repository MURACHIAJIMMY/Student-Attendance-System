import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import api from "@/lib/api";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile fetch failed:", err);
        toast.error("Session expired");
        logout();
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-gray-700 text-sm">Loading layout...</p>
      </div>
    );
  }

  const links = {
    admin: [
      { label: "Dashboard", path: "/admin" },
      { label: "Manage Users", path: "/admin/users" },
      { label: "Classes", path: "/admin/classes" },
    ],
    teacher: [
      { label: "Dashboard", path: "/teacher" },
      { label: "Mark Attendance", path: "/teacher/attendance" },
      { label: "Class Trends", path: "/teacher/trends" },
    ],
    student: [
      { label: "Dashboard", path: "/student" },
      { label: "My Attendance", path: "/student/attendance" },
      { label: "Summary", path: "/student/summary" },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Welcome, {user.name}</h2>
        <p className="text-sm text-gray-700 mb-6">Role: {user.role}</p>

        <nav className="space-y-2">
          {links[user.role]?.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="block w-full text-left px-3 py-2 rounded hover:bg-indigo-200 text-sm text-gray-800"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
