
import { useState } from "react";
import {
  Search,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  MapPin,
  User,
  IndianRupee,
  Film,
} from "lucide-react";

const initialBookings = [
  {
    id: "TN1001",
    customer: "Arun Kumar",
    email: "arun@example.com",
    movie: "Jailer",
    theatre: "PVR Cinemas",
    city: "Chennai",
    date: "2026-10-20",
    time: "10:00 AM",
    seats: ["A1", "A2"],
    amount: 390,
    status: "Confirmed",
  },
  {
    id: "TN1002",
    customer: "Priya",
    email: "priya@example.com",
    movie: "Leo",
    theatre: "AGS Cinemas",
    city: "Chennai",
    date: "2026-10-20",
    time: "02:00 PM",
    seats: ["B3", "B4", "B5"],
    amount: 570,
    status: "Pending",
  },
  {
    id: "TN1003",
    customer: "Karthik",
    email: "karthik@example.com",
    movie: "Coolie",
    theatre: "INOX",
    city: "Coimbatore",
    date: "2026-10-21",
    time: "06:30 PM",
    seats: ["C2"],
    amount: 210,
    status: "Cancelled",
  },
  {
    id: "TN1004",
    customer: "Divya",
    email: "divya@example.com",
    movie: "Jailer",
    theatre: "PVR Cinemas",
    city: "Chennai",
    date: "2026-10-22",
    time: "07:00 PM",
    seats: ["D1", "D2"],
    amount: 390,
    status: "Confirmed",
  },
];

const statusStyles = {
  Confirmed: "bg-green-500/10 text-green-400",
  Pending: "bg-yellow-500/10 text-yellow-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.status === "Confirmed")
    .reduce((total, booking) => total + Number(booking.amount), 0);

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.id.toLowerCase().includes(searchText) ||
      booking.customer.toLowerCase().includes(searchText) ||
      booking.movie.toLowerCase().includes(searchText) ||
      booking.email.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? { ...booking, status: newStatus }
          : booking
      )
    );

    setSelectedBooking((previous) =>
      previous?.id === id
        ? { ...previous, status: newStatus }
        : previous
    );

    setEditingBooking(null);
  };

  const deleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings((previous) =>
        previous.filter((booking) => booking.id !== id)
      );

      setSelectedBooking(null);
      setEditingBooking(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] p-4 text-white sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm text-gray-400">
          Admin / Bookings
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Bookings Management
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          View bookings, manage reservations and track ticket revenue.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<Ticket size={22} />}
        />

        <StatCard
          title="Confirmed"
          value={confirmedCount}
          icon={<CheckCircle size={22} />}
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={22} />}
        />

        <StatCard
          title="Confirmed Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee size={22} />}
        />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111522] p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search booking ID, customer or movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#080b14] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-sm outline-none focus:border-red-500 md:w-52"
        >
          <option value="All">All Bookings</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111522]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-bold">All Bookings</h2>

          <span className="text-sm text-gray-400">
            {filteredBookings.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-left">
            <thead className="bg-white/3 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4">Booking ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Movie</th>
                <th className="px-5 py-4">Show Date</th>
                <th className="px-5 py-4">Seats</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition hover:bg-white/2.5"
                >
                  <td className="px-5 py-5">
                    <span className="font-semibold text-red-400">
                      #{booking.id}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <p className="font-medium">{booking.customer}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {booking.email}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <Film size={17} className="text-gray-500" />
                      <span>{booking.movie}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {booking.theatre}
                    </p>
                  </td>

                  <td className="px-5 py-5">
                    <p className="text-sm">{booking.date}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {booking.time}
                    </p>
                  </td>

                  <td className="px-5 py-5 text-sm">
                    {booking.seats.join(", ")}
                  </td>

                  <td className="px-5 py-5 font-semibold">
                    ₹{booking.amount}
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        title="View details"
                        className="rounded-lg border border-white/10 p-2.5 text-gray-300 transition hover:bg-white/10"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => setEditingBooking(booking)}
                        title="Update status"
                        className="rounded-lg border border-white/10 p-2.5 text-blue-400 transition hover:bg-blue-500/10"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteBooking(booking.id)}
                        title="Delete booking"
                        className="rounded-lg border border-white/10 p-2.5 text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-16 text-center text-gray-400"
                  >
                    <Ticket size={35} className="mx-auto mb-3 opacity-40" />
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancelled summary */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
        <XCircle className="shrink-0 text-red-400" size={22} />
        <div>
          <p className="font-semibold">Cancelled Bookings</p>
          <p className="text-sm text-gray-400">
            {cancelledCount} booking(s) currently cancelled.
          </p>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          title="Booking Details"
          onClose={() => setSelectedBooking(null)}
        >
          <div className="space-y-5">
            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="mt-1 text-xl font-bold text-red-400">
                #{selectedBooking.id}
              </p>
            </div>

            <DetailRow
              icon={<User size={18} />}
              label="Customer"
              value={selectedBooking.customer}
            />

            <DetailRow
              icon={<Film size={18} />}
              label="Movie"
              value={selectedBooking.movie}
            />

            <DetailRow
              icon={<MapPin size={18} />}
              label="Theatre / City"
              value={`${selectedBooking.theatre}, ${selectedBooking.city}`}
            />

            <DetailRow
              icon={<CalendarDays size={18} />}
              label="Show Date / Time"
              value={`${selectedBooking.date} · ${selectedBooking.time}`}
            />

            <DetailRow
              icon={<Ticket size={18} />}
              label="Seats"
              value={selectedBooking.seats.join(", ")}
            />

            <DetailRow
              icon={<IndianRupee size={18} />}
              label="Amount"
              value={`₹${selectedBooking.amount}`}
            />

            <div>
              <p className="mb-2 text-sm text-gray-400">Booking Status</p>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  statusStyles[selectedBooking.status]
                }`}
              >
                {selectedBooking.status}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedBooking(null)}
            className="mt-6 w-full rounded-xl border border-white/10 py-3 font-semibold hover:bg-white/5"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Update Status Modal */}
      {editingBooking && (
        <Modal
          title="Update Booking Status"
          onClose={() => setEditingBooking(null)}
        >
          <p className="mb-5 text-sm text-gray-400">
            Booking #{editingBooking.id} · {editingBooking.customer}
          </p>

          <label className="mb-2 block text-sm text-gray-300">
            Select Status
          </label>

          <select
            value={editingBooking.status}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                status: e.target.value,
              })
            }
            className="w-full rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-white outline-none focus:border-red-500"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setEditingBooking(null)}
              className="flex-1 rounded-xl border border-white/10 py-3 font-semibold hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                updateStatus(editingBooking.id, editingBooking.status)
              }
              className="flex-1 rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700"
            >
              Save Status
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111522] p-5 transition hover:border-red-500/30">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111522] p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X size={21} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}