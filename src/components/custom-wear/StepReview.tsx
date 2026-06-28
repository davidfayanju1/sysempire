import {
  CheckCircle,
  Ruler,
  Sparkles,
  Heart,
  Package,
  Calendar,
} from "lucide-react";
import type { OrderData } from "../../pages/custom-wear";

interface StepReviewProps {
  orderData: OrderData;
  onBack: () => void;
  onNext: () => void; // Changed from onSubmit to onNext to match parent
}

const StepReview = ({ orderData, onBack, onNext }: StepReviewProps) => {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 07
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Review Your Order
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Please review your selections before we begin crafting your piece.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Outfit Type Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black/60" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Outfit Type
                </p>
                <p className="font-medium capitalize">
                  {orderData.outfitType?.replace("-", " ") || "Not selected"}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-black"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Inspiration Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-black/60" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Inspiration
                </p>
                <p className="font-medium">
                  {orderData.hasInspiration === true
                    ? "I have a design in mind"
                    : orderData.hasInspiration === false
                      ? "Need inspiration"
                      : "Not specified"}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-black"
            >
              Edit
            </button>
          </div>
          {orderData.inspirationDescription && (
            <p className="text-sm text-gray-500 mt-2">
              {orderData.inspirationDescription}
            </p>
          )}
          {orderData.inspirationImage && (
            <div className="mt-3 w-20 h-20 overflow-hidden border border-black/10">
              <img
                src={orderData.inspirationImage}
                alt="Inspiration"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Fabric Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-black/60" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Fabric
                </p>
                <p className="font-medium capitalize">
                  {orderData.fabricOption === "have-fabric"
                    ? "I have fabric"
                    : orderData.fabricOption === "source-fabric"
                      ? "Source for me"
                      : "Not sure yet"}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-black"
            >
              Edit
            </button>
          </div>
          {orderData.fabricDetails?.type && (
            <p className="text-sm text-gray-500 mt-2">
              Fabric type: {orderData.fabricDetails.type}
            </p>
          )}
          {orderData.fabricPreferences?.colors &&
            orderData.fabricPreferences.colors.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Colors: {orderData.fabricPreferences.colors.join(", ")}
              </p>
            )}
        </div>

        {/* Customization Card */}
        {Object.keys(orderData.customizations).length > 0 && (
          <div className="border border-black/10 p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black/60" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Customizations
                  </p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="text-xs text-gray-400 hover:text-black"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {Object.entries(orderData.customizations).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-black/5 py-2"
                >
                  <span className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-sm font-light">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Measurements Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <Ruler className="w-4 h-4 text-black/60" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Measurements
                </p>
                <p className="font-medium capitalize">
                  {orderData.measurementMethod === "camera"
                    ? "AI Body Scan"
                    : orderData.measurementMethod === "upload"
                      ? "Photo Analysis"
                      : orderData.measurementMethod === "manual"
                        ? "Manual Entry"
                        : "Not provided"}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-black"
            >
              Edit
            </button>
          </div>

          {orderData.measurements && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {orderData.measurements.slice(0, 6).map((m: any, idx: number) => {
                const altValue =
                  m.unit === "cm"
                    ? `${(m.value / 2.54).toFixed(1)} in`
                    : `${(m.value * 2.54).toFixed(0)} cm`;
                return (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-black/5 py-2 gap-2"
                  >
                    <span className="text-xs text-gray-500 shrink-0">{m.name}</span>
                    <span className="text-xs font-light text-right">
                      {m.value} {m.unit}
                      <span className="text-gray-400 ml-1">({altValue})</span>
                    </span>
                  </div>
                );
              })}
              {orderData.measurements.length > 6 && (
                <div className="col-span-full text-center text-xs text-gray-400 pt-2">
                  +{orderData.measurements.length - 6} more measurements
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delivery Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-black/60" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Delivery
                </p>
                <p className="font-medium">
                  {orderData.eventDate
                    ? new Date(orderData.eventDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-xs text-gray-400 hover:text-black"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 capitalize">
            {orderData.deliveryPreference === "pickup"
              ? "Pick up from studio"
              : "Deliver to me"}
            {orderData.isExpress && " • Express Service"}
          </p>
        </div>

        {/* Next Steps Note */}
        <div className="bg-amber-50 border border-amber-200 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">
                What happens next?
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                A stylist will review your selections within 24 hours. You'll
                receive a consultation link to discuss fabric options, design
                details, and schedule your fitting session.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={onBack}
            className="flex-1 py-4 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </section>
  );
};

export default StepReview;
