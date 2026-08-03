import { Link } from "react-router-dom";
import { Package, Minus, Plus, Trash2, Shield, Truck, Lock } from "lucide-react";
import DefaultLayout from "../layout/DefaultLayout";
import { useCart } from "../util/useCart";

const Cart = () => {
  const { cartItems, cartCount, cartLoading, removeFromCart, updateQuantity } =
    useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-black pt-[4rem] border-b border-black/10">
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1642872597460-278924cb13dd?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="w-full absolute inset-0 h-full object-cover opacity-30"
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
              <Package className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-white font-['Times_New_Roman',serif]">
                Your Selection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight font-['Times_New_Roman',serif] leading-tight">
              Shopping Bag
            </h1>
            <div className="w-16 h-px bg-black/15 mx-auto my-6" />
            <p className="text-sm text-white/80 max-w-md mx-auto font-light">
              {cartLoading
                ? "Loading your bag..."
                : cartCount > 0
                  ? `${cartCount} ${cartCount === 1 ? "item" : "items"} ready for checkout.`
                  : "Your bag is currently empty."}
            </p>
          </div>
        </div>
      </section>

      {/* Cart Section */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
          {cartLoading ? (
            <div className="max-w-4xl mx-auto text-center py-16 text-black/40 text-sm">
              Loading your bag...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="max-w-4xl mx-auto text-center py-16 border border-black/10 bg-black/5">
              <Package className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <p className="text-sm text-black/40 font-light font-['Times_New_Roman',serif]">
                Your bag is empty
              </p>
              <Link
                to="/"
                className="inline-block mt-4 text-[9px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors underline underline-offset-4"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Items */}
              <div className="lg:col-span-2 border border-black/10">
                <div className="divide-y divide-black/10">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex gap-4">
                      <div className="w-20 h-24 bg-black/5 shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="text-black font-medium">
                              {item.name}
                            </h3>
                            <div className="flex gap-3 mt-1 text-xs text-black/40">
                              <span>Size: {item.size}</span>
                              <span>Color: {item.color}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-black/40 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-black/10">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-black/5 transition-colors"
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
                              disabled={item.quantity >= item.maxQuantity}
                              className="p-1.5 hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-medium text-black">
                            ₦
                            {(item.price * item.quantity).toLocaleString(
                              "en-NG",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-black/10 sticky top-24">
                  <div className="p-6 border-b border-black/10">
                    <h2 className="text-lg font-light tracking-wide text-black">
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black/50">
                          Subtotal ({cartCount}{" "}
                          {cartCount === 1 ? "item" : "items"})
                        </span>
                        <span className="text-black">
                          ₦{subtotal.toLocaleString("en-NG")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-black/50">Shipping</span>
                        <span className="text-black/50">
                          Calculated at checkout
                        </span>
                      </div>
                      <div className="flex justify-between font-medium pt-3 border-t border-black/10">
                        <span className="text-black">Total</span>
                        <span className="text-xl font-light text-black">
                          ₦{subtotal.toLocaleString("en-NG")}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/checkout"
                      className="block w-full py-3 bg-black text-white text-xs uppercase tracking-wider text-center hover:bg-black/80 transition"
                    >
                      Proceed to Checkout
                    </Link>

                    <div className="pt-4 border-t border-black/10 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-black/50">
                        <Lock className="w-3 h-3" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/50">
                        <Truck className="w-3 h-3" />
                        <span>Free returns within 30 days</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/50">
                        <Shield className="w-3 h-3" />
                        <span>100% authentic pieces</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Cart;
