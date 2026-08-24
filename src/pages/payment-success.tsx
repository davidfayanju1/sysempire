// pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStore";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(false);

  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId || !txRef) {
        toast.error("Invalid payment response");
        navigate("/");
        return;
      }

      try {
        console.log("Verifying payment:", { transactionId, txRef, status });

        const response = await api.get("/payments/flutterwave/verify", {
          params: {
            transaction_id: transactionId,
            tx_ref: txRef,
            status: status || "successful",
          },
        });

        console.log("Verification response:", response.data);
        setIsVerifying(false);
        toast.success("Payment verified successfully!");

        // Redirect after 3 seconds
        setTimeout(() => {
          // Check if user is logged in (has user object)
          if (user) {
            navigate("/orders");
          } else {
            navigate("/login?returnTo=/orders");
          }
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error);
        setIsVerifying(false);
        setVerificationError(true);
        toast.error("Could not verify payment. Please contact support.");

        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    };

    verifyPayment();
  }, [transactionId, txRef, status, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-6" />
            <h2 className="text-2xl font-light mb-3">Verifying Your Payment</h2>
            <p className="text-gray-500">
              Please wait while we confirm your transaction...
            </p>
            {transactionId && (
              <p className="text-xs text-gray-400 mt-4">
                Transaction ID: {transactionId}
              </p>
            )}
          </>
        ) : verificationError ? (
          <>
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
            <h2 className="text-2xl font-light mb-3">Verification Failed</h2>
            <p className="text-gray-500 mb-4">
              Could not verify your payment. Please contact support.
            </p>
            <p className="text-sm text-gray-400">Redirecting you to home...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-3">Payment Successful! 🎉</h2>
            <p className="text-gray-500 mb-4">
              Your order has been confirmed and is being processed.
            </p>

            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              {transactionId && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {transactionId}
                </p>
              )}
              {txRef && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reference:</span> {txRef}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-400">
              {user
                ? "Redirecting to your orders..."
                : "Redirecting to login..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
