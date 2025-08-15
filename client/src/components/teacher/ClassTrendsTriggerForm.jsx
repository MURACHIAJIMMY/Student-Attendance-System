import { useState } from "react";
import axios from "axios";
import { useTeacher } from "@/context/useTeacher";

export default function ClassTrendsTriggerForm() {
  const { activeClass } = useTeacher();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!activeClass?._id) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(`/api/attendance/class/${activeClass._id}/trends/generate`);
      setMessage("Class trends generated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate trends.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Generate Class Trends</h2>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Trends"}
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
