import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { trackOrder } from "../../services";

interface OrderTrackingModalProps {
  orderNumber: string | null;
  email?: string;
  onClose: () => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const OrderTrackingModal = ({
  orderNumber,
  email,
  onClose,
}: OrderTrackingModalProps) => {
  const isOpen = !!orderNumber;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["order-tracking", orderNumber, email],
    queryFn: () => trackOrder(orderNumber as string, email),
    enabled: isOpen,
  });

  const tracking = data?.data;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-5 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                  Track Order
                </p>
                <p className="font-medium text-black mt-0.5">
                  {orderNumber}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-black/40 hover:text-black transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  <p className="text-xs text-black/40 tracking-wide">
                    Fetching tracking info...
                  </p>
                </div>
              )}

              {isError && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <p className="text-sm text-black/60">
                    {(axios.isAxiosError(error) &&
                      error.response?.data?.message) ||
                      "Couldn't load tracking info for this order."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="text-xs uppercase tracking-[0.15em] text-black border border-black/20 px-5 py-2 hover:border-black/60 transition disabled:opacity-50"
                  >
                    {isFetching ? "Retrying..." : "Try Again"}
                  </button>
                </div>
              )}

              {tracking && (
                <div className="space-y-8">
                  {/* Status summary */}
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        tracking.isCancelled ? "text-red-600" : "text-black"
                      }`}
                    >
                      {tracking.statusLabel}
                    </p>
                    <p className="text-xs text-black/50 mt-1 leading-relaxed">
                      {tracking.statusDescription}
                    </p>
                  </div>

                  {/* Progress bar */}
                  {!tracking.isCancelled && (
                    <div>
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.15em] text-black/40 mb-2">
                        <span>
                          Step {tracking.progress.currentStep} of{" "}
                          {tracking.progress.totalSteps}
                        </span>
                        <span>
                          Est. delivery{" "}
                          {formatDate(tracking.estimatedDelivery)}
                        </span>
                      </div>
                      <div className="h-[2px] bg-black/10">
                        <div
                          className="h-full bg-black transition-all duration-500"
                          style={{ width: `${tracking.progress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="space-y-0">
                    {tracking.timeline.map((step, idx) => {
                      const isLast = idx === tracking.timeline.length - 1;
                      return (
                        <div key={step.status} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center border ${
                                step.completed
                                  ? "bg-black border-black"
                                  : step.current
                                    ? "border-black"
                                    : "border-black/20"
                              }`}
                            >
                              {step.completed && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                              {step.current && !step.completed && (
                                <div className="w-2 h-2 rounded-full bg-black" />
                              )}
                            </div>
                            {!isLast && (
                              <div
                                className={`w-px flex-1 min-h-[28px] ${
                                  step.completed ? "bg-black" : "bg-black/10"
                                }`}
                              />
                            )}
                          </div>
                          <div className={`pb-7 ${isLast ? "pb-0" : ""}`}>
                            <p
                              className={`text-sm ${
                                step.upcoming
                                  ? "text-black/40"
                                  : "text-black font-medium"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-black/40 mt-1 leading-relaxed">
                              {step.description}
                            </p>
                            {step.completedAt && (
                              <p className="text-[10px] text-black/30 mt-1 tracking-wide">
                                {formatDate(step.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderTrackingModal;
