import { useState } from "react";
import { ArrowRight, ChevronLeft, CreditCard, Lock, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import {
  createOrder,
  initiateFlutterwavePayment,
  type CreateOrderPayload,
} from "../../services";
import type { OrderData } from "../../pages/custom-wear";

interface StepPaymentProps {
  orderData: OrderData;
  onBack: () => void;
  onSubmit: (paymentMethod: "full" | "deposit") => void;
}

const buildOrderNotes = (orderData: OrderData, paymentPlan: string): string => {
  const lines: string[] = [
    "=== BESPOKE ORDER ===",
    `Outfit Type: ${orderData.outfitType ?? "Not specified"}`,
  ];

  if (orderData.inspirationDescription) {
    lines.push(`Inspiration (text): ${orderData.inspirationDescription}`);
  }
  if (orderData.inspirationImage) {
    lines.push(`Inspiration (image): ${orderData.inspirationImage}`);
  }

  lines.push(`Fabric Option: ${orderData.fabricOption ?? "Not specified"}`);

  if (orderData.fabricDetails?.type) {
    lines.push(`Fabric Type: ${orderData.fabricDetails.type}`);
  }
  if (orderData.fabricDetails?.quantity) {
    lines.push(`Fabric Quantity: ${orderData.fabricDetails.quantity}`);
  }
  if (orderData.fabricDetails?.pickupPreference) {
    lines.push(`Fabric Handover: ${orderData.fabricDetails.pickupPreference}`);
  }
  if (orderData.fabricPreferences?.colors?.length) {
    lines.push(`Preferred Colors: ${orderData.fabricPreferences.colors.join(", ")}`);
  }
  if (orderData.fabricPreferences?.material) {
    lines.push(`Preferred Material: ${orderData.fabricPreferences.material}`);
  }
  if (orderData.fabricPreferences?.quality) {
    lines.push(`Fabric Quality: ${orderData.fabricPreferences.quality}`);
  }

  if (Object.keys(orderData.customizations).length) {
    lines.push(`Customizations: ${JSON.stringify(orderData.customizations)}`);
  }

  lines.push(`Measurement Method: ${orderData.measurementMethod ?? "Not provided"}`);
  lines.push(`Event Date: ${orderData.eventDate ?? "Not specified"}`);
  lines.push(
    `Delivery: ${orderData.deliveryPreference ?? "Not specified"}${orderData.isExpress ? " (Express)" : ""}`,
  );
  lines.push(`Payment Plan: ${paymentPlan}`);

  return lines.join("\n");
};

const BASE_PRICES: Record<string, number> = {
  "native-wear": 85000,
  corporate: 70000,
  dresses: 60000,
  suits: 75000,
  casual: 45000,
  wedding: 120000,
  uniforms: 40000,
  other: 65000,
};

const EMBROIDERY_PRICES: Record<string, number> = {
  None: 0,
  Minimal: 8000,
  Traditional: 15000,
  Premium: 25000,
};

const WEDDING_ROLE_PRICES: Record<string, number> = {
  Bride: 30000,
  Groom: 10000,
};

interface PriceBreakdown {
  basePrice: number;
  fabricFee: number;
  embroideryFee: number;
  weddingRoleFee: number;
  weddingFormalityFee: number;
  corporateBothFee: number;
  doubleBreastedFee: number;
  expressFee: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

const calculatePrice = (orderData: OrderData): PriceBreakdown => {
  const c = orderData.customizations as Record<string, string>;

  const basePrice = BASE_PRICES[orderData.outfitType ?? "other"] ?? 65000;

  const fabricFee =
    orderData.fabricOption === "source-fabric"
      ? orderData.fabricPreferences?.quality === "premium"
        ? 35000
        : 15000
      : orderData.fabricOption === "not-sure"
        ? 15000
        : 0;

  const embroideryFee = EMBROIDERY_PRICES[c.embroidery] ?? 0;
  const weddingRoleFee = WEDDING_ROLE_PRICES[c.role] ?? 0;
  const weddingFormalityFee = c.formality === "Formal" ? 20000 : 0;
  const corporateBothFee = c.skirtOrTrousers === "Both" ? 15000 : 0;
  const doubleBreastedFee =
    c.buttons === "Double-Breasted" || c.jacketStyle === "Double-Breasted"
      ? 5000
      : 0;

  const subtotal =
    basePrice +
    fabricFee +
    embroideryFee +
    weddingRoleFee +
    weddingFormalityFee +
    corporateBothFee +
    doubleBreastedFee;

  const expressFee = orderData.isExpress ? Math.round(subtotal * 0.3) : 0;
  const deliveryFee = orderData.deliveryPreference === "delivery" ? 5000 : 0;
  const total = subtotal + expressFee + deliveryFee;

  return {
    basePrice,
    fabricFee,
    embroideryFee,
    weddingRoleFee,
    weddingFormalityFee,
    corporateBothFee,
    doubleBreastedFee,
    expressFee,
    deliveryFee,
    subtotal,
    total,
  };
};

const StepPayment = ({ orderData, onBack, onSubmit }: StepPaymentProps) => {
  const user = useAuthStore((s) => s.user);

  const [paymentMethod, setPaymentMethod] = useState<"full" | "deposit">("deposit");
  const [guestName, setGuestName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : "",
  );
  const [guestEmail, setGuestEmail] = useState(user?.email ?? "");
  const [guestPhone, setGuestPhone] = useState(user?.phone ?? "");

  const pricing = calculatePrice(orderData);
  const estimatedPrice = pricing.total;
  const depositAmount = Math.round(estimatedPrice * 0.7);

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async () => {
      if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
        throw new Error("Please fill in your contact details.");
      }

      // Build measurements object from array
      const measurementsObj: Record<string, string> = {};
      if (Array.isArray(orderData.measurements)) {
        orderData.measurements.forEach((m: { name: string; value: string | number; unit?: string }) => {
          measurementsObj[m.name] = `${m.value}${m.unit ?? ""}`;
        });
      }

      // Primary color from fabric or customizations
      const primaryColor =
        orderData.fabricPreferences?.colors?.[0] ??
        (orderData.customizations as any)?.color ??
        "custom";

      // Shipping address — use collected address or studio fallback for pickup
      const shippingAddress = orderData.shippingAddress ?? {
        street: "Studio Pickup",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        postalCode: "",
      };

      const payload: CreateOrderPayload = {
        items: [
          {
            product: orderData.outfitType ?? "custom",
            quantity: 1,
            size: "custom",
            color: primaryColor,
            measurements: measurementsObj,
          },
        ],
        shippingAddress,
        billingAddress: shippingAddress,
        shippingFee: 0,
        tax: 0,
        discount: 0,
        shippingMethod: orderData.isExpress ? "express" : "standard",
        paymentMethod: "flutterwave",
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        notes: buildOrderNotes(orderData, paymentMethod),
      };

      const orderRes = await createOrder(payload);
      const orderId: string = orderRes.data?._id ?? orderRes.data?.id;

      if (!orderId) throw new Error("Order creation failed. Please try again.");

      const paymentRes = await initiateFlutterwavePayment(orderId);
      const paymentLink: string =
        paymentRes.data?.paymentLink ??
        paymentRes.data?.link ??
        paymentRes.data?.url ??
        paymentRes.data?.payment_link;

      if (!paymentLink) throw new Error("Could not retrieve payment link. Please try again.");

      return paymentLink;
    },
    onSuccess: (paymentLink) => {
      onSubmit(paymentMethod);
      window.location.href = paymentLink;
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Something went wrong. Please try again.";
      toast.error(msg);
    },
  });

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

      {/* Contact Details */}
      <div className="border border-black/10 mb-8">
        <div className="p-5 border-b border-black/10">
          <h3 className="text-sm font-medium uppercase tracking-wider">
            Contact Details
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>
        </div>
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
            <span className="text-gray-500 capitalize">
              {orderData.outfitType?.replace(/-/g, " ") ?? "Custom"} (base)
            </span>
            <span className="text-black">₦{pricing.basePrice.toLocaleString()}</span>
          </div>

          {pricing.fabricFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fabric sourcing</span>
              <span className="text-black">+₦{pricing.fabricFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.embroideryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Embroidery</span>
              <span className="text-black">+₦{pricing.embroideryFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.weddingRoleFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {(orderData.customizations as any).role} package
              </span>
              <span className="text-black">+₦{pricing.weddingRoleFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.weddingFormalityFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Formal wedding</span>
              <span className="text-black">+₦{pricing.weddingFormalityFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.corporateBothFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Skirt + Trousers set</span>
              <span className="text-black">+₦{pricing.corporateBothFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.doubleBreastedFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Double-breasted</span>
              <span className="text-black">+₦{pricing.doubleBreastedFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.expressFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Express service (30%)</span>
              <span className="text-black">+₦{pricing.expressFee.toLocaleString()}</span>
            </div>
          )}

          {pricing.deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Home delivery</span>
              <span className="text-black">+₦{pricing.deliveryFee.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-medium pt-3 border-t border-black/10">
            <span>Estimated Total</span>
            <span>₦{pricing.total.toLocaleString()}</span>
          </div>

          <p className="text-gray-400 text-xs pt-1">
            Final price confirmed after stylist consultation
          </p>
        </div>
      </div>

      {/* Pricing Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          The amounts shown are estimates. Your stylist will confirm the exact price during consultation. The deposit secures your slot and will be applied to your final balance.
        </p>
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
            <span className="font-medium">Pay Deposit (70%)</span>
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
        onClick={() => placeOrder()}
        disabled={isPending}
        className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Complete Order
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
        By completing this order you agree to our terms and conditions. You will
        be redirected to Flutterwave's secure payment page to complete your
        transaction.
      </p>
    </section>
  );
};

export default StepPayment;
