import { useState } from "react";
import axios from "axios";
import { useTeacher } from "@/context/useTeacher";

export default function FingerprintRegister() {
  const { students } = useTeacher();
  const [studentId, setStudentId] = useState("");
  const [fingerprintHash, setFingerprintHash] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("/api/biometric/register", {
        studentId,
        fingerprintHash,
      });
      setMessage("Fingerprint registered successfully.");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Register Fingerprint</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.fullName} ({s.admNo})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Fingerprint hash"
          value={fingerprintHash}
          onChange={(e) => setFingerprintHash(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading || !studentId || fingerprintHash.length < 16}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Registering..." : "Register Fingerprint"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
