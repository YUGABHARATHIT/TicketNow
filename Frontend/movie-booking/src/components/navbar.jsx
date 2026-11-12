
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  User,
  X,
  ChevronDown,
  Ticket,
  LogOut,
} from "lucide-react";
import { getCurrentUser } from "../api";

function Navbar() {
  const navigate = useNavigate();

  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("Chennai");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const locations = [
    "Chennai",
    "Bengaluru",
    "Hyderabad",
    "Coimbatore",
    "Madurai",
  ];

  // Get the saved access token
  useEffect(() => {
    let cancelled = false;
  
    async function loadProfile() {
      const token =
        localStorage.getItem("access") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("access") ||
        sessionStorage.getItem("accessToken");
  
      if (!token) {
        setCurrentUser(null);
        return;
      }
  
      try {
        const user = await getCurrentUser(token);
        if (!cancelled) setCurrentUser(user);
      } catch (error) {
        console.error("Profile loading failed:", error);
        if (!cancelled) setCurrentUser(null);
      }
    }
  
    loadProfile();
  
    window.addEventListener("auth-changed", loadProfile);
    window.addEventListener("storage", loadProfile);
  
    return () => {
      cancelled = true;
      window.removeEventListener("auth-changed", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("googleProfileImage");

    sessionStorage.removeItem("googleProfileImage");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    setCurrentUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  const displayName =
    currentUser?.name || currentUser?.username || "User";

    const profileImage =
    currentUser?.profile_image ||
    localStorage.getItem("googleProfileImage");

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-350 mx-auto flex items-center justify-between gap-5 px-5 lg:px-10 py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-red-600 text-white p-2 rounded-xl">
              <Ticket size={25} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Ticket<span className="text-red-600">Now</span>
            </h1>
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link
              to="/movies"
              className="text-blue-700 bg-blue-50 px-4 py-2 rounded-full"
            >
              Movies
            </Link>

            <Link
              to="/theatre"
              className="hover:text-red-600 transition"
            >
              Theatres
            </Link>

            <Link
              to="/events"
              className="hover:text-red-600 transition"
            >
              Events
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Location */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-gray-100 transition"
            >
              <MapPin size={21} className="text-red-600" />

              <div className="hidden sm:block text-left">
                <p className="text-xs text-gray-500 font-normal">
                  Your location
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {location}
                </p>
              </div>

              <ChevronDown size={15} className="hidden sm:block" />
            </button>

            {/* Search */}
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            ) : (
              <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2">
                <Search size={19} />

                <input
                  autoFocus
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search movies..."
                  className="w-24 sm:w-40 outline-none text-sm"
                />

                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchText("");
                  }}
                  aria-label="Close search"
                >
                  <X size={19} />
                </button>
              </div>
            )}

            {/* Authentication */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 hover:border-red-500 px-2 py-1.5 transition"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="hidden sm:block max-w-28 truncate text-sm font-semibold text-gray-800">
                    {displayName}
                  </span>

                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <User size={18} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-booking"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <Ticket size={18} />
                      My Bookings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 transition shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center justify-around border-t py-3 text-sm font-semibold text-gray-600">
          <Link to="/movies" className="hover:text-red-600">
            Movies
          </Link>

          <Link to="/theatre" className="hover:text-red-600">
            Theatres
          </Link>

          <Link to="/events" className="hover:text-red-600">
            Events
          </Link>

          {currentUser ? (
            <Link to="/profile" className="hover:text-red-600">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="hover:text-red-600">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Location popup */}
      {locationOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setLocationOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Choose Location
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select your city to explore movies
                </p>
              </div>

              <button
                onClick={() => setLocationOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close location popup"
              >
                <X size={21} />
              </button>
            </div>

            <button
              className="flex w-full items-center gap-3 p-3 mb-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition"
              onClick={() => {
                if (!navigator.geolocation) {
                  alert("Geolocation is not supported by this browser.");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  () => {
                    setLocation("Current Location");
                    setLocationOpen(false);
                  },
                  () => {
                    alert("Location permission denied. Please select a city.");
                  }
                );
              }}
            >
              <MapPin size={21} />
              <span className="font-semibold text-sm">
                Use my current location
              </span>
            </button>

            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
              Popular cities
            </p>

            {locations.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setLocation(city);
                  setLocationOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl mb-1 transition ${
                  location === city
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
