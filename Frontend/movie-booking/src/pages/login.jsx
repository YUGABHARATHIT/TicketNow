
import { useState } from "react";
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Invalid username or password."
        );
        return;
      }

      // Keep tokens when the user logs in successfully.
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("accessToken", data.access);
      storage.setItem("refreshToken", data.refresh);

      // Remove any previous tokens from the other storage.
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem("accessToken");
      otherStorage.removeItem("refreshToken");

      const bookingData = location.state;

      if (bookingData?.movieId) {
        navigate(`/booking-summary/${bookingData.movieId}`, {
          state: bookingData,
          replace: true,
        });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        "Cannot connect to Django. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1d] text-white">
      <div className="flex min-h-[calc(100vh-86px)] items-center justify-center bg-linear-to-br from-[#030817] via-[#101a35] to-[#111d42] px-5 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c1429] shadow-2xl md:grid-cols-2">
          {/* Left panel */}
          <div className="hidden flex-col justify-between bg-linear-to-br from-red-600 to-red-950 p-10 md:flex">
            <div className="flex items-center gap-2">
              <Ticket size={32} />
              <h1 className="text-3xl font-extrabold">
                TicketNow
              </h1>
            </div>

            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[4px] text-red-200">
                Your Movie Experience
              </p>

              <h2 className="text-5xl font-black leading-tight">
                Lights.
                <br />
                Camera.
                <br />
                Book!
              </h2>

              <p className="mt-5 leading-7 text-red-100">
                Discover movies, explore theatres and book
                your favourite seats in just a few clicks.
              </p>
            </div>

            <p className="text-sm text-red-200">
              Your next favourite movie awaits.
            </p>
          </div>

          {/* Right panel */}
          <div className="p-7 sm:p-10 md:p-12">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 md:hidden">
                <Ticket size={28} />
              </div>

              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-500">
                Welcome Back
              </p>

              <h2 className="text-3xl font-extrabold">
                Login to TicketNow
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Sign in to continue your movie booking journey.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Username
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 transition focus-within:border-red-500">
                  <Mail size={19} className="text-gray-500" />

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-200">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080e1e] px-4 transition focus-within:border-red-500">
                  <Lock size={19} className="text-gray-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-red-500"
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-red-500 hover:text-red-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 py-3.5 font-bold transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-red-500 hover:text-red-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
