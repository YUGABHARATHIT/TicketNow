
import { useState } from "react";
import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Menu,
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CircleCheck,
  CircleX,
  ArrowUpRight,
  Clapperboard,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,48,650",
    change: "+12.8%",
    positive: true,
    icon: IndianRupee,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    title: "Total Bookings",
    value: "1,284",
    change: "+8.2%",
    positive: true,
    icon: Ticket,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    title: "Total Movies",
    value: "48",
    change: "+4.5%",
    positive: true,
    icon: Film,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Active Users",
    value: "3,642",
    change: "-2.4%",
    positive: false,
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

const bookings = [
  {
    id: "TN1024",
    customer: "Arun Kumar",
    movie: "Coolie",
    theatre: "AGS Cinemas",
    seats: "A4, A5",
    amount: 390,
    status: "Confirmed",
  },
  {
    id: "TN1025",
    customer: "Priya S",
    movie: "Jailer",
    theatre: "PVR Cinemas",
    seats: "B2, B3",
    amount: 390,
    status: "Confirmed",
  },
  {
    id: "TN1026",
    customer: "Rahul M",
    movie: "Leo",
    theatre: "Rohini Silver Screens",
    seats: "C5",
    amount: 210,
    status: "Pending",
  },
  {
    id: "TN1027",
    customer: "Divya R",
    movie: "Vikram",
    theatre: "INOX",
    seats: "D1, D2",
    amount: 390,
    status: "Cancelled",
  },
  {
    id: "TN1028",
    customer: "Karthik V",
    movie: "Dragon",
    theatre: "AGS Cinemas",
    seats: "E4",
    amount: 210,
    status: "Confirmed",
  },
];

const popularMovies = [
  { title: "Coolie", genre: "Action / Thriller", bookings: 842, revenue: "₹1.2L", color: "from-red-600 to-orange-500", initial: "C" },
  { title: "Jailer", genre: "Action / Drama", bookings: 726, revenue: "₹98K", color: "from-amber-700 to-yellow-500", initial: "J" },
  { title: "Leo", genre: "Action / Crime", bookings: 615, revenue: "₹86K", color: "from-blue-700 to-indigo-500", initial: "L" },
  { title: "Vikram", genre: "Action / Thriller", bookings: 508, revenue: "₹72K", color: "from-purple-700 to-pink-500", initial: "V" },
];

