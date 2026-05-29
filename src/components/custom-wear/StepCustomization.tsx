import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";

interface StepCustomizationProps {
  onBack: () => void;
  onNext: (customizations: Record<string, any>) => void;
  outfitType: string | null;
}

const StepCustomization = ({
  onBack,
  onNext,
  outfitType,
}: StepCustomizationProps) => {
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  const getCustomizationFields = () => {
    const commonFields = [
      {
        name: "fit",
        label: "Fit Preference",
        options: ["Regular", "Slim", "Relaxed", "Tailored"],
      },
    ];

    const fieldsByType: Record<string, any[]> = {
      "native-wear": [
        {
          name: "neckStyle",
          label: "Neck Style",
          options: ["Round", "V-Neck", "Mandarin", "Traditional"],
        },
        {
          name: "sleeveType",
          label: "Sleeve Type",
          options: ["Short", "Long", "3/4", "Cap"],
        },
        {
          name: "embroidery",
          label: "Embroidery",
          options: ["None", "Minimal", "Traditional", "Premium"],
        },
        {
          name: "trouserStyle",
          label: "Trouser Style",
          options: ["Straight", "Tapered", "Flared", "Drawstring"],
        },
      ],
      suits: [
        {
          name: "lapelStyle",
          label: "Lapel Style",
          options: ["Notch", "Peak", "Shawl"],
        },
        {
          name: "buttons",
          label: "Button Style",
          options: ["Two-Button", "Three-Button", "Double-Breasted"],
        },
        {
          name: "vents",
          label: "Vent Style",
          options: ["Single Vent", "Double Vent", "No Vent"],
        },
        {
          name: "pockets",
          label: "Pocket Style",
          options: ["Flap", "Jetted", "Patch", "Ticket"],
        },
      ],
      dresses: [
        {
          name: "neckline",
          label: "Neckline",
          options: [
            "Sweetheart",
            "V-Neck",
            "High Neck",
            "Off-Shoulder",
            "Halter",
          ],
        },
        {
          name: "sleeveType",
          label: "Sleeve Type",
          options: ["Sleeveless", "Short", "Long", "Puff", "Bell"],
        },
        {
          name: "length",
          label: "Length",
          options: ["Mini", "Knee", "Midi", "Maxi"],
        },
        {
          name: "silhouette",
          label: "Silhouette",
          options: ["A-Line", "Sheath", "Mermaid", "Ball Gown", "Empire"],
        },
      ],
      corporate: [
        {
          name: "jacketStyle",
          label: "Jacket Style",
          options: ["Single-Breasted", "Double-Breasted"],
        },
        {
          name: "skirtOrTrousers",
          label: "Bottom Style",
          options: ["Skirt", "Trousers", "Both"],
        },
        {
          name: "color",
          label: "Color Preference",
          options: ["Black", "Navy", "Charcoal", "Beige", "Burgundy"],
        },
      ],
      wedding: [
        {
          name: "role",
          label: "Role",
          options: [
            "Bride",
            "Groom",
            "Bridesmaid",
            "Groomsman",
            "Mother",
            "Guest",
          ],
        },
        {
          name: "formality",
          label: "Formality",
          options: ["Formal", "Semi-Formal", "Casual"],
        },
        {
          name: "colorScheme",
          label: "Color Scheme",
          options: ["White/Ivory", "Pastel", "Bold", "Traditional"],
        },
      ],
    };

    if (outfitType && fieldsByType[outfitType]) {
      return [...commonFields, ...fieldsByType[outfitType]];
    }
    return commonFields;
  };

  const fields = getCustomizationFields();

  const handleSelect = (name: string, value: string) => {
    setCustomizations((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete = fields.every((field) => customizations[field.name]);

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
          Step 04
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Customize Your Outfit
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Select your preferences and we'll bring your vision to life.
        </p>
      </div>

      <div className="space-y-8">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3">
              {field.label}
            </label>
            <div className="flex flex-wrap gap-3">
              {field.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleSelect(field.name, option)}
                  className={`px-5 py-2 border transition ${
                    customizations[field.name] === option
                      ? "border-black bg-black text-white"
                      : "border-black/10 text-gray-600 hover:border-black/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-12">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
        >
          Back
        </button>
        <button
          onClick={() => onNext(customizations)}
          disabled={!isComplete}
          className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </section>
  );
};

export default StepCustomization;
