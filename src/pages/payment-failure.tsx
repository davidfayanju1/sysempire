// pages/PaymentFailed.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the 3 query params from the URL
  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  useEffect(() => {
    // Log the failure details
    console.log("Payment Failed - Query Params:", {
      transaction_id: transactionId,
      tx_ref: txRef,
      status: status,
    });

    toast.error("Payment was not successful. Please try again.");

    // Redirect back to checkout after 5 seconds
    const timer = setTimeout(() => {
      navigate("/checkout");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, transactionId, txRef, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-light mb-3">Payment Failed</h2>
        <p className="text-gray-500 mb-4">
          Your payment was not completed. Please try again.
        </p>

        {/* Display the query params */}
        {transactionId && (
          <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Transaction ID:</span>{" "}
              {transactionId}
            </p>
            {txRef && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Reference:</span> {txRef}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate("/checkout")}
          className="mt-4 px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
        >
          Try Again
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