const chartData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 82 },
  { day: "Fri", value: 58 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 73 },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Movies", icon: Film },
  { label: "Theatres", icon: Building2 },
  { label: "Shows", icon: CalendarDays },
  { label: "Bookings", icon: Ticket },
];

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This week");

  const filteredBookings = bookings.filter((booking) =>
    `${booking.id} ${booking.customer} ${booking.movie} ${booking.theatre}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const maxChartValue = Math.max(...chartData.map((item) => item.value));

  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#0e0e14] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.07] px-6">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
              <Clapperboard size={23} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                Ticket<span className="text-red-500">Now</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Admin Console
              </p>
            </div>
          </a>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActivePage(label);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  activePage === label
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/15"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{label}</span>
                {label === "Bookings" && (
                  <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-xs">
                    12
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-4 rounded-2xl border border-red-500/15 bg-linear-to-br from-red-500/10 to-transparent p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
              <TrendingUp size={19} />
            </div>
            <p className="text-sm font-semibold">Grow your business</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Track bookings and discover your best-performing movies.
            </p>
          </div>

          <button
            onClick={() => setActivePage("Settings")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <Settings size={18} />
            Settings
          </button>

          <div className="mt-3 flex items-center gap-3 border-t border-white/[0.07] pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-purple-600 font-bold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button
              aria-label="Logout"
              onClick={() => alert("Connect this button to your logout flow.")}
              className="text-gray-500 hover:text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-h-screen lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#09090d]/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs text-gray-500">Workspace / Overview</p>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden sm:block">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="w-48 rounded-xl border border-white/8 bg-white/3 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-red-500/50 md:w-64"
              />
            </div>

            <button
              onClick={() => alert("No new notifications.")}
              className="relative rounded-xl border border-white/8 p-2.5 text-gray-400 hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#09090d]" />
            </button>

            <div className="hidden items-center gap-2 text-sm text-gray-300 md:flex">
              <span>Admin</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          {/* Welcome */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-gray-500">Monday, October 19, 2026</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Welcome back, Admin <span>👋</span>
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Here's what's happening with your cinema business.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/8"
            >
              <ArrowUpRight size={17} />
              Export / Print
            </button>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const ChangeIcon = stat.positive ? TrendingUp : TrendingDown;

              return (
                <div
                  key={stat.title}
                  className="group rounded-2xl border border-white/[0.07] bg-[#111117] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/15"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                      <Icon size={21} />
                    </div>
                    <MoreHorizontal size={20} className="text-gray-600" />
                  </div>

                  <p className="mt-5 text-sm text-gray-500">{stat.title}</p>

                  <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </h3>
                    <span
                      className={`mb-1 flex items-center gap-1 text-xs font-semibold ${
                        stat.positive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <ChangeIcon size={14} />
                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    Compared to last month
                  </p>
                </div>
              );
            })}
          </section>

          {/* Chart + Popular Movies */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5 sm:p-6 xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">Revenue Overview</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Weekly performance at a glance
                  </p>
                </div>

                <label className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-transparent outline-none"
                  >
                    <option className="bg-[#111117]">This week</option>
                    <option className="bg-[#111117]">This month</option>
                    <option className="bg-[#111117]">This year</option>
                  </select>
                </label>
              </div>

              <div className="mt-8 flex items-end gap-3">
                <h3 className="text-3xl font-black">₹2.48L</h3>
                <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-green-400">
                  <TrendingUp size={14} />
                  12.8%
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-600">
                Revenue · {period}
              </p>

              <div className="mt-8 flex h-48 items-end justify-between gap-2 sm:gap-4">
                {chartData.map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        title={`${item.value}% activity (illustrative)`}
                        style={{
                          height: `${(item.value / maxChartValue) * 100}%`,
                        }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.day === "Sat"
                            ? "bg-red-500 shadow-lg shadow-red-500/20"
                            : "bg-linear-to-t from-red-600/30 to-red-500/70 hover:from-red-600/60 hover:to-red-400"
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-white/6 pt-4">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs text-gray-500">
                  Illustrative activity levels, not live revenue data
                </span>
              </div>
            </div>

            {/* Popular movies */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Popular Movies</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Top titles this period
                  </p>
                </div>
                <button
                  onClick={() => setActivePage("Movies")}
                  className="text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  View all
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {popularMovies.map((movie, index) => (
                  <div key={movie.title} className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${movie.color} text-lg font-black`}
                    >
                      {movie.initial}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {movie.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {movie.genre}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">{movie.revenue}</p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        {movie.bookings} bookings
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Bookings */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111117]">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="font-bold">Recent Bookings</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Monitor the latest ticket reservations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:hidden">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bookings..."
                    className="w-full rounded-lg border border-white/10 bg-white/3 py-2 pl-9 pr-3 text-sm outline-none focus:border-red-500/50"
                  />
                </div>
                <button
                  onClick={() => setActivePage("Bookings")}
                  className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/5"
                >
                  View all bookings
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left">
                <thead>
                  <tr className="bg-white/2 text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Booking ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Movie / Theatre</th>
                    <th className="px-6 py-4 font-semibold">Seats</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((booking) => {
                    const statusStyles = {
                      Confirmed: "bg-green-500/10 text-green-400",
                      Pending: "bg-amber-500/10 text-amber-400",
                      Cancelled: "bg-red-500/10 text-red-400",
                    };

                    return (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-white/2.5"
                      >
                        <td className="px-6 py-4 text-xs font-semibold text-red-400">
                          {booking.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">
                            {booking.customer}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">
                            {booking.movie}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {booking.theatre}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {booking.seats}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">
                          ₹{booking.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                          >
                            {booking.status === "Confirmed" ? (
                              <CircleCheck size={13} />
                            ) : booking.status === "Pending" ? (
                              <Clock size={13} />
                            ) : (
                              <CircleX size={13} />
                            )}
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No bookings match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/6 px-6 py-4 text-xs text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} sample bookings
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 pb-4 text-xs text-gray-600 sm:flex-row">
            <p>© 2026 TicketNow Admin Panel</p>
            <p>Dashboard preview · Sample data only</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
