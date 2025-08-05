import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toaster, toast } from "sonner";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Register failed');
      }

      navigate("/login", { state: { message: "Register berhasil!" } });
    } catch (error) {
      console.error("Register error:", error);
      toast.error(`Register gagal: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-xl shadow-md bg-white">
      <Toaster richColors />
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-sm text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Konfirmasi Password */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-9 text-sm text-gray-600 hover:text-gray-800"
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Tombol Register */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </form>

      {/* Link ke Login */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </div>
  );
}

export default Register;