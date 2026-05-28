import { CheckCircle, Ruler, Sparkles, Heart } from "lucide-react";
import type { OrderData } from "../../pages/custom-wear";

interface StepReviewProps {
  orderData: OrderData;
  onBack: () => void;
  onSubmit: () => void;
}

const StepReview = ({ orderData, onBack, onSubmit }: StepReviewProps) => {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 04
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Review Your Order
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Please review your selections before we begin crafting your piece.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Gender Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                {orderData.gender === "male" ? (
                  <Sparkles className="w-4 h-4 text-black/60" />
                ) : (
                  <Heart className="w-4 h-4 text-black/60" />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Collection
                </p>
                <p className="font-medium capitalize">
                  SYS {orderData.gender === "male" ? "Men" : "Women"}
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
          <p className="text-sm text-gray-500">
            {orderData.gender === "male"
              ? "Powerful, elegant kings. Crafted from fine fibres that transcend time and generations."
              : "Elegant silhouettes that dance with grace. Timeless pieces designed for the woman who moves through life with confidence."}
          </p>
        </div>

        {/* Style Intent Card */}
        <div className="border border-black/10 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                {orderData.hasStyleInMind ? (
                  <Sparkles className="w-4 h-4 text-black/60" />
                ) : (
                  <Heart className="w-4 h-4 text-black/60" />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Style Approach
                </p>
                <p className="font-medium">
                  {orderData.hasStyleInMind
                    ? "I have a style in mind"
                    : "I need inspiration"}
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
          <p className="text-sm text-gray-500">
            {orderData.hasStyleInMind
              ? "You already know what you want. Our designers will work closely with you to bring your exact vision to life."
              : "Our creative team will guide you through styles, fabrics, and designs that suit your personality and body type."}
          </p>
        </div>

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
                      : "Manual Entry"}
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
              {orderData.measurements.slice(0, 6).map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between border-b border-black/5 py-2"
                >
                  <span className="text-xs text-gray-500">{m.name}</span>
                  <span className="text-sm font-light">
                    {m.value}
                    {m.unit}
                  </span>
                </div>
              ))}
              {orderData.measurements.length > 6 && (
                <div className="col-span-full text-center text-xs text-gray-400 pt-2">
                  +{orderData.measurements.length - 6} more measurements
                </div>
              )}
            </div>
          )}
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
            onClick={onSubmit}
            className="flex-1 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
          >
            Submit Order
          </button>
        </div>
      </div>
    </section>
  );
};

export default StepReview;
