import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
  withCredentials: true,
});

export default api;
