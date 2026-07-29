import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shirt, Truck } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getMyOrders } from "../../services";
import type { ApiOrder } from "../../types/api-cart";
import OrderTrackingModal from "./OrderTrackingModal";

const GRID_COLS =
  "sm:grid-cols-[minmax(0,2fr)_minmax(70px,0.6fr)_minmax(90px,0.7fr)_minmax(110px,0.8fr)_minmax(90px,auto)]";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

interface ParsedOrderNotes {
  fields: Record<string, string>;
  customizations?: Record<string, string>;
}

const parseOrderNotes = (notes?: string): ParsedOrderNotes | null => {
  if (!notes) return null;
  const fields: Record<string, string> = {};
  for (const line of notes.split("\n")) {
    if (!line || line.startsWith("===")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }

  let customizations: Record<string, string> | undefined;
  if (fields["Customizations"]) {
    try {
      customizations = JSON.parse(fields["Customizations"]);
    } catch {
      customizations = undefined;
    }
  }

  return { fields, customizations };
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  "in-production": "bg-purple-50 text-purple-700 border-purple-200",
  "ready-to-ship": "bg-cyan-50 text-cyan-700 border-cyan-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const getStatusStyle = (status: string) =>
  STATUS_STYLES[status.toLowerCase()] ??
  "bg-black/5 text-black/60 border-black/10";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatCurrency = (amount: number, currency: string) => {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${amount.toLocaleString("en-NG")}`;
};

const OrderHistoryTab = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [expandedMeasurements, setExpandedMeasurements] = useState<
    Set<string>
  >(new Set());

  const toggleMeasurements = (itemId: string) => {
    setExpandedMeasurements((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: getMyOrders,
  });

  const orders: ApiOrder[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        <p className="text-xs text-black/40 tracking-wide">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (isError) {
    const message =
      (axios.isAxiosError(error) && error.response?.data?.message) ||
      "Something went wrong while loading your orders.";
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 border border-black/10 px-6 text-center">
        <p className="text-sm text-black/60">{message}</p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs uppercase tracking-[0.15em] text-black border border-black/20 px-5 py-2 hover:border-black/60 transition disabled:opacity-50"
        >
          {isFetching ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-black/10 text-center">
        <p className="text-sm text-black/60">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border border-black/10 bg-neutral-50 shadow-sm"
    >
      {/* Table header */}
      <div
        className={`hidden sm:grid ${GRID_COLS} gap-4 px-5 py-3 border-b border-black/10 text-[10px] uppercase tracking-[0.15em] text-black/40`}
      >
        <span>Order</span>
        <span>Items</span>
        <span>Total</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-black/10">
        {orders.map((order) => {
          const isExpanded = expandedId === order._id;
          const itemCount = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );

          const toolbar = (
            <div className="inline-flex border border-black/15 divide-x divide-black/15 shrink-0">
              <button
                title="Track Order"
                onClick={() => setTrackingOrder(order.orderNumber)}
                className="p-2 text-black/60 hover:bg-black hover:text-white transition"
              >
                <Truck className="w-4 h-4" />
              </button>
              <button
                title={isExpanded ? "Hide Details" : "View Details"}
                onClick={() => setExpandedId(isExpanded ? null : order._id)}
                className="p-2 text-black/60 hover:bg-black hover:text-white transition"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          );

          return (
            <div key={order._id}>
              <div
                className={`flex flex-col gap-3 px-5 py-4 sm:grid ${GRID_COLS} sm:items-center sm:gap-4 hover:bg-black/3 transition`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 sm:contents">
                  <div>
                    <p className="font-medium text-black tracking-wide">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-black/40 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex sm:hidden">{toolbar}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:contents">
                  <span className="text-xs text-black/60">
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </span>
                  <span className="font-medium text-black">
                    {formatCurrency(order.total, order.currency)}
                  </span>
                  <span
                    className={`self-start text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 border w-fit ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="hidden sm:flex sm:justify-end">
                  {toolbar}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 space-y-5 border-t border-black/10 bg-white/60">
                      <div className="space-y-5 pt-4">
                        {order.items.map((item) => {
                          const notesData = item.isBespoke
                            ? parseOrderNotes(order.notes)
                            : null;
                          const inspirationImage =
                            notesData?.fields["Inspiration (image)"];
                          const thumbnail = item.image || inspirationImage;
                          const customizations = notesData?.customizations;
                          const fabricOption =
                            notesData?.fields["Fabric Option"];
                          const eventDate = notesData?.fields["Event Date"];
                          const measurementsExpanded =
                            expandedMeasurements.has(item._id);

                          return (
                            <div key={item._id} className="flex gap-4">
                              <div className="w-16 h-16 shrink-0 bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center">
                                {thumbnail ? (
                                  <img
                                    src={thumbnail}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Shirt className="w-6 h-6 text-black/20" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="text-sm text-black truncate">
                                      {item.name}
                                      {item.isBespoke && (
                                        <span className="ml-2 text-[10px] uppercase tracking-wide text-black/40">
                                          Bespoke
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-black/40 mt-0.5">
                                      {item.size !== "custom" &&
                                        `${item.size} · `}
                                      {item.color !== "custom" &&
                                        `${item.color} · `}
                                      Qty {item.quantity}
                                    </p>
                                  </div>
                                  <span className="text-sm text-black/70 shrink-0">
                                    {formatCurrency(
                                      item.subtotal,
                                      order.currency,
                                    )}
                                  </span>
                                </div>

                                {customizations && (
                                  <p className="text-xs text-black/50">
                                    {Object.values(customizations).join(
                                      " · ",
                                    )}
                                  </p>
                                )}

                                {(fabricOption &&
                                  fabricOption !== "not-sure") ||
                                eventDate ? (
                                  <p className="text-xs text-black/40">
                                    {fabricOption &&
                                      fabricOption !== "not-sure" &&
                                      `Fabric: ${fabricOption}`}
                                    {fabricOption &&
                                      fabricOption !== "not-sure" &&
                                      eventDate &&
                                      " · "}
                                    {eventDate && `Event Date: ${eventDate}`}
                                  </p>
                                ) : null}

                                {item.measurements && (
                                  <button
                                    onClick={() =>
                                      toggleMeasurements(item._id)
                                    }
                                    className="text-[10px] uppercase tracking-[0.15em] text-black/50 hover:text-black transition"
                                  >
                                    {measurementsExpanded
                                      ? "Hide Measurements"
                                      : "View Measurements"}
                                  </button>
                                )}

                                {item.measurements &&
                                  measurementsExpanded && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-black/50 pt-1">
                                      {Object.entries(item.measurements).map(
                                        ([key, value]) => (
                                          <div
                                            key={key}
                                            className="flex justify-between gap-2"
                                          >
                                            <span className="text-black/40">
                                              {key}
                                            </span>
                                            <span>{value}</span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs text-black/60 pt-1">
                        {order.shippingAddress && (
                          <div>
                            <p className="uppercase tracking-[0.15em] text-black/40 mb-1">
                              Shipping Address
                            </p>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.state}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        )}
                        <div>
                          <p className="uppercase tracking-[0.15em] text-black/40 mb-1">
                            Payment Status
                          </p>
                          <p className="capitalize">
                            {PAYMENT_STATUS_LABEL[
                              order.paymentStatus.toLowerCase()
                            ] ?? order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm pt-2 border-t border-black/10">
                        <span className="text-black/60">Total</span>
                        <span className="font-medium text-black">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <OrderTrackingModal
        orderNumber={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />
    </motion.div>
  );
};

export default OrderHistoryTab;
