import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Lock,
  Minus,
  Plus,
  Trash2,
  Shield,
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  User,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import DefaultLayout from "../layout/DefaultLayout";
import { useCart } from "../util/useCart";
import { useAuthStore } from "../store/authStore";
import { initiateFlutterwavePayment } from "../services";
import type { CheckoutPayload } from "../types/api-cart";

const SHIPPING_FEES: Record<string, number> = {
  standard: 2000,
  express: 5000,
};

const CHECKOUT_STEPS = [
  { step: 1, label: "Shopping Bag", icon: Package },
  { step: 2, label: "Information", icon: User },
  { step: 3, label: "Review", icon: Shield },
];

const Checkout = () => {
  const {
    cartItems,
    cartLoading,
    updateQuantity,
    removeFromCart,
    checkout,
  } = useCart();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    billingSameAsShipping: true,
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingCountry: "Nigeria",
    billingPostalCode: "",
    shippingMethod: "standard",
    notes: "",
  });

  // Prefill contact info once the logged-in user's profile becomes available.
  // Adjusted during render (not in an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prefilledUserId, setPrefilledUserId] = useState<string | null>(null);
  if (user && user.id !== prefilledUserId) {
    setPrefilledUserId(user.id);
    setFormData((prev) => ({
      ...prev,
      guestName: prev.guestName || user.fullName,
      guestEmail: prev.guestEmail || user.email,
      guestPhone: prev.guestPhone || user.phone,
    }));
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = SHIPPING_FEES[formData.shippingMethod] ?? 0;
  const total = subtotal + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }

    setPlacingOrder(true);
    try {
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode || undefined,
      };

      const payload: CheckoutPayload = {
        shippingAddress,
        billingAddress: formData.billingSameAsShipping
          ? shippingAddress
          : {
              street: formData.billingStreet,
              city: formData.billingCity,
              state: formData.billingState,
              country: formData.billingCountry,
              postalCode: formData.billingPostalCode || undefined,
            },
        shippingFee,
        tax: 0,
        discount: 0,
        shippingMethod: formData.shippingMethod,
        paymentMethod: "flutterwave",
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        notes: formData.notes || undefined,
        clearCart: true,
      };

      const order = await checkout(payload);

      const paymentRes = await initiateFlutterwavePayment(order._id, total);
      const paymentLink: string =
        paymentRes.data?.paymentLink ??
        paymentRes.data?.link ??
        paymentRes.data?.url ??
        paymentRes.data?.payment_link;

      if (!paymentLink) {
        throw new Error("Could not retrieve payment link. Please try again.");
      }

      window.location.href = paymentLink;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Could not place your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <DefaultLayout>
      <section className="bg-[#1C1C1A] pt-24 pb-10 sm:pt-28 sm:pb-12 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/50 mb-2">
          Secure Checkout
        </p>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-wide">
          Complete Your Order
        </h1>
      </section>
      <div className="min-h-screen bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="relative flex items-start justify-between max-w-md mx-auto">
              {/* Track */}
              <div className="absolute top-[18px] left-[18px] right-[18px] h-px bg-[#EBE9E4]" />
              <div
                className="absolute top-[18px] left-[18px] h-px bg-[#1C1C1A] transition-all duration-500 ease-out"
                style={{
                  width: `calc((100% - 36px) * ${(step - 1) / (CHECKOUT_STEPS.length - 1)})`,
                }}
              />

              {CHECKOUT_STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.step;
                const isCompleted = step > s.step;

                return (
                  <div
                    key={s.step}
                    className="relative z-10 flex flex-col items-center gap-2 bg-[#FAF9F7] px-1"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#1C1C1A] border-[#1C1C1A] text-white"
                          : isActive
                            ? "bg-[#1C1C1A] border-[#1C1C1A] text-white ring-4 ring-[#1C1C1A]/10"
                            : "bg-white border-[#D4D1CA] text-[#8C8C86]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-medium whitespace-nowrap ${
                        isActive || isCompleted
                          ? "text-[#1C1C1A]"
                          : "text-[#8C8C86]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Cart Review */}
                {step === 1 && (
                  <div className="bg-white border border-[#EBE9E4]">
                    <div className="p-6 border-b border-[#EBE9E4]">
                      <h2 className="text-xl font-light tracking-wide text-[#1C1C1A]">
                        Shopping Bag
                      </h2>
                      <p className="text-[#8C8C86] text-sm mt-1">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    {cartLoading ? (
                      <div className="p-12 text-center text-[#8C8C86] text-sm">
                        Loading your bag...
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-[#EBE9E4]">
                          {cartItems.map((item) => (
                            <div key={item.id} className="p-6 flex gap-4">
                              <div className="w-20 h-24 bg-[#F5F4F0] shrink-0 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-[#1C1C1A] font-medium">
                                      {item.name}
                                    </h3>
                                    <div className="flex gap-3 mt-1 text-xs text-[#8C8C86]">
                                      <span>Size: {item.size}</span>
                                      <span>Color: {item.color}</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[#8C8C86] hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                  <div className="flex items-center border border-[#EBE9E4]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      className="p-1.5 hover:bg-[#FAF9F7] transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
                                      disabled={
                                        item.quantity >= item.maxQuantity
                                      }
                                      className="p-1.5 hover:bg-[#FAF9F7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="font-medium text-[#1C1C1A]">
                                    ₦
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("en-NG")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {cartItems.length === 0 && (
                          <div className="p-12 text-center">
                            <Package className="w-12 h-12 text-[#D4D1CA] mx-auto mb-3" />
                            <p className="text-[#8C8C86]">Your bag is empty</p>
                            <Link
                              to="/"
                              className="inline-block mt-4 text-sm text-[#1C1C1A] underline underline-offset-4"
                            >
                              Continue shopping
                            </Link>
                          </div>
                        )}

                        <div className="p-6 border-t border-[#EBE9E4] bg-[#FAF9F7]">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#8C8C86]">Subtotal</span>
                            <span className="text-[#1C1C1A]">
                              ₦{subtotal.toLocaleString("en-NG")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-4">
                            <span className="text-[#8C8C86]">Shipping</span>
                            <span className="text-[#1C1C1A]">
                              Calculated at next step
                            </span>
                          </div>
                          <div className="flex justify-between font-medium pt-3 border-t border-[#EBE9E4]">
                            <span className="text-[#1C1C1A]">Total</span>
                            <span className="text-[#1C1C1A]">
                              ₦{subtotal.toLocaleString("en-NG")}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 2: Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A] flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Contact Information
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="guestEmail"
                              value={formData.guestEmail}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="guestPhone"
                              value={formData.guestPhone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A] flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Shipping Address
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors bg-white"
                          >
                            <option>Nigeria</option>
                            <option>United Kingdom</option>
                            <option>United States</option>
                            <option>Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4] flex items-center justify-between">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A] flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Billing Address
                        </h2>
                        <label className="flex items-center gap-2 text-xs text-[#6B6B64]">
                          <input
                            type="checkbox"
                            checked={formData.billingSameAsShipping}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                billingSameAsShipping: e.target.checked,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          Same as shipping
                        </label>
                      </div>
                      {!formData.billingSameAsShipping && (
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              name="billingStreet"
                              value={formData.billingStreet}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                name="billingCity"
                                value={formData.billingCity}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                                State
                              </label>
                              <input
                                type="text"
                                name="billingState"
                                value={formData.billingState}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                                Postal Code
                              </label>
                              <input
                                type="text"
                                name="billingPostalCode"
                                value={formData.billingPostalCode}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Country
                            </label>
                            <select
                              name="billingCountry"
                              value={formData.billingCountry}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors bg-white"
                            >
                              <option>Nigeria</option>
                              <option>United Kingdom</option>
                              <option>United States</option>
                              <option>Canada</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shipping Method */}
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A] flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Shipping Method
                        </h2>
                      </div>
                      <div className="p-6 space-y-3">
                        <label className="flex items-center justify-between p-4 border border-[#EBE9E4] cursor-pointer hover:border-[#D4D1CA] transition-colors">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="standard"
                              checked={formData.shippingMethod === "standard"}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                            />
                            <div>
                              <span className="font-medium text-[#1C1C1A]">
                                Standard Shipping
                              </span>
                              <p className="text-xs text-[#8C8C86] mt-0.5">
                                3-5 business days
                              </p>
                            </div>
                          </div>
                          <span className="font-medium">
                            ₦{SHIPPING_FEES.standard.toLocaleString("en-NG")}
                          </span>
                        </label>
                        <label className="flex items-center justify-between p-4 border border-[#EBE9E4] cursor-pointer hover:border-[#D4D1CA] transition-colors">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value="express"
                              checked={formData.shippingMethod === "express"}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                            />
                            <div>
                              <span className="font-medium text-[#1C1C1A]">
                                Express Shipping
                              </span>
                              <p className="text-xs text-[#8C8C86] mt-0.5">
                                1-2 business days
                              </p>
                            </div>
                          </div>
                          <span className="font-medium">
                            ₦{SHIPPING_FEES.express.toLocaleString("en-NG")}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white border border-[#EBE9E4] p-6">
                      <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors resize-none"
                        placeholder="Delivery instructions, gift notes, etc."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A]">
                          Order Items
                        </h2>
                        <p className="text-[#8C8C86] text-sm mt-1">
                          {cartItems.length}{" "}
                          {cartItems.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="divide-y divide-[#EBE9E4]">
                        {cartItems.map((item) => (
                          <div key={item.id} className="p-6 flex gap-4">
                            <div className="w-16 h-20 bg-[#F5F4F0] shrink-0 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 flex justify-between">
                              <div>
                                <h3 className="text-[#1C1C1A] font-medium text-sm">
                                  {item.name}
                                </h3>
                                <div className="flex gap-3 mt-1 text-xs text-[#8C8C86]">
                                  <span>Size: {item.size}</span>
                                  <span>Color: {item.color}</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-medium text-[#1C1C1A] text-sm shrink-0">
                                ₦
                                {(item.price * item.quantity).toLocaleString(
                                  "en-NG",
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A]">
                          Review Your Order
                        </h2>
                      </div>
                      <div className="p-6 space-y-4 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Contact
                          </p>
                          <p className="text-[#1C1C1A]">
                            {formData.guestName} &middot; {formData.guestEmail}{" "}
                            &middot; {formData.guestPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Shipping Address
                          </p>
                          <p className="text-[#1C1C1A]">
                            {formData.street}, {formData.city},{" "}
                            {formData.state}, {formData.country}
                            {formData.postalCode
                              ? ` ${formData.postalCode}`
                              : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Shipping Method
                          </p>
                          <p className="text-[#1C1C1A] capitalize">
                            {formData.shippingMethod} &middot; ₦
                            {shippingFee.toLocaleString("en-NG")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Payment Method
                          </p>
                          <p className="text-[#1C1C1A]">Flutterwave</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8C8C86]">
                      <Lock className="w-3 h-3" />
                      <span>
                        Your order will be placed and you'll be redirected to
                        Flutterwave's secure page to complete payment.
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 text-[#6B6B64] hover:text-[#1C1C1A] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-[#6B6B64] hover:text-[#1C1C1A] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Continue shopping
                    </Link>
                  )}

                  {step < 3 ? (
                    <button
                      type="submit"
                      disabled={step === 1 && cartItems.length === 0}
                      className="px-6 py-2 bg-[#1C1C1A] text-white text-sm tracking-wide hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to {step === 1 ? "Information" : "Review"}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="px-6 py-2 bg-[#1C1C1A] text-white text-sm tracking-wide hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {placingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#EBE9E4] sticky top-24">
                <div className="p-6 border-b border-[#EBE9E4]">
                  <h2 className="text-lg font-light tracking-wide text-[#1C1C1A]">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C8C86]">Subtotal</span>
                      <span className="text-[#1C1C1A]">
                        ₦{subtotal.toLocaleString("en-NG")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C8C86]">Shipping</span>
                      <span className="text-[#1C1C1A]">
                        {step === 1
                          ? "Calculated at next step"
                          : `₦${shippingFee.toLocaleString("en-NG")}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium pt-3 border-t border-[#EBE9E4]">
                      <span className="text-[#1C1C1A]">Total</span>
                      <span className="text-xl font-light text-[#1C1C1A]">
                        ₦
                        {(step === 1 ? subtotal : total).toLocaleString(
                          "en-NG",
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-[#EBE9E4] space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#8C8C86]">
                      <Shield className="w-3 h-3" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8C8C86]">
                      <Truck className="w-3 h-3" />
                      <span>Free returns within 30 days</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8C8C86]">
                      <Clock className="w-3 h-3" />
                      <span>Order before 2pm for same-day dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Checkout;
