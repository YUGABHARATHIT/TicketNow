
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Film,
  Languages,
  Clapperboard,
  LoaderCircle,
} from "lucide-react";

function UpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/upcomingMovies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8">
      {/* Heading */}
      <div className="mb-8 flex items-center gap-3">
        <Clapperboard size={35} className="text-red-500" />

        <h1 className="text-3xl font-bold sm:text-4xl">
          Upcoming <span className="text-red-500">Movies</span>
        </h1>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16">
          <LoaderCircle size={28} className="animate-spin text-red-500" />
          <p>Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <p className="py-10 text-center text-gray-400">
          No upcoming movies found.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-red-500 hover:shadow-red-500/10"
            >
              {/* Poster */}
              <div className="overflow-hidden">
                <img
                  src={
                    movie.poster
                      ? movie.poster
                      : "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster"
                  }
                  alt={movie.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
                />
              </div>

              {/* Movie Details */}
              <div className="p-3">
                <h2 className="mb-3 line-clamp-2 text-lg font-bold">
                  {movie.title}
                </h2>

                <p className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays size={16} className="shrink-0 text-red-400" />
                  <span>{movie.releaseDate || "Release date TBA"}</span>
                </p>

                <p className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  <Film size={16} className="shrink-0 text-red-400" />
                  <span>{movie.genre || "Genre TBA"}</span>
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-400">
                  <Languages size={16} className="shrink-0 text-red-400" />
                  <span>{movie.language || "Language TBA"}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingMovies;