import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { TeacherProvider } from "@/context/TeacherContext"; // ✅ Add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <TeacherProvider>
        <App />
      </TeacherProvider>
    </AuthProvider>
  </React.StrictMode>
);
