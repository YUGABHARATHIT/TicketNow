
import { useLocation, useNavigate } from "react-router-dom";
import {
  Ticket,
  Film,
  MapPin,
  Clock,
  Armchair,
  ArrowLeft,
} from "lucide-react";

function MyBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Booking details from previous page
  const state = location.state || {};

  const movieTitle = state.movieTitle || "Movie not selected";
  const theatre = state.theatre || "Theatre not selected";
  const showtime = state.showtime || "Showtime not selected";
  const seats = state.seats || [];
  const total = state.totalPrice || seats.length * 180 + 30;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-red-600 p-3">
            <Ticket size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-sm text-gray-400">
              Your movie booking details
            </p>
          </div>
        </div>

        {!state.movieTitle ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
            <Ticket className="mx-auto mb-4 text-gray-500" size={45} />
            <h2 className="text-xl font-semibold">
              No Booking Details Found
            </h2>
            <p className="mt-2 text-gray-400">
              Complete a booking to view your details here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">

            <div className="flex items-center justify-between bg-green-500/10 p-5">
              <div>
                <p className="text-sm text-green-400">
                  Booking Details
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {movieTitle}
                </h2>
              </div>

              <Film className="text-green-400" size={32} />
            </div>

            <div className="space-y-6 p-6">

              <div className="flex gap-3">
                <MapPin className="shrink-0 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Theatre</p>
                  <p className="font-medium">{theatre}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="shrink-0 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Showtime</p>
                  <p className="font-medium">{showtime}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Armchair className="shrink-0 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Selected Seats</p>
                  <p className="font-medium">
                    {seats.length ? seats.join(", ") : "No seats selected"}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-700 pt-5">
                <div className="flex justify-between text-gray-300">
                  <span>Tickets ({seats.length} × ₹180)</span>
                  <span>₹{seats.length * 180}</span>
                </div>

                <div className="mt-3 flex justify-between text-gray-300">
                  <span>Booking Fee</span>
                  <span>₹30</span>
                </div>

                <div className="mt-5 flex justify-between text-xl font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-400">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/")}
                className="w-full rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
              >
                Book Another Movie
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBooking;
