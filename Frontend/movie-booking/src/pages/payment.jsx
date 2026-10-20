
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreditCard, Smartphone, Landmark, ShieldCheck } from "lucide-react";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("UPI");

  const seats = state?.seats || [];
  const movieTitle=state?.movieTitle || [];
  const theatre = state?.theatre || "Selected Theatre";
  const showtime = state?.showtime || "Selected Showtime";
  const total = seats.length * 180 + 30;

  const methods = [
    { name: "UPI", icon: Smartphone, detail: "Google Pay, PhonePe, Paytm" },
    { name: "Credit / Debit Card", icon: CreditCard, detail: "Visa, Mastercard, RuPay" },
    { name: "Net Banking", icon: Landmark, detail: "Pay using your bank" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold">
          Choose Payment
        </h1>
        <p className="mb-8 text-gray-400">
          Complete your movie ticket booking
        </p>

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 text-xl font-bold text-red-500">
            Booking Summary
          </h2>
          <p className="mb-2">Movie: {movieTitle}</p>
          <p className="mb-2">Theatre: {theatre}</p>
          <p className="mb-2">Showtime: {showtime}</p>
          <p className="mb-2">
            Seats: {seats.length ? seats.join(", ") : "Not available"}
          </p>

          <div className="mt-4 border-t border-gray-700 pt-4">
            <div className="flex justify-between text-gray-300">
              <span>Tickets ({seats.length} × ₹180)</span>
              <span>₹{seats.length * 180}</span>
            </div>
            <div className="mt-2 flex justify-between text-gray-300">
              <span>Booking fee</span>
              <span>₹30</span>
            </div>
            <div className="mt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {methods.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => setMethod(item.name)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  method === item.name
                    ? "border-red-500 bg-red-950"
                    : "border-gray-800 bg-gray-900 hover:border-gray-600"
                }`}
              >
                <Icon size={26} className="text-red-500" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.detail}</p>
                </div>
                <span className="text-red-500">
                  {method === item.name ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>

        <button
  onClick={() =>
    navigate("/my-booking", {
      state: {
        ...state,
        movieTitle,
        theatre,
        showtime,
        seats,
        totalPrice: total,
      },
    })
  }
  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
>
  Pay Now
</button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Demo only — no real payment will be processed.
        </p>
      </div>
    </div>
  );
}

export default Payment;