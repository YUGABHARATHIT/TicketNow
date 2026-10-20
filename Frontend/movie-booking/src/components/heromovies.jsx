
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Film,
  CalendarDays,
  Star,
  Ticket,
  LoaderCircle,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/movies/";
const MEDIA_URL = "http://127.0.0.1:8000";

function getMoviesArray(data) {
  return Array.isArray(data) ? data : data.results || [];
}

function getPosterUrl(poster) {
  if (!poster) {
    return "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster";
  }

  if (poster.startsWith("http")) {
    return poster;
  }

  return `${MEDIA_URL}${poster.startsWith("/") ? "" : "/"}${poster}`;
}

function Movies() {
  const [open, setOpen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch movies from Django.");
        }

        const data = await response.json();
        const movies = getMoviesArray(data);

        setOpen(movies);
      } catch (err) {
        console.error("Movie fetch error:", err);
        setError(
          "Unable to load movies. Please check your Django backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      {/* Page Heading */}
      <h1 className="mb-8 flex items-center justify-center gap-3 text-3xl font-bold">
        <Film className="text-red-500" size={32} />
         <span className="text-white">Movies</span>
      </h1>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoaderCircle
            className="animate-spin text-red-500"
            size={40}
          />
          <p className="mt-4 text-gray-400">Loading movies...</p>
        </div>
      ) : error ? (
        /* Error */
        <div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-gray-900 p-6 text-center">
          <Film className="mx-auto mb-3 text-red-500" size={36} />
          <p className="text-red-400">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : open.length === 0 ? (
        /* No Movies */
        <div className="py-10 text-center">
          <Film
            className="mx-auto mb-4 text-gray-600"
            size={48}
          />
          <p className="text-lg text-gray-400">No movies found.</p>
          <p className="mt-2 text-sm text-gray-500">
            Add movies in Django Admin to display them here.
          </p>
        </div>
      ) : (
        /* Movie Cards */
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {open.map((used) => (
            <div
              key={used.id}
              className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition duration-300 hover:-translate-y-2 hover:border-red-500"
            >
              {/* Poster */}
              <div className="overflow-hidden">
                <img
                  src={getPosterUrl(used.poster)}
                  alt={used.title || "Movie poster"}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster";
                  }}
                  className="h-fit w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Movie Details */}
              <div className="p-3">
                <h2 className="mb-2 line-clamp-2 text-lg font-semibold">
                  {used.title}
                </h2>

                <p className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays
                    size={16}
                    className="shrink-0 text-red-400"
                  />
                  <span>
                    {used.release_date || "Release date TBA"}
                  </span>
                </p>

                <p className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <Film
                    size={16}
                    className="shrink-0 text-red-400"
                  />
                  <span>
                    {Array.isArray(used.genre)
                      ? used.genre.join(", ")
                      : used.genre || "Genre TBA"}
                  </span>
                </p>

                <p className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                  <Star
                    size={16}
                    className="shrink-0 text-yellow-400"
                  />
                  <span>
                    {typeof used.rating === "number"
                      ? used.rating.toFixed(1)
                      : used.rating ?? "N/A"}
                  </span>
                </p>

                {/* Book Now */}
                <button
                  onClick={() => navigate(`/movie/${used.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 font-semibold transition hover:bg-red-700"
                >
                  <Ticket size={18} />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;
