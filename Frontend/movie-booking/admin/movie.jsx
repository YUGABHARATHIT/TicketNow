
import { useState } from "react";
import {
  Film,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Clapperboard,
  Clock,
  CalendarDays,
} from "lucide-react";

const initialMovies = [
  {
    id: 1,
    title: "Coolie",
    genre: "Action",
    language: "Tamil",
    duration: 168,
    releaseDate: "2026-08-14",
    status: "Now Showing",
    poster: "",
  },
  {
    id: 2,
    title: "Jailer",
    genre: "Action",
    language: "Tamil",
    duration: 169,
    releaseDate: "2026-08-20",
    status: "Now Showing",
    poster: "",
  },
  {
    id: 3,
    title: "Dragon",
    genre: "Comedy",
    language: "Tamil",
    duration: 155,
    releaseDate: "2026-09-10",
    status: "Upcoming",
    poster: "",
  },
];

const emptyMovie = {
  title: "",
  genre: "Action",
  language: "Tamil",
  duration: "",
  releaseDate: "",
  status: "Upcoming",
  poster: "",
};

function Movies() {
  const [movies, setMovies] = useState(initialMovies);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMovie);
  const [posterPreview, setPosterPreview] = useState("");

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = `${movie.title} ${movie.genre} ${movie.language}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || movie.status === filter;

    return matchesSearch && matchesFilter;
  });

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyMovie);
    setPosterPreview("");
    setShowForm(true);
  };

  const openEditForm = (movie) => {
    setEditingId(movie.id);
    setForm({
      ...movie,
      duration: String(movie.duration),
    });
    setPosterPreview(movie.poster || "");
    setShowForm(true);
  };

  const handlePoster = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;
      setPosterPreview(image);
      setForm((prev) => ({ ...prev, poster: image }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.duration || !form.releaseDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const movieData = {
      ...form,
      title: form.title.trim(),
      duration: Number(form.duration),
    };

    if (editingId !== null) {
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingId
            ? { ...movieData, id: editingId }
            : movie
        )
      );
    } else {
      setMovies((prev) => [
        ...prev,
        { ...movieData, id: Date.now() },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyMovie);
    setPosterPreview("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (confirmed) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#09090d] p-4 text-white sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Film size={14} />
            Admin / Movies
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Movies <span className="text-red-500">.</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your movie catalogue, posters and release details.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
        >
          <Plus size={18} />
          Add Movie
        </button>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Movies",
            value: movies.length,
            icon: Film,
          },
          {
            label: "Now Showing",
            value: movies.filter((m) => m.status === "Now Showing").length,
            icon: Clapperboard,
          },
          {
            label: "Upcoming",
            value: movies.filter((m) => m.status === "Upcoming").length,
            icon: CalendarDays,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/[0.07] bg-[#111117] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{label}</p>
              <Icon size={20} className="text-red-400" />
            </div>
            <p className="mt-4 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movie, genre or language..."
            className="w-full rounded-xl border border-white/10 bg-[#111117] py-3 pl-11 pr-4 text-sm outline-none focus:border-red-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#111117] px-4 py-3 text-sm outline-none focus:border-red-500"
        >
          <option value="All">All Movies</option>
          <option value="Now Showing">Now Showing</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>

      {/* Movie Cards */}
      {filteredMovies.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111117] py-16 text-center">
          <Film size={40} className="mx-auto mb-4 text-gray-600" />
          <h2 className="font-semibold">No movies found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try another search or add a new movie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111117] transition hover:border-white/20"
            >
              {/* Poster */}
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-linear-to-br from-gray-800 to-gray-950">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Film size={45} className="mx-auto text-gray-600" />
                    <p className="mt-3 text-lg font-bold text-gray-400">
                      {movie.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      No poster uploaded
                    </p>
                  </div>
                )}

                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    movie.status === "Now Showing"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}
                >
                  {movie.status}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{movie.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {movie.genre} · {movie.language}
                    </p>
                  </div>

                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-gray-400">
                    #{movie.id}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-red-400" />
                    {movie.duration} min
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-red-400" />
                    {movie.releaseDate}
                  </span>
                </div>

                <div className="mt-5 flex gap-3 border-t border-white/[0.07] pt-4">
                  <button
                    onClick={() => openEditForm(movie)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#111117] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId !== null ? "Edit Movie" : "Add New Movie"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter the movie details below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Movie Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Enter movie title"
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Genre
                  </label>
                  <select
                    value={form.genre}
                    onChange={(e) =>
                      setForm({ ...form, genre: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  >
                    {["Action", "Comedy", "Drama", "Thriller", "Romance", "Horror", "Sci-Fi"].map((genre) => (
                      <option key={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Language
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) =>
                      setForm({ ...form, language: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  >
                    {["Tamil", "English", "Hindi", "Telugu", "Malayalam", "Kannada"].map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Duration (minutes) *
                  </label>
                  <input
                    required
                    min="1"
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    placeholder="150"
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Release Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) =>
                      setForm({ ...form, releaseDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Movie Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] px-4 py-3 text-sm outline-none focus:border-red-500"
                >
                  <option>Upcoming</option>
                  <option>Now Showing</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Movie Poster
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePoster}
                  className="w-full rounded-xl border border-white/10 bg-[#09090d] p-3 text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-white"
                />

                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="mt-4 h-40 rounded-lg object-contain"
                  />
                )}
                <p className="mt-2 text-xs text-gray-600">
                  Image preview only. Connect Django storage to save posters permanently.
                </p>
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
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-700"
                >
                  {editingId !== null ? "Save Changes" : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
