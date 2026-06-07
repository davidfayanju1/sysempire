import { useState } from "react";
import { ArrowRight, ChevronLeft, CreditCard, Lock } from "lucide-react";

interface StepPaymentProps {
  orderData: any;
  onBack: () => void;
  onSubmit: (paymentMethod: "full" | "deposit") => void;
}

const StepPayment = ({ orderData, onBack, onSubmit }: StepPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"full" | "deposit">(
    "deposit",
  );

  // Calculate estimated price (simplified - replace with actual pricing logic)
  const estimatedPrice = 250;
  const depositAmount = Math.round(estimatedPrice * 0.5);

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Final Step
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Secure Your Order
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Choose your payment preference to begin production.
        </p>
      </div>

      {/* Order Summary */}
      <div className="border border-black/10 mb-8">
        <div className="p-5 border-b border-black/10">
          <h3 className="text-sm font-medium uppercase tracking-wider">
            Order Summary
          </h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Outfit Type</span>
            <span className="text-black capitalize">
              {orderData.outfitType?.replace("-", " ")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimated Price</span>
            <span className="text-black">
              ₦{estimatedPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-black/5">
            <span className="text-gray-600">Total</span>
            <span className="text-black font-medium">
              ₦{estimatedPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4 mb-8">
        <button
          onClick={() => setPaymentMethod("deposit")}
          className={`w-full p-5 border transition text-left ${
            paymentMethod === "deposit"
              ? "border-black bg-black/5"
              : "border-black/10 hover:border-black/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Pay Deposit (50%)</span>
            <div
              className={`w-4 h-4 border flex items-center justify-center rounded-full ${paymentMethod === "deposit" ? "border-black" : "border-gray-300"}`}
            >
              {paymentMethod === "deposit" && (
                <div className="w-2 h-2 bg-black rounded-full" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Pay ₦{depositAmount.toLocaleString()} now, balance before delivery
          </p>
        </button>

        <button
          onClick={() => setPaymentMethod("full")}
          className={`w-full p-5 border transition text-left ${
            paymentMethod === "full"
              ? "border-black bg-black/5"
              : "border-black/10 hover:border-black/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Pay in Full</span>
            <div
              className={`w-4 h-4 border flex items-center justify-center rounded-full ${paymentMethod === "full" ? "border-black" : "border-gray-300"}`}
            >
              {paymentMethod === "full" && (
                <div className="w-2 h-2 bg-black rounded-full" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Pay ₦{estimatedPrice.toLocaleString()} now
          </p>
        </button>
      </div>

      {/* Secure Note */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Lock className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] text-gray-400 tracking-wider uppercase">
          Secure Payment • 100% Protected
        </span>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => onSubmit(paymentMethod)}
        className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        Complete Order
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-4">
        By completing this order, you agree to our terms and conditions
      </p>
    </section>
  );
};

export default StepPayment;
