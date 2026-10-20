
import { useLocation, useParams } from "react-router-dom";

function Booking() {
  const { id } = useParams();
  const { state } = useLocation();

  const movieTitle = state?.movieTitle || "Movie";
  const theatre = state?.theatre || "Theatre";
  const showtime = state?.showtime || "Not selected";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 text-white shadow-2xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-red-500">
          🎬 Movie Booking
        </h1>

        <p className="mb-8 text-center text-sm text-gray-400">
          Your booking details
        </p>

        <div className="space-y-5">
          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-400">Movie ID</p>
            <p className="mt-1 font-semibold">{id}</p>
          </div>

          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-400">Movie</p>
            <p className="mt-1 font-semibold">{movieTitle}</p>
          </div>

          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-400">Theatre</p>
            <p className="mt-1 font-semibold">{theatre}</p>
          </div>

          <div className="rounded-lg bg-gray-800 p-4">
            <p className="text-sm text-gray-400">Showtime</p>
            <p className="mt-1 font-semibold">{showtime}</p>
          </div>
        </div>

        <button
          onClick={() => alert("Booking details confirmed!")}
          className="mt-8 w-full rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          Confirm Booking
        </button>

      </div>
    </div>
  );
}

export default Booking;