
import { useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ArrowLeft,
  Armchair,
  Ticket,
  CheckCircle,
} from "lucide-react";

const rows = ["A", "B", "C", "D", "E", "F", "G"];

const bookedSeats = ["A3", "A4", "B5", "C2", "C6", "D4", "E3", "F6"];

function SeatSelection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { theatre, showtime, movieTitle } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatPrice = 180;
  const totalPrice = selectedSeats.length * seatPrice;

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) {
      return;
    }

    setSelectedSeats((previous) =>
      previous.includes(seat)
        ? previous.filter((item) => item !== seat)
        : [...previous, seat]
    );
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
  
    navigate(`/booking-summary/${id}`, {
      state: {
        movieTitle: movieTitle || "Movie",
        theatre: theatre || "Theatre",
        showtime: showtime || "Not selected",
        seats: selectedSeats,
        totalPrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">

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
          <h1 className="text-3xl font-bold sm:text-4xl">
            Select Your <span className="text-red-500">Seats</span>
          </h1>

          <p className="mt-2 text-gray-400">
            Choose your favourite seats to enjoy the movie.
          </p>
        </div>

        {/* Screen */}
        <div className="mb-10">
          <div className="mx-auto h-2 max-w-2xl rounded-full bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_rgba(34,211,238,0.5)]" />

          <p className="mt-4 text-center text-sm tracking-[0.5em] text-gray-400">
            SCREEN THIS WAY
          </p>
        </div>

        {/* Seat Legend */}
        <div className="mb-8 flex flex-wrap justify-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded border border-gray-500 bg-gray-800" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-red-600" />
            Selected
          </div>

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-gray-600" />
            Booked
          </div>
        </div>

        {/* Seats */}
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-8">
          <div className="mx-auto w-fit min-w-max space-y-4">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3 sm:gap-5">
                <span className="w-4 text-sm font-bold text-gray-400">
                  {row}
                </span>

                <div className="flex gap-2 sm:gap-3">
                  {Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`;
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seat)}
                        title={`${seat} - ${
                          isBooked
                            ? "Booked"
                            : isSelected
                              ? "Selected"
                              : "Available"
                        }`}
                        className={`flex h-8 w-8 items-center justify-center rounded-t-lg rounded-b-sm border text-xs transition sm:h-10 sm:w-10 ${
                          isBooked
                            ? "cursor-not-allowed border-gray-600 bg-gray-600 text-gray-400"
                            : isSelected
                              ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-900/40"
                              : "border-gray-600 bg-gray-800 text-gray-300 hover:border-green-400 hover:bg-green-600"
                        }`}
                      >
                        <Armchair size={16} />
                      </button>
                    );
                  })}
                </div>

                <span className="w-4 text-sm font-bold text-gray-400">
                  {row}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">Selected Seats</p>
              <p className="mt-1 font-semibold">
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "No seats selected"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-400">Price per seat</p>
              <p className="mt-1 font-semibold">₹{seatPrice}</p>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between border-t border-gray-800 pt-4">
            <span className="text-gray-300">Total Amount</span>
            <span className="text-2xl font-bold text-red-500">
              ₹{totalPrice}
            </span>
          </div>

          
<button
  onClick={() => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    const bookingData = {
      movieId: id,
      movieTitle: movieTitle || "Movie",
      theatre: theatre || "Theatre",
      showtime: showtime || "Not selected",
      seats: selectedSeats,
      totalPrice: selectedSeats.length * seatPrice,
    };

    if (!token) {
      navigate("/login", { state: bookingData });
      return;
    }

    navigate(`/booking-summary/${id}`, {
      state: bookingData,
    });
  }}
  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
>
  Continue
</button>

        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
          <CheckCircle size={14} />
          Selected seats are temporary demo selections.
        </p>
      </div>
    </div>
  );
}

export default SeatSelection;