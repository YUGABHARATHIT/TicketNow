
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket, User, Mail, Lock, Eye, EyeOff
} from "lucide-react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const API_BASE_URL = (
      import.meta.env.VITE_API_BASE_URL ||
      "http://127.0.0.1:8000/api"
    ).replace(/\/$/, "");

    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Object.values(data).flat().join(" ");
        throw new Error(message || "Registration failed.");
      }

      // Automatic login after successful registration
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      sessionStorage.setItem("access", data.access);
      sessionStorage.setItem("refresh", data.refresh);

      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#030817] via-[#101a35] to-[#111d42] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1429] p-8 shadow-2xl sm:p-10">

        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Ticket className="text-red-500" size={32} />
          <span className="text-3xl font-extrabold">
            Ticket<span className="text-red-500">Now</span>
          </span>
        </Link>

        <h1 className="text-center text-3xl font-extrabold">
          Create Account
        </h1>

        <p className="mb-8 mt-3 text-center text-sm text-gray-400">
          Sign up and book your favourite movies!
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 focus-within:border-red-500">
              <User size={19} className="text-gray-500" />
              <input
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={150}
                className="w-full bg-transparent py-3.5 outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 focus-within:border-red-500">
              <Mail size={19} className="text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent py-3.5 outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 focus-within:border-red-500">
              <Lock size={19} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-transparent py-3.5 outline-none placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 py-3.5 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-red-500 hover:text-red-400"
          >
            Login
          </Link>
        </p>

        <Link
          to="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-white"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;
