
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { AuthProvider } from "@/context/AuthContext";
// import { TeacherProvider } from "@/context/TeacherProvider"; // ✅ updated path

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <TeacherProvider>
//         <App />
//       </TeacherProvider>
//     </AuthProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { ClassProvider } from "@/context/ClassContext"; // ✅ add this
import { TeacherProvider } from "@/context/TeacherProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ClassProvider> {/* ✅ wrap TeacherProvider */}
        <TeacherProvider>
          <App />
        </TeacherProvider>
      </ClassProvider>
    </AuthProvider>
  </React.StrictMode>
);
