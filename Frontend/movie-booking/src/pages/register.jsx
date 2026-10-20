import { useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Register design ready! Backend connection is next.");
          }}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 focus-within:border-red-500">
              <User size={19} className="text-gray-500" />
              <input
                type="text"
                placeholder="Enter your name"
                required
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

          <button
            type="submit"
            className="w-full rounded-xl bg-red-600 py-3.5 font-bold transition hover:bg-red-700"
          >
            Create Account
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