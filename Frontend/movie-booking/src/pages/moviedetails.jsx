
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Star,
  Film,
  Ticket,
  ArrowLeft,
  Clock,
  Users,
  UserRound,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api";
const MEDIA_URL = "http://127.0.0.1:8000";

function getArray(data) {
  return Array.isArray(data) ? data : data.results || [];
}

function getImageUrl(image) {
  if (!image) return "https://placehold.co/300x400/1f2937/ffffff?text=No+Image";
  if (image.startsWith("http")) return image;

  return `${MEDIA_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");

        // Get movies from Django REST API
        const response = await fetch(`${API_URL}/movies/`);

        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await response.json();
        const movies = getArray(data);

        const selectedMovie = movies.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedMovie) {
          throw new Error("Movie not found");
        }

        setMovie(selectedMovie);
      } catch (err) {
        console.error("Movie details error:", err);
        setError(err.message || "Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading movie details...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 p-6 text-white">
        <Film size={48} className="text-red-500" />
        <h2 className="text-2xl font-bold">Movie not found</h2>
        <p className="text-center text-gray-400">
          {error || "Movie details are unavailable."}
        </p>
        <button
          onClick={() => navigate("/movies")}
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-700"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  const castCrew = movie.cast_crew || [];

  const genre = Array.isArray(movie.genre)
    ? movie.genre.join(", ")
    : movie.genre;

  const rating =
    typeof movie.rating === "number"
      ? movie.rating.toFixed(1)
      : movie.rating ?? "N/A";

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-300 transition hover:text-red-500"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Movie Details */}
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <img
          src={getImageUrl(movie.poster)}
          alt={movie.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster";
          }}
          className="mx-auto max-h-150 w-full max-w-sm rounded-2xl object-cover shadow-xl"
        />

        <div className="flex flex-col justify-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-red-500">
            Movie Details
          </p>

          <h1 className="mb-4 text-4xl font-bold">
            {movie.title}
          </h1>

          <p className="mb-4 flex items-center gap-2 text-gray-300">
            <CalendarDays className="shrink-0 text-red-500" />
            Release Date: {movie.release_date || "To be announced"}
          </p>

          <p className="mb-4 flex items-center gap-2 text-gray-300">
            <Film className="shrink-0 text-red-500" />
            Genre: {genre || "Not available"}
          </p>

          {movie.language && (
            <p className="mb-4 text-gray-300">
              Language: {movie.language}
            </p>
          )}

          {movie.duration_minutes && (
            <p className="mb-4 flex items-center gap-2 text-gray-300">
              <Clock className="text-red-500" />
              Duration: {movie.duration_minutes} minutes
            </p>
          )}

          <p className="mb-4 flex items-center gap-2 text-yellow-400">
            <Star fill="currentColor" />
            Rating: {rating}
          </p>

          <p className="mb-6 text-lg leading-7 text-gray-400">
            {movie.description ||
              "Movie description will be available soon."}
          </p>

          <button
            onClick={() => navigate(`/theatre/${movie.id}`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-700"
          >
            <Ticket size={20} />
            Book Tickets
          </button>
        </div>
      </div>

      {/* Cast & Crew */}
      <section className="mx-auto mt-16 max-w-6xl">
        <div className="mb-7 flex items-center gap-3">
          <Users className="text-red-500" size={30} />
          <div>
            <h2 className="text-3xl font-bold">
              Cast <span className="text-red-500">& Crew</span>
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Actors and crew members
            </p>
          </div>
        </div>

        {castCrew.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {castCrew.map((person) => (
              <div
                key={person.id || person.name}
                className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition hover:-translate-y-1 hover:border-red-500"
              >
                <img
                  src={getImageUrl(person.image)}
                  alt={person.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://placehold.co/300x400/1f2937/ffffff?text=No+Image";
                  }}
                  className="h-56 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-semibold">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm text-red-400">
                    {person.role || "Cast / Crew"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
            <UserRound
              size={40}
              className="mx-auto mb-3 text-gray-500"
            />
            <p className="text-gray-300">
              Cast & Crew details are not available yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default MovieDetails;
