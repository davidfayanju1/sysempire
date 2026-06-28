import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");

  // Determine state from Flutterwave redirect params
  const isSuccess = status === "successful" || status === "completed";
  const isCancelled = status === "cancelled";
  const isPending = !status && !txRef;

  if (isCancelled) {
    return (
      <DefaultLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-[#fefaf5]">
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <span className="text-xs tracking-[0.3em] text-gray-400 uppercase font-serif">
              Payment Cancelled
            </span>
            <h1 className="text-3xl font-light mt-4 mb-4">
              Order Not Completed
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your payment was cancelled and no charge was made. You can go back and try again whenever you're ready.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/custom-wear"
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2"
              >
                Try Again <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/"
                className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!isSuccess && !isPending) {
    return (
      <DefaultLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-[#fefaf5]">
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <span className="text-xs tracking-[0.3em] text-red-400 uppercase font-serif">
              Payment Failed
            </span>
            <h1 className="text-3xl font-light mt-4 mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We weren't able to process your payment. No charge was made. Please try again or contact us if the issue persists.
            </p>
            {txRef && (
              <p className="text-xs text-gray-400 mb-6">
                Reference: {txRef}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link
                to="/custom-wear"
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2"
              >
                Try Again <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (isPending) {
    return (
      <DefaultLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-[#fefaf5]">
          <div className="max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <span className="text-xs tracking-[0.3em] text-amber-600 uppercase font-serif">
              Order Received
            </span>
            <h1 className="text-3xl font-light mt-4 mb-4">
              We've Got Your Order
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your bespoke order request has been received. A stylist will review your details and reach out within 24 hours to confirm your consultation.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/profile"
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2"
              >
                View My Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/"
                className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  // Success state
  return (
    <DefaultLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 bg-[#fefaf5]">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          <span className="text-xs tracking-[0.3em] text-amber-600 uppercase font-serif">
            Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-light mt-4 mb-4">
            Your piece is on its way to life.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Payment received. A dedicated stylist will review your order and reach out within 24 hours to begin your bespoke journey.
          </p>

          {txRef && (
            <div className="bg-white border border-black/10 p-4 mb-8 text-left">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                Reference
              </p>
              <p className="text-sm font-mono text-black">{txRef}</p>
              {transactionId && (
                <>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 mt-3">
                    Transaction ID
                  </p>
                  <p className="text-sm font-mono text-black">{transactionId}</p>
                </>
              )}
            </div>
          )}

          <div className="bg-black/5 p-4 mb-8">
            <p className="text-xs text-gray-600 leading-relaxed">
              Keep this confirmation page or check your email for your order details. You can also track your order status from your profile.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/profile?tab=orders"
              className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2"
            >
              Track My Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/"
              className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderConfirmation;
