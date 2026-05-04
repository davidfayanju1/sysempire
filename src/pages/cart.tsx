import { Link } from "react-router-dom";
import {
  Heart,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";

const Cart = () => {
  const [activeTab, setActiveTab] = useState("active"); // "active" or "completed"

  // Sample order data
  const orders = [
    {
      id: "SYS-2341",
      date: "May 2, 2026",
      status: "delivered",
      statusText: "Delivered",
      step: 4,
      total: "$245.00",
      items: [
        {
          name: "Silk Midi Dress",
          quantity: 1,
          price: "$189.00",
          image: "/images/dress.jpg",
        },
      ],
      tracking: {
        ordered: true,
        confirmed: true,
        shipped: true,
        delivered: true,
      },
    },
    {
      id: "SYS-2342",
      date: "May 1, 2026",
      status: "shipped",
      statusText: "Out for Delivery",
      step: 3,
      total: "$432.00",
      items: [
        {
          name: "Cashmere Blazer",
          quantity: 1,
          price: "$320.00",
          image: "/images/blazer.jpg",
        },
        {
          name: "Leather Trousers",
          quantity: 1,
          price: "$112.00",
          image: "/images/trousers.jpg",
        },
      ],
      tracking: {
        ordered: true,
        confirmed: true,
        shipped: true,
        delivered: false,
      },
    },
    {
      id: "SYS-2338",
      date: "April 25, 2026",
      status: "confirmed",
      statusText: "Processing",
      step: 2,
      total: "$178.00",
      items: [
        {
          name: "Oversized Linen Shirt",
          quantity: 2,
          price: "$89.00",
          image: "/images/shirt.jpg",
        },
      ],
      tracking: {
        ordered: true,
        confirmed: true,
        shipped: false,
        delivered: false,
      },
    },
    {
      id: "SYS-2335",
      date: "April 18, 2026",
      status: "delivered",
      statusText: "Delivered",
      step: 4,
      total: "$567.00",
      items: [
        {
          name: "Wool Coat",
          quantity: 1,
          price: "$420.00",
          image: "/images/coat.jpg",
        },
        {
          name: "Silk Scarf",
          quantity: 1,
          price: "$147.00",
          image: "/images/scarf.jpg",
        },
      ],
      tracking: {
        ordered: true,
        confirmed: true,
        shipped: true,
        delivered: true,
      },
    },
  ];

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const completedOrders = orders.filter((o) => o.status === "delivered");

  const displayedOrders =
    activeTab === "active" ? activeOrders : completedOrders;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "confirmed":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Package className="w-4 h-4 text-black/40" />;
    }
  };

  const trackingSteps = [
    { label: "Ordered", icon: Package },
    { label: "Confirmed", icon: CheckCircle },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: Heart },
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative bg-black pt-[4rem] border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
              <Package className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-white font-['Times_New_Roman',serif]">
                Your Collection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight font-['Times_New_Roman',serif] leading-tight">
              Order History
            </h1>
            <div className="w-16 h-px bg-black/15 mx-auto my-6" />
            <p className="text-sm text-white/80 max-w-md mx-auto font-light">
              Every piece tells a story. Here's where your journey with us
              lives.
            </p>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-black/10 mb-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${
                  activeTab === "active"
                    ? "text-black border-b border-black"
                    : "text-black/30 hover:text-black/60"
                }`}
              >
                Active Orders ({activeOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${
                  activeTab === "completed"
                    ? "text-black border-b border-black"
                    : "text-black/30 hover:text-black/60"
                }`}
              >
                Completed ({completedOrders.length})
              </button>
            </div>

            {/* Orders List */}
            {displayedOrders.length === 0 ? (
              <div className="text-center py-16 border border-black/10 bg-black/5">
                <Package className="w-12 h-12 text-black/10 mx-auto mb-4" />
                <p className="text-sm text-black/40 font-light font-['Times_New_Roman',serif]">
                  No orders to display
                </p>
                <Link
                  to="/shop"
                  className="inline-block mt-4 text-[9px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors underline underline-offset-4"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {displayedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-black/10 bg-white"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-black/10 bg-black/5">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-black/40">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-black/50 mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {order.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <span className="text-[10px] tracking-[0.15em] uppercase text-black/60">
                            {order.statusText}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-light text-black">
                            {order.total}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b border-black/10">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-2">
                          <div className="w-12 h-12 bg-black/5 border border-black/10" />
                          <div className="flex-1">
                            <p className="text-xs text-black font-light">
                              {item.name}
                            </p>
                            <p className="text-[9px] text-black/40">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-xs text-black/60">{item.price}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Timeline */}
                    {order.status !== "delivered" && (
                      <div className="p-6">
                        <p className="text-[8px] tracking-[0.2em] uppercase text-black/40 mb-6">
                          Order Progress
                        </p>
                        <div className="relative">
                          {/* Progress Bar Background */}
                          <div className="absolute top-4 left-0 right-0 h-px bg-black/10" />

                          {/* Progress Bar Fill */}
                          <div
                            className="absolute top-4 left-0 h-px bg-black transition-all duration-500"
                            style={{ width: `${(order.step / 4) * 100}%` }}
                          />

                          {/* Steps */}
                          <div className="relative flex justify-between">
                            {trackingSteps.map((step, idx) => {
                              const Icon = step.icon;
                              const isCompleted = idx + 1 <= order.step;

                              return (
                                <div key={step.label} className="text-center">
                                  <div
                                    className={`w-8 h-8 rounded-full border flex items-center justify-center mx-auto mb-2 transition-all ${
                                      isCompleted
                                        ? "bg-black border-black"
                                        : "bg-white border-black/20"
                                    }`}
                                  >
                                    <Icon
                                      className={`w-3 h-3 ${
                                        isCompleted
                                          ? "text-white"
                                          : "text-black/20"
                                      }`}
                                    />
                                  </div>
                                  <p
                                    className={`text-[7px] tracking-[0.15em] uppercase ${
                                      isCompleted
                                        ? "text-black/60"
                                        : "text-black/20"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delivered Badge */}
                    {order.status === "delivered" && (
                      <div className="p-6 bg-black/5 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-[9px] tracking-[0.15em] uppercase text-black/50">
                            Delivered on {order.date}
                          </span>
                        </div>
                        <button className="text-[8px] tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors underline underline-offset-4">
                          Write a Review
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="p-6 flex gap-4 justify-end border-t border-black/10">
                      <button className="text-[8px] tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors">
                        View Details
                      </button>
                      {order.status !== "delivered" && (
                        <button className="text-[8px] tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors underline underline-offset-4">
                          Need Help?
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button className="text-[8px] tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors underline underline-offset-4">
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Decorative element */}
            <div className="flex justify-center mt-16">
              <Heart className="w-3 h-3 text-black/10" />
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Cart;
