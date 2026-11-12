import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CreditCard, Smartphone, Landmark, ShieldCheck } from "lucide-react";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const seats = state?.seats || [];
  const movieTitle = state?.movieTitle || "Movie";
  const ticketPrice = Number(state?.ticketPrice) || 180;
  const theatre = state?.theatre || "Selected Theatre";
  const showtime = state?.showtime || "Selected Showtime";
  const total = seats.length * ticketPrice;

  const methods = [
    { name: "UPI", icon: Smartphone, detail: "Google Pay, PhonePe, Paytm" },
    { name: "Credit / Debit Card", icon: CreditCard, detail: "Visa, Mastercard, RuPay" },
    { name: "Net Banking", icon: Landmark, detail: "Pay using your bank" },
  ];
  const handlePayment = async () => {
    if (!state?.showId || !seats.length) {
      alert("Show or seat details are missing");
      return;
    }
  
    setLoading(true);
  
    try {
      const API =
        import.meta.env.VITE_API_BASE_URL ||
        "http://127.0.0.1:8000/api";
  
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
  
      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }
  
      // Load Razorpay Checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
  
      const loaded = await new Promise((resolve) => {
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
  
      if (!loaded) {
        throw new Error("Razorpay Checkout failed to load");
      }
  
      // Create order in backend
      const response = await fetch(`${API}/create-payment-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          show_id: state.showId,
          seats,
        }),
      });
  
      const order = await response.json();
  
      if (!response.ok) {
        throw new Error(order.error || "Unable to create payment order");
      }
  
      const options = {
        key: order.razorpay_key_id,
        amount: order.amount,
        currency: order.currency,
        name: "TicketNow",
        description: `Movie booking - ${movieTitle}`,
        order_id: order.razorpay_order_id,
  
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await fetch(`${API}/verify-payment/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                booking_id: order.booking_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });
  
            const result = await verifyResponse.json();
  
            if (!verifyResponse.ok) {
              throw new Error(result.error || "Payment verification failed");
            }
  
            navigate("/my-booking", {
              state: {
                ...state,
                bookingId: result.booking_id,
                bookingCode: result.booking_code,
                totalPrice: total,
                paymentStatus: "PAID",
              },
            });
          } catch (error) {
            alert(error.message);
          }
        },
  
        prefill: {},
        theme: {
          color: "#dc2626",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
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
            <span>Tickets ({seats.length} × ₹{ticketPrice})</span>
            <span>₹{total}</span>
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
  onClick={handlePayment}
  disabled={loading}
  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
>
  {loading ? "Processing..." : `Pay ₹${total}`}
</button>

        
      </div>
    </div>
  );
}

export default Payment;