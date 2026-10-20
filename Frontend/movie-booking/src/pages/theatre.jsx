
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Film,
  Clock,
  Ticket,
  Search,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function getArray(data) {
  // Supports both normal arrays and Django REST Framework pagination
  return Array.isArray(data) ? data : data.results || [];
}

function Theatre() {
  const [search, setSearch] = useState("");
  const [selectedTime, setSelectedTime] = useState({});
  const [theatres, setTheatres] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch theatres from Django
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/theatres/`);

        if (!response.ok) {
          throw new Error("Unable to load theatres.");
        }

        const data = await response.json();
        setTheatres(getArray(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, []);

  // Fetch selected movie from Django
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movies/`);

        if (!response.ok) {
          throw new Error("Unable to load movie details.");
        }

        const data = await response.json();
        const movies = getArray(data);

        const selectedMovie = movies.find(
          (item) => String(item.id) === String(id)
        );

        setMovie(selectedMovie || null);
      } catch (err) {
        console.error("Movie API error:", err);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  const filteredTheatres = theatres.filter((theatre) => {
    const name = theatre.name || "";
    const location = `${theatre.address || ""} ${theatre.city || ""}`;

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-8">
      {/* Heading */}
      <div className="mx-auto mb-8 max-w-6xl">
        <h1 className="mb-3 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <Film size={34} className="text-red-500" />
          Find Your <span className="text-red-500">Theatre</span>
        </h1>

        <p className="text-gray-400">
          Discover theatres and choose your favourite showtime.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mb-8 max-w-6xl">
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3">
          <Search className="text-red-500" size={22} />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search theatre or location..."
            className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Selected Movie */}
      {movie && (
        <div className="mx-auto mb-10 max-w-6xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            {movie.poster && (
              <img
                src={
                  movie.poster.startsWith("http")
                    ? movie.poster
                    : `http://127.0.0.1:8000${
                        movie.poster.startsWith("/")
                          ? movie.poster
                          : `/${movie.poster}`
                      }`
                }
                alt={movie.title}
                className="h-64 w-44 rounded-xl object-cover"
              />
            )}

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-500">
                Selected Movie
              </p>

              <h2 className="text-3xl font-extrabold sm:text-4xl">
                {movie.title}
              </h2>

              {movie.genre && (
                <p className="mt-3 text-gray-300">
                  Genre: {Array.isArray(movie.genre)
                    ? movie.genre.join(", ")
                    : movie.genre}
                </p>
              )}

              {movie.language && (
                <p className="mt-2 text-gray-400">
                  Language: {movie.language}
                </p>
              )}

              {movie.duration_minutes && (
                <p className="mt-2 text-gray-400">
                  Duration: {movie.duration_minutes} minutes
                </p>
              )}

              <p className="mt-4 text-gray-400">
                Choose your theatre below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading and Error */}
      {loading && (
        <p className="py-12 text-center text-gray-400">
          Loading theatres...
        </p>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-6xl rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <p className="text-red-400">{error}</p>
          <p className="mt-2 text-sm text-gray-400">
            Check that your Django backend is running on port 8000.
          </p>
        </div>
      )}

      {/* Theatre Cards */}
      {!loading && !error && (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTheatres.map((theatre) => {
            const location = [theatre.address, theatre.city]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={theatre.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      {theatre.name}
                    </h2>

                    <p className="mt-2 flex items-start gap-2 text-sm text-gray-400">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-red-400"
                      />
                      {location || "Location not provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1 text-sm text-gray-400">
                    <Star size={15} />
                    N/A
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-2 text-sm text-gray-300">
                  <Film size={18} className="text-red-400" />
                  {theatre.total_seats ?? "N/A"} Total Seats
                </div>

                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Clock size={18} className="text-red-400" />
                  Show Timings
                </h3>

                <p className="mb-5 text-sm text-gray-400">
                  Select a show after show timings are loaded from the
                  backend.
                </p>

                <button
                  onClick={() => {
                    if (!id) {
                      alert("Movie ID is missing.");
                      return;
                    }

                    navigate(`/seats/${id}`, {
                      state: {
                        movieId: id,
                        theatre: theatre.name,
                        theatreId: theatre.id,
                        showtime: selectedTime[theatre.id] || "",
                      },
                    });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
                >
                  <Ticket size={19} />
                  Continue to Seats
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredTheatres.length === 0 && (
        <p className="py-12 text-center text-gray-400">
          No theatres found. Add theatres in Django Admin or change your search.
        </p>
      )}
    </div>
  );
}

export default Theatre;
