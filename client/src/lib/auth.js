import { jwtDecode } from "jwt-decode";


export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};
