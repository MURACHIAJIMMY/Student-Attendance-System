import { Navigate } from "react-router-dom";
import { getUserFromToken } from "@/lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getUserFromToken();

  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
