"use client";
import { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface PaymentModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log to check if Stripe is loaded
    console.log("Stripe loaded:", stripe ? "Yes" : "No");
    console.log("Elements loaded:", elements ? "Yes" : "No");

    // Fetch client secret for payment
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 999 }), // $9.99 in cents
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch payment intent");
        return res.json();
      })
      .then((data) => {
        console.log("Client secret received:", data.clientSecret);
        setClientSecret(data.clientSecret || "");
      })
      .catch((err) => {
        console.error("Error fetching client secret:", err);
        setError("Failed to initialize payment. Check console for details.");
      });
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      console.error("Stripe, elements, or clientSecret not loaded");
      setError("Payment system not ready. Try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log(
        "Attempting to confirm payment with clientSecret:",
        clientSecret
      );
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        console.error("Stripe error:", error);
        setError(error.message || "Payment failed. Check card details.");
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An error occurred during payment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <CardElement className="p-2 bg-white/20 rounded-lg mb-4" />
          <button
            type="submit"
            disabled={!stripe || !elements || loading || !clientSecret}
            className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            {loading ? "Processing..." : "Pay $9.99"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 mt-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
