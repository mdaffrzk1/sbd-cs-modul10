"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validasi Password
  const passwordReqs = {
    length: formData.password.length >= 10,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^a-zA-Z0-9\s]/.test(formData.password),
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to register account");

      router.push("/login?registered=true");
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError("Network Error: Pastikan Server Backend sudah menyala di Port 3000/3001 tanpa error.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        </div>

        {error && (
          <div className="bg-[#ffebe9] p-4 mb-6 rounded-md">
            <p className="text-[#c1152a] text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black" placeholder="John Doe"/>
          </div>

          <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black" placeholder="johndoe123"/>
          </div>

          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black" placeholder="you@example.com"/>
          </div>

          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black" placeholder="+6281234567890"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-black pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs space-y-1.5">
                <li className={`flex items-center gap-2 transition-colors ${passwordReqs.length ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {passwordReqs.length ? <Check size={14} className="text-green-500"/> : <X size={14} className="text-red-400"/>} At least 10 character
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordReqs.uppercase ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {passwordReqs.uppercase ? <Check size={14} className="text-green-500"/> : <X size={14} className="text-red-400"/>} Uppercase (A-Z)
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordReqs.lowercase ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {passwordReqs.lowercase ? <Check size={14} className="text-green-500"/> : <X size={14} className="text-red-400"/>} Lowercase (a-z)
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordReqs.number ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {passwordReqs.number ? <Check size={14} className="text-green-500"/> : <X size={14} className="text-red-400"/>} Number (0-9)
                </li>
                <li className={`flex items-center gap-2 transition-colors ${passwordReqs.special ? "text-green-600 font-medium" : "text-gray-500"}`}>
                  {passwordReqs.special ? <Check size={14} className="text-green-500"/> : <X size={14} className="text-red-400"/>} Symbol (!@# dsb)
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !Object.values(passwordReqs).every(Boolean)}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium transition-colors mt-6 ${
              isLoading || !Object.values(passwordReqs).every(Boolean)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}