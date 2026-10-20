
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Ticket,
  Pencil,
  LogOut,
  ArrowLeft,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Login time-la save panna user details read pannum
    const user =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null");

    if (user) {
      setName(user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user.username || "");

      setEmail(user.email || "");
      setPhone(user.phone || "");
    } else {
      // User details illai-na, token irukka check pannum
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleSave = () => {
    const storage = localStorage.getItem("user")
      ? localStorage
      : sessionStorage;

    const user = JSON.parse(storage.getItem("user") || "{}");

    const updatedUser = {
      ...user,
      first_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    storage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
    alert("Profile saved on this browser!");
  };

  const handleLogout = () => {
    if (!window.confirm("Do you want to logout?")) return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="bg-linear-to-r from-red-700 to-red-500 px-6 py-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-950 text-red-500">
              <UserRound size={48} />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {name || "User"}
            </h1>
            <p className="mt-1 text-sm text-red-100">
              TicketNow Member
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Full Name
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                <UserRound size={20} className="text-red-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing}
                  className="w-full bg-transparent outline-none disabled:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                <Mail size={20} className="text-red-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editing}
                  className="w-full bg-transparent outline-none disabled:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Phone Number
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
                <Phone size={20} className="text-red-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing}
                  placeholder="Enter phone number"
                  className="w-full bg-transparent outline-none placeholder:text-gray-500 disabled:text-gray-300"
                />
              </div>
            </div>

            {editing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg bg-gray-700 px-5 py-3 hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700"
              >
                <Pencil size={18} /> Edit Profile
              </button>
            )}

            <button
              onClick={() => navigate("/my-bookings")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 py-3 font-semibold hover:bg-gray-800"
            >
              <Ticket size={20} /> My Bookings
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-900 py-3 font-semibold text-red-400 hover:bg-red-950"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
