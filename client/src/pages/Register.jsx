import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: "",
    fingerprintHash: "",
    admNo: "",
    className: "",
    gender: "male",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/signup", form);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-teal-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create your account
          </h2>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="fingerprintHash">Fingerprint Hash (optional)</Label>
            <Input name="fingerprintHash" value={form.fingerprintHash} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {form.role === "student" && (
            <>
              <div>
                <Label htmlFor="admNo">Admission Number</Label>
                <Input name="admNo" value={form.admNo} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="className">Class Name</Label>
                <Input name="className" value={form.className} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
            Register
          </Button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?
            <Link to="/" className="ml-1 text-indigo-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
