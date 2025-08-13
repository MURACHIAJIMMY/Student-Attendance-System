import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export default api;
