import { useState } from "react";
import { ArrowRight, ChevronLeft, Calendar, Truck, Zap } from "lucide-react";

interface StepDeliveryProps {
  onBack: () => void;
  onNext: (
    eventDate: string,
    deliveryPreference: "pickup" | "delivery",
    isExpress: boolean,
  ) => void;
}

const StepDelivery = ({ onBack, onNext }: StepDeliveryProps) => {
  const [eventDate, setEventDate] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState<
    "pickup" | "delivery"
  >("delivery");
  const [isExpress, setIsExpress] = useState(false);

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
          Step 05
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          When do you need this?
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Most orders are event-driven. Let us know your timeline.
        </p>
      </div>

      <div className="space-y-8">
        {/* Event Date */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>
        </div>

        {/* Delivery Preference */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3">
            Delivery Preference
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setDeliveryPreference("delivery")}
              className={`flex-1 py-4 border transition ${
                deliveryPreference === "delivery"
                  ? "border-black bg-black text-white"
                  : "border-black/20 text-black/60 hover:border-black/40"
              }`}
            >
              <Truck className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Deliver to me</span>
            </button>
            <button
              onClick={() => setDeliveryPreference("pickup")}
              className={`flex-1 py-4 border transition ${
                deliveryPreference === "pickup"
                  ? "border-black bg-black text-white"
                  : "border-black/20 text-black/60 hover:border-black/40"
              }`}
            >
              <span className="text-xl mb-1 block">🏠</span>
              <span className="text-xs">Pick up from studio</span>
            </button>
          </div>
        </div>

        {/* Express Option */}
        <div>
          <button
            onClick={() => setIsExpress(!isExpress)}
            className={`w-full p-4 border transition flex items-center justify-between ${
              isExpress
                ? "border-black bg-black/5"
                : "border-black/10 hover:border-black/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap
                className={`w-5 h-5 ${isExpress ? "text-black" : "text-gray-400"}`}
              />
              <div className="text-left">
                <p className="text-sm font-medium">Express Tailoring</p>
                <p className="text-xs text-gray-400">
                  Rush order for urgent needs
                </p>
              </div>
            </div>
            <div
              className={`w-4 h-4 border ${isExpress ? "bg-black border-black" : "border-gray-300"}`}
            >
              {isExpress && <div className="w-full h-full bg-black" />}
            </div>
          </button>
        </div>

        {/* Timeline Info */}
        <div className="bg-black/5 p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            {isExpress
              ? "Express orders are completed in 7-10 business days. Additional fees apply."
              : "Standard orders take 14-21 business days. We'll confirm exact timeline after consultation."}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-12">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
        >
          Back
        </button>
        <button
          onClick={() => onNext(eventDate, deliveryPreference, isExpress)}
          disabled={!eventDate}
          className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </section>
  );
};

export default StepDelivery;
