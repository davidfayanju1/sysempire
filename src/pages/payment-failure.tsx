// pages/PaymentFailed.tsx
//
// Reached when Flutterwave sends the customer back cancelled or failed. Nothing
// was charged, so this page only has to explain that and offer the way back.
// It does not redirect on a timer: a cancelled bespoke order and a cancelled
// cart order belong in different places, and guessing wrong strands people.
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../util/useCart";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const { cartItems } = useCart();

  const txRef = searchParams.get("tx_ref");
  const status = (searchParams.get("status") ?? "").toLowerCase();
  const cancelled = status === "cancelled" || status === "canceled";

  useEffect(() => {
    console.log("Payment not completed:", {
      tx_ref: txRef,
      transaction_id: searchParams.get("transaction_id"),
      status,
    });
  }, [searchParams, status, txRef]);

  // Cart still holding items means this was a cart checkout; otherwise the most
  // likely origin is the bespoke flow.
  const retryPath = cartItems.length > 0 ? "/checkout" : "/custom-wear";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefaf5] px-6">
      <div className="text-center max-w-md mx-auto p-10 bg-white border border-black/10">
        <div className="w-14 h-14 border border-black/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-6 h-6 text-black/70"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-light mb-3">
          {cancelled ? "Payment cancelled" : "Payment not completed"}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {cancelled
            ? "You cancelled before the payment went through, so nothing has been charged. Your details are still saved."
            : "The payment did not go through, so nothing has been charged. You can try again whenever you are ready."}
        </p>

        {txRef && (
          <p className="text-xs text-gray-400 mb-6">Reference: {txRef}</p>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to={retryPath}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-[0.18em] hover:bg-black/80 transition"
          >
            Try again
          </Link>
          <Link
            to="/"
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.18em] hover:border-black/40 hover:text-black transition"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
