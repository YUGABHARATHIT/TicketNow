
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Ticket, Home } from "lucide-react";

function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const Movie=state?.movieTitle || [];
  const seats = state?.seats || [];
  const theatre = state?.theatre || "Selected Theatre";
  const showtime = state?.showtime || "Selected Showtime";
  const paymentMethod = state?.paymentMethod || "UPI";
  const totalPrice = state?.totalPrice || 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-10 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl">
        <CheckCircle
          size={72}
          className="mx-auto mb-5 text-green-500"
        />

        <h1 className="text-3xl font-bold">
          Booking Confirmed!
        </h1>

        <p className="mt-3 text-gray-400">
          Your demo booking has been completed.
        </p>

        <div className="my-8 space-y-4 rounded-xl bg-gray-800 p-5 text-left">
        <p>
            <span className="text-gray-400">Movies:</span>{" "}
            {Movie}
          </p>
          <p>
            <span className="text-gray-400">Theatre:</span>{" "}
            {theatre}
          </p>

          <p>
            <span className="text-gray-400">Showtime:</span>{" "}
            {showtime}
          </p>

          <p>
            <span className="text-gray-400">Seats:</span>{" "}
            {seats.join(", ") || "Not available"}
          </p>

          <p>
            <span className="text-gray-400">Payment:</span>{" "}
            {paymentMethod}
          </p>

          <p className="border-t border-gray-700 pt-4 text-xl font-bold">
            Total: ₹{totalPrice}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700"
        >
          <Home size={20} />
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;