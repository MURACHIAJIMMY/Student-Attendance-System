import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => {
        const profile = res.data;
        setUser(profile);

        // ✅ Redirect based on role
        if (profile.role === "admin") navigate("/admin");
        else if (profile.role === "teacher") navigate("/teacher");
        else if (profile.role === "student") navigate("/student");
        else toast.error("Unknown role");
      })
      .catch((err) => {
        toast.error("Failed to fetch profile");
        console.error(err);
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, {user.name}
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Redirecting to your {user.role} dashboard...
        </p>
      </div>
    </div>
  );
}
