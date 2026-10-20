
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Film,
  MapPin,
  CalendarDays,
  Clock,
  Armchair,
  Ticket,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const booking = location.state || {};
  const movieId = booking.movieId || id;

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    fetch(`http://localhost:3001/upcomingMovies/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Movie not found");
        }
        return res.json();
      })
      .then((data) => setMovie(data))
      .catch((error) => console.error("Movie fetch error:", error));
  }, [movieId]);

  const movieTitle =
    booking.movieTitle || movie?.title || movie?.name || "Movie not found";

  const {
    theatre = "Theatre not selected",
    showtime = "Not selected",
    seats = [],
    totalPrice = 0,
    date = new Date().toLocaleDateString("en-IN"),
  } = booking;

  const seatPrice =
    seats.length > 0 ? totalPrice / seats.length : 0;

  const bookingFee = seats.length > 0 ? 30 : 0;
  const grandTotal = totalPrice + bookingFee;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle size={36} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">
            Booking <span className="text-red-500">Summary</span>
          </h1>

          <p className="mt-2 text-gray-400">
            Review your booking details before continuing.
          </p>
        </div>

        {/* Booking Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

          {/* Movie Details */}
          <div className="flex items-center gap-4 border-b border-dashed border-gray-700 p-5">
            {movie?.poster ? (
              <img
                src={movie.poster}
                alt={movieTitle}
                className="h-24 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-600/10">
                <Film size={32} className="text-red-500" />
              </div>
            )}

            <div>
              <p className="text-sm text-gray-400">Movie</p>
              <h2 className="text-xl font-bold">
                {movieTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Movie ID: {movieId || "Not available"}
              </p>
            </div>
          </div>

          {/* Theatre and Showtime */}
          <div className="space-y-5 p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-red-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Theatre</p>
                <p className="font-semibold">{theatre}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-1 text-red-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Showtime</p>
                <p className="font-semibold">{showtime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-1 text-red-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Booking Date</p>
                <p className="font-semibold">{date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Armchair className="mt-1 text-red-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Selected Seats</p>
                <p className="font-semibold">
                  {seats.length > 0
                    ? seats.join(", ")
                    : "No seats selected"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {seats.length} ticket(s)
                </p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="border-t border-gray-800 p-5">
            <h3 className="mb-4 text-lg font-bold">Price Details</h3>

            <div className="mb-3 flex justify-between text-gray-300">
              <span>
                Tickets ({seats.length} × ₹{seatPrice.toFixed(2)})
              </span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="mb-4 flex justify-between text-gray-300">
              <span>Booking Fee</span>
              <span>₹{bookingFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-gray-700 pt-4 text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-red-500">
                ₹{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <div className="p-5 pt-0">
            <button
              disabled={seats.length === 0}
              onClick={() =>
                navigate(`/payment/${movieId}`, {
                  state: {
                    ...booking,
                    movieId,
                    movieTitle,
                    theatre,
                    showtime,
                    seats,
                    totalPrice: grandTotal,
                    date,
                  },
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard size={20} />
              Continue to Payment
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-3 w-full rounded-xl border border-gray-700 py-3 font-semibold transition hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
          <Ticket size={15} />
          Please verify your booking details before payment.
        </p>
      </div>
    </div>
  );
}

export default BookingSummary;
