// pages/PaymentSuccess.tsx
//
// Every customer comes back through this one URL, whatever happened: paid,
// cancelled or failed. What the query string looks like depends on who did the
// redirecting, so classifyPaymentReturn sorts that out and this page only
// decides what to show and where to send people next.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/axios";
import { clearStoredProgress } from "../lib/customWearProgress";
import { forgetPaymentOrigin, takePaymentOrigin } from "../lib/paymentOrigin";
import { classifyPaymentReturn } from "../lib/paymentReturn";
import { useAuthStore } from "../store/authStore";
import { useCart } from "../util/useCart";

const ORDERS_PATH = "/profile?tab=orders";

type Phase = "verifying" | "verified" | "failed" | "unreadable";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { clearCart } = useCart();
  const startedRef = useRef(false);

  const result = classifyPaymentReturn(searchParams);

  // Derived up front rather than set inside the effect, which would cascade an
  // extra render. Cancelled and failed navigate away, so they never paint.
  const [phase, setPhase] = useState<Phase>(() =>
    result.kind === "paid"
      ? "verified"
      : result.kind === "unreadable"
        ? "unreadable"
        : "verifying",
  );

  const reference =
    result.kind === "verify" || result.kind === "unreadable"
      ? null
      : result.reference;
  const orderNumber = result.kind === "paid" ? result.orderNumber : null;

  useEffect(() => {
    // StrictMode mounts twice in development; this would otherwise double both
    // the verification request and the toast.
    if (startedRef.current) return;
    startedRef.current = true;

    // Only now that the money is confirmed is it safe to throw away the
    // basket and the saved bespoke answers.
    const finishOrder = () => {
      forgetPaymentOrigin();
      clearStoredProgress();
      clearCart();
    };

    const goToOrders = () =>
      setTimeout(() => {
        navigate(
          user
            ? ORDERS_PATH
            : `/login?returnTo=${encodeURIComponent(ORDERS_PATH)}`,
        );
      }, 3000);

    switch (result.kind) {
      case "cancelled":
        // Nothing was charged. The cart and any bespoke answers are still
        // intact, so send people back to exactly where they started.
        toast("Payment cancelled. Nothing was charged.");
        navigate(takePaymentOrigin(), { replace: true });
        return;

      case "failed":
        navigate(`/payment/failed?${searchParams.toString()}`, {
          replace: true,
        });
        return;

      case "paid":
        toast.success("Payment confirmed.");
        finishOrder();
        goToOrders();
        return;

      case "unreadable":
        return;

      case "verify":
        // Flutterwave redirected straight here, so confirm the charge before
        // telling anyone it worked.
        api
          .get("/payments/flutterwave/verify", {
            params: {
              ...(result.transactionId
                ? { transaction_id: result.transactionId }
                : {}),
              ...(result.txRef ? { tx_ref: result.txRef } : {}),
              status: result.status,
            },
          })
          .then(() => {
            setPhase("verified");
            toast.success("Payment confirmed.");
            finishOrder();
            goToOrders();
          })
          .catch((error) => {
            console.error("Verification error:", error);
            setPhase("failed");
            toast.error("We could not confirm this payment yet.");
          });
    }
  }, [clearCart, navigate, result, searchParams, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefaf5] px-6">
      <div className="text-center max-w-md mx-auto p-10 bg-white border border-black/10">
        {phase === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-black border-t-transparent mx-auto mb-6" />
            <h2 className="text-2xl font-light mb-3">Confirming your payment</h2>
            <p className="text-gray-500 text-sm">
              One moment while we check this with Flutterwave.
            </p>
          </>
        )}

        {phase === "verified" && (
          <>
            <div className="w-14 h-14 border border-black/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-3">Payment confirmed</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your order is confirmed and now in production.
            </p>
            {orderNumber ? (
              <p className="text-xs text-gray-400 mb-6">Order {orderNumber}</p>
            ) : (
              reference && (
                <p className="text-xs text-gray-400 mb-6">
                  Reference: {reference}
                </p>
              )
            )}
            <p className="text-xs text-gray-400">Taking you to your orders...</p>
          </>
        )}

        {(phase === "failed" || phase === "unreadable") && (
          <>
            <div className="w-14 h-14 border border-amber-300 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-3">
              We could not confirm this yet
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {phase === "unreadable"
                ? "Your bank may still have completed the payment. Check your orders before paying again."
                : "If your account was debited, do not pay again. Send us the reference below and we will sort it out."}
            </p>
            {reference && (
              <p className="text-xs text-gray-400 mb-6">
                Reference: {reference}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link
                to={user ? ORDERS_PATH : "/login"}
                className="w-full py-3 bg-black text-white text-xs uppercase tracking-[0.18em] hover:bg-black/80 transition"
              >
                View my orders
              </Link>
              <a
                href={`mailto:sysempire@gmail.com?subject=Payment%20${encodeURIComponent(reference ?? "enquiry")}`}
                className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.18em] hover:border-black/40 hover:text-black transition"
              >
                Contact support
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
