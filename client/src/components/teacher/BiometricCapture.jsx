import { useState } from "react";
import axios from "axios";

export default function BiometricCapture() {
  const [fingerprintHash, setFingerprintHash] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setStudent(null);

    try {
      const { data } = await axios.post("/api/fingerprint/verify", { fingerprintHash });
      setStudent(data.student);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Biometric Verification</h2>

      <input
        type="text"
        placeholder="Fingerprint Hash"
        value={fingerprintHash}
        onChange={(e) => setFingerprintHash(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      <button
        onClick={handleVerify}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Verify Fingerprint
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {student && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Adm No:</strong> {student.admNo}</p>
          <p><strong>Class:</strong> {student.className}</p>
        </div>
      )}
    </div>
  );
}
