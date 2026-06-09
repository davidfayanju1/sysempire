import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Lock,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Shield,
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Shipping Info
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",

    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",

    // Shipping Method
    shippingMethod: "standard",

    // Save info
    saveInfo: false,
  });

  // Mock cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wool Overshirt",
      brand: "MHL x Harris Wharf",
      size: "M",
      color: "Navy",
      price: 195,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=120&h=160&fit=crop",
    },
    {
      id: 2,
      name: "Japanese Selvedge Denim",
      brand: "Universal Works",
      size: "32",
      color: "Raw Indigo",
      price: 89,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=120&h=160&fit=crop",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = formData.shippingMethod === "express" ? 12 : 5;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discount;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Process order
      console.log("Order submitted", { formData, cartItems, total });
      alert("Order placed successfully!");
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-[#FAF9F7] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
              {[
                { step: 1, label: "Shopping Bag", icon: Package },
                { step: 2, label: "Information", icon: User },
                { step: 3, label: "Payment", icon: CreditCard },
              ].map((s) => {
                const Icon = s.icon;
                const isActive = step === s.step;
                const isCompleted = step > s.step;

                return (
                  <div key={s.step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-[#1C1C1A] text-white"
                            : isCompleted
                              ? "bg-[#EFF3EA] text-[#3B5C2E]"
                              : "bg-[#EBE9E4] text-[#8C8C86]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          isActive ? "text-[#1C1C1A]" : "text-[#8C8C86]"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {s.step < 3 && (
                      <ChevronRight className="w-4 h-4 text-[#D4D1CA] mx-2 sm:mx-4" />
                    )}
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
                                <p className="text-xs text-[#8C8C86] uppercase tracking-wide">
                                  {item.brand}
                                </p>
                                <h3 className="text-[#1C1C1A] font-medium">
                                  {item.name}
                                </h3>
                                <div className="flex gap-3 mt-1 text-xs text-[#8C8C86]">
                                  <span>Size: {item.size}</span>
                                  <span>Color: {item.color}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
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
                                    updateQuantity(item.id, item.quantity - 1)
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
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-1.5 hover:bg-[#FAF9F7] transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-medium text-[#1C1C1A]">
                                £{(item.price * item.quantity).toFixed(2)}
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
                          to="/products"
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
                          £{subtotal.toFixed(2)}
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
                          £{subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
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
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
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
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Apartment, Suite, etc. (Optional)
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
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
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
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
                              <option>United Kingdom</option>
                              <option>United States</option>
                              <option>Canada</option>
                              <option>Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>
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
                          <span className="font-medium">£5.00</span>
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
                          <span className="font-medium">£12.00</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            saveInfo: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label className="text-sm text-[#6B6B64]">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-white border border-[#EBE9E4]">
                      <div className="p-6 border-b border-[#EBE9E4]">
                        <h2 className="text-lg font-light tracking-wide text-[#1C1C1A] flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Payment Method
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wide text-[#8C8C86] mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 text-xs text-[#8C8C86]">
                      <Lock className="w-3 h-3" />
                      <span>
                        Your payment information is encrypted and secure
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
                      to="/products"
                      className="flex items-center gap-2 text-[#6B6B64] hover:text-[#1C1C1A] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Continue shopping
                    </Link>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={step === 1 && cartItems.length === 0}
                      className="px-6 py-2 bg-[#1C1C1A] text-white text-sm tracking-wide hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to {step === 1 ? "Information" : "Payment"}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1C1C1A] text-white text-sm tracking-wide hover:bg-black transition-colors"
                    >
                      Place Order
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
                  {/* Promo Code */}
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-[#EBE9E4] focus:border-[#1C1C1A] outline-none transition-colors text-sm"
                      />
                      <button
                        type="button"
                        onClick={handlePromoApply}
                        className="px-4 py-2 border border-[#1C1C1A] text-sm hover:bg-[#1C1C1A] hover:text-white transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {promoError}
                      </p>
                    )}
                    {promoApplied && (
                      <p className="text-xs text-[#3B5C2E] mt-1">
                        10% discount applied!
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C8C86]">Subtotal</span>
                      <span className="text-[#1C1C1A]">
                        £{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8C8C86]">Shipping</span>
                      <span className="text-[#1C1C1A]">
                        £{shippingCost.toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#3B5C2E]">Discount</span>
                        <span className="text-[#3B5C2E]">
                          -£{discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-3 border-t border-[#EBE9E4]">
                      <span className="text-[#1C1C1A]">Total</span>
                      <span className="text-xl font-light text-[#1C1C1A]">
                        £{total.toFixed(2)}
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
