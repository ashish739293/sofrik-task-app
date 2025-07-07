"use client";

import { useState ,useEffect} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();

   // ✅ Redirect if token exists
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);


  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password: string): string => {
    const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strong.test(password)) return "strong";
    if (password.length >= 6) return "medium";
    return "weak";
  };

  const validateForm = (): string | null => {
    const { name, email, mobile, password, confirmPassword } = form;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      return "All fields are required.";
    }

    if (!/^\d{10}$/.test(mobile)) {
      return "Mobile number must be 10 digits.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (checkPasswordStrength(password) === "weak") {
      return "Password is too weak. Use at least 8 characters, 1 uppercase, 1 number, and 1 special character.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = form;

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#1f2937] px-4 py-8">
      <div className="bg-[#2d3748] text-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#4a5568] border border-gray-600 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#4a5568] border border-gray-600 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="number"
            name="mobile"
            placeholder="Mobile Number"
            required
            value={form.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#4a5568] border border-gray-600 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#4a5568] border border-gray-600 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-sm text-yellow-400"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {form.password && (
            <p className={`text-sm ${
              passwordStrength === "strong"
                ? "text-green-400"
                : passwordStrength === "medium"
                ? "text-yellow-400"
                : "text-red-400"
            }`}>
              Password Strength: {passwordStrength}
            </p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#4a5568] border border-gray-600 rounded text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-yellow-500 text-black font-medium py-2 rounded transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-yellow-600"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-black mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </section>
  );
}
