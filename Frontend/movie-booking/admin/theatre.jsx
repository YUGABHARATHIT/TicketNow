
import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  MapPin,
  Monitor,
  CircleCheck,
  Clapperboard,
} from "lucide-react";

const initialTheatres = [
  {
    id: 1,
    name: "AGS Cinemas",
    city: "Chennai",
    address: "Navallur, OMR",
    screens: 5,
    status: "Active",
  },
  {
    id: 2,
    name: "PVR Cinemas",
    city: "Chennai",
    address: "Velachery",
    screens: 6,
    status: "Active",
  },
  {
    id: 3,
    name: "Rohini Silver Screens",
    city: "Chennai",
    address: "Koyambedu",
    screens: 4,
    status: "Active",
  },
  {
    id: 4,
    name: "INOX Cinemas",
    city: "Coimbatore",
    address: "Avinashi Road",
    screens: 3,
    status: "Inactive",
  },
];

const emptyTheatre = {
  name: "",
  city: "Chennai",
  address: "",
  screens: "1",
  status: "Active",
};

function Theatres() {
  const [theatres, setTheatres] = useState(initialTheatres);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTheatre);

  const cities = [
    "All",
    ...new Set(theatres.map((theatre) => theatre.city)),
  ];

  const filteredTheatres = theatres.filter((theatre) => {
    const matchesSearch = [
      theatre.name,
      theatre.city,
      theatre.address,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCity =
      cityFilter === "All" || theatre.city === cityFilter;

    const matchesStatus =
      statusFilter === "All" || theatre.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const activeCount = theatres.filter(
    (theatre) => theatre.status === "Active"
  ).length;

  const totalScreens = theatres.reduce(
    (total, theatre) => total + Number(theatre.screens),
    0
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyTheatre);
    setShowForm(true);
  };

  const openEditForm = (theatre) => {
    setEditingId(theatre.id);
    setForm({
      ...theatre,
      screens: String(theatre.screens),
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const theatreData = {
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      screens: Number(form.screens),
    };

    if (!theatreData.name || !theatreData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId !== null) {
      setTheatres((prev) =>
        prev.map((theatre) =>
          theatre.id === editingId
            ? { ...theatreData, id: editingId }
            : theatre
        )
      );
    } else {
      setTheatres((prev) => [
        ...prev,
        { ...theatreData, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyTheatre);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this theatre?")) {
      setTheatres((prev) =>
        prev.filter((theatre) => theatre.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#09090d] p-4 text-white sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Building2 size={14} />
            Admin / Theatres
          </p>

          <h1 className="text-3xl font-black tracking-tight">
            Theatres <span className="text-red-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage cinema locations, screens and availability.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
        >
          <Plus size={18} />
          Add Theatre
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Theatres"
          value={theatres.length}
          icon={Building2}
          color="text-red-400"
        />

        <StatCard
          title="Active Theatres"
          value={activeCount}
          icon={CircleCheck}
          color="text-green-400"
        />

        <StatCard
          title="Total Screens"
          value={totalScreens}
          icon={Monitor}
          color="text-blue-400"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search theatre, city or address..."
            className="w-full rounded-xl border border-white/10 bg-[#111117] py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#111117] px-4 py-3 text-sm outline-none focus:border-red-500"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === "All" ? "All Cities" : city}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#111117] px-4 py-3 text-sm outline-none focus:border-red-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Theatre Cards */}
      {filteredTheatres.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111117] py-16 text-center">
          <Building2
            size={42}
            className="mx-auto mb-4 text-gray-600"
          />
          <h2 className="font-semibold">No theatres found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try a different search or add a theatre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTheatres.map((theatre) => (
            <div
              key={theatre.id}
              className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5 transition hover:border-white/20"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Building2 size={24} />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    theatre.status === "Active"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {theatre.status}
                </span>
              </div>

              <h2 className="text-xl font-bold">{theatre.name}</h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-red-400"
                  />
                  <div>
                    <p>{theatre.city}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {theatre.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Monitor size={17} className="text-red-400" />
                  <span>
                    {theatre.screens} screens available
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Clapperboard size={17} className="text-red-400" />
                  <span>Theatre ID: #{theatre.id}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 border-t border-white/[0.07] pt-4">
                <button
                  onClick={() => openEditForm(theatre)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(theatre.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId !== null ? "Edit Theatre" : "Add Theatre"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter cinema location details.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Theatre Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. AGS Cinemas"
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  City *
                </label>
                <select
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                >
                  {[
                    "Chennai",
                    "Coimbatore",
                    "Madurai",
                    "Trichy",
                    "Salem",
                    "Bengaluru",
                    "Hyderabad",
                  ].map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Address *
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Area, street or mall"
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Number of Screens *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100"
                    value={form.screens}
                    onChange={(e) =>
                      setForm({ ...form, screens: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold hover:bg-red-700"
                >
                  {editingId !== null ? "Save Changes" : "Add Theatre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <Icon size={21} className={color} />
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default Theatres;
