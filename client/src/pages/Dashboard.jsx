import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/users/profile")
      .then((res) => setUser(res.data))
      .catch((err) => {
        toast.error("Failed to fetch profile");
        console.error(err);
      });
  }, []);

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      <p className="text-gray-700">Role: {user.role}</p>
      <p className="text-gray-700">Email: {user.email}</p>
    </div>
  );
}
