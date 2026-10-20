
import { useState } from "react";

function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const bookedSeats = ["A3", "B5", "C2", "D6", "E4"];
  const rows = ["A", "B", "C", "D", "E"];
  const price = 180;

  function toggleSeat(seat) {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  }

  return (
    <div className="min-h-screen bg-[#111118] text-white p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center">
        Select Your Seats
      </h1>

      <p className="text-center text-gray-400 mt-2">
        Choose your favourite seats
      </p>

      <div className="mx-auto mt-10 max-w-2xl">
        <div className="h-2 rounded-full bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
        <p className="text-center text-sm text-blue-300 mt-3 mb-10">
          SCREEN
        </p>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <span>⬜ Available</span>
          <span>🟩 Selected</span>
          <span>🟥 Booked</span>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row}
              className="flex justify-center items-center gap-2"
            >
              <span className="w-5 text-gray-400">{row}</span>

              {Array.from({ length: 8 }, (_, i) => {
                const seat = `${row}${i + 1}`;
                const booked = bookedSeats.includes(seat);
                const selected = selectedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    disabled={booked}
                    onClick={() => toggleSeat(seat)}
                    className={`h-8 w-8 rounded-t-lg text-xs
                      ${
                        booked
                          ? "bg-red-500 cursor-not-allowed"
                          : selected
                          ? "bg-green-500"
                          : "bg-gray-700 hover:bg-gray-500"
                      }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6
                        flex justify-between items-center gap-4">
          <div>
            <p className="text-gray-400 text-sm">Selected seats</p>
            <p className="font-semibold">
              {selectedSeats.length
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-green-400">
              ₹{selectedSeats.length * price}
            </p>
          </div>
        </div>

        <button
          disabled={selectedSeats.length === 0}
          onClick={() =>
            alert(
              `Seats: ${selectedSeats.join(", ")}\nTotal: ₹${
                selectedSeats.length * price
              }`
            )
          }
          className="mt-6 w-full rounded-xl bg-red-500 py-3
                     font-bold hover:bg-red-600
                     disabled:opacity-40"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;