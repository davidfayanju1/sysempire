import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Package,
  Truck,
  HelpCircle,
} from "lucide-react";

interface StepFabricProps {
  onBack: () => void;
  onNext: (
    fabricOption: "have-fabric" | "source-fabric" | "not-sure",
    details?: any,
    preferences?: any,
  ) => void;
}

const StepFabric = ({ onBack, onNext }: StepFabricProps) => {
  const [fabricOption, setFabricOption] = useState<
    "have" | "source" | "unsure" | null
  >(null);
  const [fabricDetails, setFabricDetails] = useState({
    images: [] as string[],
    type: "",
    quantity: "",
    pickupPreference: "pickup" as "pickup" | "dropoff",
  });
  const [fabricPreferences, setFabricPreferences] = useState({
    colors: [] as string[],
    colorCount: "single" as "single" | "multiple",
    material: "",
    budget: "",
    quality: "standard" as "standard" | "premium",
    occasion: "",
  });

  const colorOptions = [
    "Black",
    "White",
    "Navy",
    "Burgundy",
    "Emerald",
    "Gold",
    "Silver",
    "Other",
  ];

  if (!fabricOption) {
    return (
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 03
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
            How would you like to handle fabric?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            We work with premium fabrics from around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <button
            onClick={() => setFabricOption("have")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">I already have fabric</h3>
            <p className="text-xs text-gray-400">I'll provide what I have</p>
          </button>

          <button
            onClick={() => setFabricOption("source")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">Help me source fabric</h3>
            <p className="text-xs text-gray-400">Recommend based on my needs</p>
          </button>

          <button
            onClick={() => setFabricOption("unsure")}
            className="p-8 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-2">I'm not sure yet</h3>
            <p className="text-xs text-gray-400">We'll discuss options later</p>
          </button>
        </div>
      </section>
    );
  }

  if (fabricOption === "have") {
    return (
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <button
          onClick={() => setFabricOption(null)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 03
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
            Tell us about your fabric
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Fabric Type
            </label>
            <input
              type="text"
              value={fabricDetails.type}
              onChange={(e) =>
                setFabricDetails({ ...fabricDetails, type: e.target.value })
              }
              placeholder="e.g., Cotton, Linen, Silk, Ankara"
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Quantity Available
            </label>
            <input
              type="text"
              value={fabricDetails.quantity}
              onChange={(e) =>
                setFabricDetails({ ...fabricDetails, quantity: e.target.value })
              }
              placeholder="e.g., 2 yards, 3 meters"
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Pickup Preference
            </label>
            <div className="flex gap-4">
              {/* <button
                onClick={() =>
                  setFabricDetails({
                    ...fabricDetails,
                    pickupPreference: "pickup",
                  })
                }
                className={`flex-1 py-3 border transition ${
                  fabricDetails.pickupPreference === "pickup"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                Schedule Pickup
              </button> */}
              <button
                onClick={() =>
                  setFabricDetails({
                    ...fabricDetails,
                    pickupPreference: "dropoff",
                  })
                }
                className={`flex-1 py-3 border transition ${
                  fabricDetails.pickupPreference === "dropoff"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                I'll Drop Off
              </button>
            </div>
            <small className="block mt-3">
              *You'll get directions to our studio after placing your order
            </small>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setFabricOption(null)}
            className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
          >
            Back
          </button>
          <button
            onClick={() => onNext("have-fabric", fabricDetails)}
            disabled={!fabricDetails.type}
            className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </section>
    );
  }

  if (fabricOption === "source") {
    return (
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <button
          onClick={() => setFabricOption(null)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 03
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
            Tell us your fabric preferences
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              How Many Colors?
            </label>
            <div className="flex gap-3 mb-4">
              <button
                onClick={() =>
                  setFabricPreferences({
                    ...fabricPreferences,
                    colorCount: "single",
                    colors: fabricPreferences.colors.slice(0, 1),
                  })
                }
                className={`flex-1 py-2.5 border text-xs transition ${
                  fabricPreferences.colorCount === "single"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                Single Color
              </button>
              <button
                onClick={() =>
                  setFabricPreferences({
                    ...fabricPreferences,
                    colorCount: "multiple",
                  })
                }
                className={`flex-1 py-2.5 border text-xs transition ${
                  fabricPreferences.colorCount === "multiple"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                Multiple Colors
              </button>
            </div>

            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Preferred Color{fabricPreferences.colorCount === "multiple" ? "s" : ""}
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (fabricPreferences.colorCount === "single") {
                      setFabricPreferences({
                        ...fabricPreferences,
                        colors: [color],
                      });
                    } else {
                      if (fabricPreferences.colors.includes(color)) {
                        setFabricPreferences({
                          ...fabricPreferences,
                          colors: fabricPreferences.colors.filter(
                            (c) => c !== color,
                          ),
                        });
                      } else {
                        setFabricPreferences({
                          ...fabricPreferences,
                          colors: [...fabricPreferences.colors, color],
                        });
                      }
                    }
                  }}
                  className={`px-3 py-1.5 text-xs border transition ${
                    fabricPreferences.colors.includes(color)
                      ? "border-black bg-black text-white"
                      : "border-black/10 text-gray-600 hover:border-black/30"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {fabricPreferences.colorCount === "single" && fabricPreferences.colors.length > 0 && (
              <p className="text-[10px] text-gray-400 mt-2">
                Selected: {fabricPreferences.colors[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Material Preference
            </label>
            <select
              value={fabricPreferences.material}
              onChange={(e) =>
                setFabricPreferences({
                  ...fabricPreferences,
                  material: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-black/10 focus:border-black/40 outline-none transition bg-white"
            >
              <option value="">Select material</option>
              <option value="cotton">Cotton</option>
              <option value="linen">Linen</option>
              <option value="silk">Silk</option>
              <option value="wool">Wool</option>
              <option value="lace">Lace</option>
              <option value="ankara">Ankara</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              Quality Preference
            </label>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setFabricPreferences({
                    ...fabricPreferences,
                    quality: "standard",
                  })
                }
                className={`flex-1 py-3 border transition ${
                  fabricPreferences.quality === "standard"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() =>
                  setFabricPreferences({
                    ...fabricPreferences,
                    quality: "premium",
                  })
                }
                className={`flex-1 py-3 border transition ${
                  fabricPreferences.quality === "premium"
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                Premium
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setFabricOption(null)}
            className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
          >
            Back
          </button>
          <button
            onClick={() =>
              onNext("source-fabric", undefined, fabricPreferences)
            }
            className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
          >
            Continue <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 max-w-2xl mx-auto">
      <button
        onClick={() => setFabricOption(null)}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 03
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          We'll help you choose
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          A stylist will reach out to discuss fabric options based on your
          outfit and occasion.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setFabricOption(null)}
          className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
        >
          Back
        </button>
        <button
          onClick={() => onNext("not-sure")}
          className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
        >
          Continue <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </section>
  );
};

export default StepFabric;
