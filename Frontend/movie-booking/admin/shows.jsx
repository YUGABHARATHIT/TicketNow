
import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Clapperboard,
  Clock,
  CalendarDays,
  IndianRupee,
  MapPin,
  Film,
} from "lucide-react";

const initialShows = [
  {
    id: 1,
    movie: "Jailer",
    theatre: "PVR Cinemas",
    city: "Chennai",
    date: "2026-10-20",
    time: "10:00 AM",
    price: 180,
    status: "Active",
  },
  {
    id: 2,
    movie: "Leo",
    theatre: "AGS Cinemas",
    city: "Chennai",
    date: "2026-10-20",
    time: "02:00 PM",
    price: 220,
    status: "Active",
  },
  {
    id: 3,
    movie: "Coolie",
    theatre: "INOX",
    city: "Coimbatore",
    date: "2026-10-21",
    time: "06:30 PM",
    price: 200,
    status: "Inactive",
  },
];

const emptyForm = {
  movie: "",
  theatre: "",
  city: "",
  date: "",
  time: "",
  price: 180,
  status: "Active",
};

export default function Shows() {
  const [shows, setShows] = useState(initialShows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? value : value,
    }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (show) => {
    setEditId(show.id);
    setForm({ ...show, price: String(show.price) });
    setShowModal(true);
  };

  const saveShow = (e) => {
    e.preventDefault();

    const newShow = {
      ...form,
      price: Number(form.price),
    };

    if (editId !== null) {
      setShows((prev) =>
        prev.map((show) =>
          show.id === editId ? { ...newShow, id: editId } : show
        )
      );
    } else {
      setShows((prev) => [
        ...prev,
        { ...newShow, id: Date.now() },
      ]);
    }

    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const deleteShow = (id) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      setShows((prev) => prev.filter((show) => show.id !== id));
    }
  };

  const filteredShows = shows.filter((show) => {
    const matchesSearch =
      show.movie.toLowerCase().includes(search.toLowerCase()) ||
      show.theatre.toLowerCase().includes(search.toLowerCase()) ||
      show.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || show.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = shows.filter(
    (show) => show.status === "Active"
  ).length;

  const inactiveCount = shows.filter(
    (show) => show.status === "Inactive"
  ).length;

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500";

  return (
    <div className="min-h-screen bg-[#080b14] p-4 text-white sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm text-gray-400">
            Admin / Shows
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Shows Management
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage movie schedules, theatres and ticket prices.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
        >
          <Plus size={20} />
          Add New Show
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Shows"
          value={shows.length}
          icon={<Clapperboard size={22} />}
        />

        <StatCard
          title="Active Shows"
          value={activeCount}
          icon={<Film size={22} />}
        />

        <StatCard
          title="Inactive Shows"
          value={inactiveCount}
          icon={<Clock size={22} />}
        />

        <StatCard
          title="Average Ticket"
          value={
            shows.length
              ? `₹${Math.round(
                  shows.reduce((sum, show) => sum + Number(show.price), 0) /
                    shows.length
                )}`
              : "₹0"
          }
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
            placeholder="Search movie, theatre or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-11`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} md:w-48`}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Shows Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111522]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-bold">All Shows</h2>
          <span className="text-sm text-gray-400">
            {filteredShows.length} shows found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-left">
            <thead className="bg-white/3 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-4">Movie / Theatre</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Show Date</th>
                <th className="px-5 py-4">Show Time</th>
                <th className="px-5 py-4">Ticket Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredShows.map((show) => (
                <tr
                  key={show.id}
                  className="transition hover:bg-white/2.5"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                        <Film size={21} />
                      </div>

                      <div>
                        <p className="font-semibold">{show.movie}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {show.theatre}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin size={15} className="text-gray-500" />
                      {show.city}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays
                        size={16}
                        className="text-gray-500"
                      />
                      {show.date}
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm text-gray-300">
                    {show.time}
                  </td>

                  <td className="px-5 py-5 font-semibold">
                    ₹{show.price}
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        show.status === "Active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {show.status}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(show)}
                        title="Edit show"
                        className="rounded-lg border border-white/10 p-2.5 text-blue-400 transition hover:bg-blue-500/10"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteShow(show.id)}
                        title="Delete show"
                        className="rounded-lg border border-white/10 p-2.5 text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredShows.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center text-gray-400"
                  >
                    <Clapperboard
                      size={35}
                      className="mx-auto mb-3 opacity-40"
                    />
                    <p>No shows found.</p>
                    <p className="mt-1 text-sm">
                      Try another search or add a new show.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111522] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editId !== null ? "Edit Show" : "Add New Show"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Enter the show details below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveShow} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField label="Movie Name">
                  <input
                    name="movie"
                    value={form.movie}
                    onChange={updateField}
                    required
                    placeholder="e.g. Jailer"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Theatre Name">
                  <input
                    name="theatre"
                    value={form.theatre}
                    onChange={updateField}
                    required
                    placeholder="e.g. PVR Cinemas"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="City">
                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    required
                    placeholder="e.g. Chennai"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Show Date">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={updateField}
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Show Time">
                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={updateField}
                    required
                    placeholder="e.g. 10:00 AM"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Ticket Price (₹)">
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                    min="1"
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Show Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </FormField>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold transition hover:bg-red-700"
                >
                  {editId !== null ? "Save Changes" : "Create Show"}
                </button>
              </div>
            </form>
          </div>
        </div>
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

function FormField({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-gray-300">
        {label}
      </span>
      {children}
    </label>
  );
}