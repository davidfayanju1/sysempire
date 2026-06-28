import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";

interface CustomizationField {
  name: string;
  label: string;
  hint?: string;
  options: string[];
  optionDescriptions?: Record<string, string>;
  required?: boolean;
}

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

  const getCustomizationFields = (): CustomizationField[] => {
    const commonFields: CustomizationField[] = [
      {
        name: "fit",
        label: "Fit Preference",
        hint: "How the garment sits on your body relative to your measurements.",
        options: ["Regular", "Slim", "Relaxed", "Tailored"],
        optionDescriptions: {
          Regular: "Standard fit — comfortable with room to move, suits most body types.",
          Slim: "Closer to the body with minimal excess fabric — clean, modern look.",
          Relaxed: "Loose and airy with extra room — easy, flowing feel.",
          Tailored: "Precisely shaped to your measurements — structured and sharp.",
        },
      },
    ];

    const fieldsByType: Record<string, CustomizationField[]> = {
      "native-wear": [
        {
          name: "neckStyle",
          label: "Neck Style",
          hint: "The shape of the opening at the collar of your garment.",
          options: ["Round", "V-Neck", "Mandarin", "Traditional"],
          optionDescriptions: {
            Round: "A simple circular neckline — classic and versatile.",
            "V-Neck": "A V-shaped opening at the front — elongates the neck.",
            Mandarin: "A short, raised collar with no fold — clean and refined.",
            Traditional: "Classic Nigerian collar with embroidered trim at the edge.",
          },
        },
        {
          name: "sleeveType",
          label: "Sleeve Type",
          hint: "The length and style of the sleeves on your top or buba.",
          options: ["Short", "Long", "3/4", "Sleeveless"],
          optionDescriptions: {
            Short: "Ends at the upper arm — cool and casual.",
            Long: "Full-length sleeve to the wrist — formal and traditional.",
            "3/4": "Falls between the elbow and wrist — a versatile middle ground.",
            Sleeveless: "No sleeves — open at the shoulder.",
          },
        },
        {
          name: "embroidery",
          label: "Embroidery",
          hint: "Decorative thread work stitched into the fabric, often around the collar, cuffs, or chest.",
          options: ["None", "Minimal", "Traditional", "Premium"],
          optionDescriptions: {
            None: "No embroidery — clean, minimalist finish.",
            Minimal: "Subtle stitching around the neckline or cuffs only.",
            Traditional: "Classic Nigerian motifs — Aso-oke or Ankara-style patterns.",
            Premium: "Heavy, intricate gold or silver thread embroidery — full coverage.",
          },
        },
        {
          name: "trouserStyle",
          label: "Trouser Style",
          hint: "The cut and silhouette of your sokoto or trouser.",
          options: ["Straight", "Tapered", "Flared", "Drawstring"],
          optionDescriptions: {
            Straight: "Same width from hip to ankle — timeless and versatile.",
            Tapered: "Gradually narrows toward the ankle — modern and clean.",
            Flared: "Widens below the knee — bold and traditional.",
            Drawstring: "Elastic or tied waist — relaxed and comfortable.",
          },
        },
        {
          name: "capStyle",
          label: "Cap / Headwear",
          hint: "Optional traditional cap to complete the native wear look. Each style carries its own cultural significance.",
          options: ["None", "Fila", "Okpu Agu", "Songhai", "Kofia", "Other"],
          optionDescriptions: {
            None: "No cap — outfit only.",
            Fila: "Yoruba round cap — soft, often embroidered. Can be worn tilted or straight.",
            "Okpu Agu": "Igbo eagle feather cap — a symbol of honour, status and bravery.",
            Songhai: "Northern Nigerian flat cap, also called Kube — simple and dignified.",
            Kofia: "Round white cap common in West African Muslim culture — modest and clean.",
            Other: "Have something specific in mind? Describe it in your notes at checkout.",
          },
          required: false,
        },
      ],
      suits: [
        {
          name: "lapelStyle",
          label: "Lapel Style",
          hint: "The lapel is the folded flap of fabric on the front of a jacket, just below the collar — it frames your chest and sets the tone of the suit.",
          options: ["Notch", "Peak", "Shawl"],
          optionDescriptions: {
            Notch: "A triangular cut at the collar junction — the most common and versatile style, suits any occasion.",
            Peak: "Points upward toward the shoulder — sharp and formal, often seen on tuxedos and power suits.",
            Shawl: "A smooth, uninterrupted curve with no notch — elegant and traditional, popular for dinner jackets.",
          },
        },
        {
          name: "buttons",
          label: "Button Style",
          hint: "Refers to the number and arrangement of buttons on the jacket front.",
          options: ["Two-Button", "Three-Button", "Double-Breasted"],
          optionDescriptions: {
            "Two-Button": "One or both buttons fasten — the most popular choice, versatile for all body types.",
            "Three-Button": "Higher button stance — more conservative and formal.",
            "Double-Breasted": "Two parallel rows of buttons — bold, fashion-forward, and very structured.",
          },
        },
        {
          name: "vents",
          label: "Vent Style",
          hint: "Vents are the vertical slits at the back hem of a jacket that allow ease of movement.",
          options: ["Single Vent", "Double Vent", "No Vent"],
          optionDescriptions: {
            "Single Vent": "One center slit — classic American style, casual and easy.",
            "Double Vent": "Two side slits — allows more movement and drapes cleanly when seated.",
            "No Vent": "A clean, uninterrupted back — very formal and structured.",
          },
        },
        {
          name: "pockets",
          label: "Pocket Style",
          hint: "The design of the hip pockets on the lower front of the jacket.",
          options: ["Flap", "Jetted", "Patch", "Ticket"],
          optionDescriptions: {
            Flap: "A fabric flap covers the pocket opening — practical, classic, and the most common.",
            Jetted: "Thin horizontal slit with no flap — sleek, minimalist, and very formal.",
            Patch: "A pocket sewn on top of the fabric — casual and relaxed, great for sport coats.",
            Ticket: "A small extra pocket on the right hip — traditionally used for train tickets.",
          },
        },
      ],
      dresses: [
        {
          name: "neckline",
          label: "Neckline",
          hint: "The shape of the fabric edge around your neck and upper chest.",
          options: ["Sweetheart", "V-Neck", "High Neck", "Off-Shoulder", "Halter"],
          optionDescriptions: {
            Sweetheart: "Curved, heart-shaped dip at the center — romantic and feminine.",
            "V-Neck": "A pointed V-shape — elongates the neck and flatters most body types.",
            "High Neck": "Covers the base of the neck — elegant, modest, and sophisticated.",
            "Off-Shoulder": "Sits below both shoulders exposing the collarbone — flirty and stylish.",
            Halter: "Strap ties around the neck with an open or low back — bold and summery.",
          },
        },
        {
          name: "sleeveType",
          label: "Sleeve Type",
          hint: "The style and length of the sleeves.",
          options: ["Sleeveless", "Short", "Long", "Puff", "Bell"],
          optionDescriptions: {
            Sleeveless: "No sleeves — clean and modern.",
            Short: "Ends at the upper arm — light and casual.",
            Long: "Full length to the wrist — elegant and modest.",
            Puff: "Gathered and inflated at the shoulder — dramatic and fashion-forward.",
            Bell: "Fitted at the top, flaring wide at the elbow or wrist — bohemian and graceful.",
          },
        },
        {
          name: "length",
          label: "Dress Length",
          hint: "Where the hem of the dress falls on your body.",
          options: ["Mini", "Knee", "Midi", "Maxi"],
          optionDescriptions: {
            Mini: "Falls mid-thigh — bold and youthful.",
            Knee: "Ends at or just below the knee — classic and versatile.",
            Midi: "Falls between the knee and ankle — elegant and modest.",
            Maxi: "Floor-length — dramatic, flowing, and formal.",
          },
        },
        {
          name: "silhouette",
          label: "Silhouette",
          hint: "The overall shape of the dress — how it fits and flows from shoulder to hem.",
          options: ["A-Line", "Sheath", "Mermaid", "Ball Gown", "Empire"],
          optionDescriptions: {
            "A-Line": "Fitted at the hips and flaring outward like an A — universally flattering.",
            Sheath: "Straight and slim from shoulder to hem — sleek, modern, and professional.",
            Mermaid: "Fitted through the body and flaring dramatically at the knee — bold and sexy.",
            "Ball Gown": "Fitted bodice with a full, voluminous skirt from the waist — princess silhouette.",
            Empire: "High waistline just below the bust with a flowing skirt — romantic and relaxed.",
          },
        },
      ],
      corporate: [
        {
          name: "jacketStyle",
          label: "Jacket Style",
          hint: "How the front of the jacket closes.",
          options: ["Single-Breasted", "Double-Breasted"],
          optionDescriptions: {
            "Single-Breasted": "One row of buttons — clean, versatile, and the most common choice.",
            "Double-Breasted": "Two overlapping rows of buttons — structured, authoritative, and fashion-forward.",
          },
        },
        {
          name: "skirtOrTrousers",
          label: "Bottom Style",
          hint: "Your preference for the bottom half of the corporate set.",
          options: ["Skirt", "Trousers", "Both"],
          optionDescriptions: {
            Skirt: "A tailored skirt — classic and professional.",
            Trousers: "Tailored pants — modern, powerful, and comfortable.",
            Both: "We'll make both so you can mix and match.",
          },
        },
        {
          name: "color",
          label: "Color Preference",
          hint: "The base color of your corporate outfit.",
          options: ["Black", "Navy", "Charcoal", "Beige", "Burgundy"],
          optionDescriptions: {
            Black: "Timeless and versatile — works for any corporate setting.",
            Navy: "Professional and approachable — slightly softer than black.",
            Charcoal: "Dark gray tone — sophisticated and serious.",
            Beige: "Warm neutral — great for daytime and lighter seasons.",
            Burgundy: "Deep wine red — bold yet professional.",
          },
        },
      ],
      wedding: [
        {
          name: "role",
          label: "Your Role",
          hint: "Helps us style the outfit appropriately for your part in the ceremony.",
          options: ["Bride", "Groom", "Bridesmaid", "Groomsman", "Mother", "Guest"],
          optionDescriptions: {
            Bride: "The focus of the event — we'll give this the full bridal treatment.",
            Groom: "Sharp, classic, and complementary to the bridal theme.",
            Bridesmaid: "Coordinated with the bridal party — elegant and harmonious.",
            Groomsman: "Coordinated with the groom — polished and uniform.",
            Mother: "Dignified and celebratory — befitting the occasion.",
            Guest: "Elegant and respectful of the event's dress code.",
          },
        },
        {
          name: "formality",
          label: "Formality Level",
          hint: "The overall tone and dress code of the wedding.",
          options: ["Formal", "Semi-Formal", "Casual"],
          optionDescriptions: {
            Formal: "Black tie or white tie — gowns, tuxedos, full traditional regalia.",
            "Semi-Formal": "Cocktail or smart-casual — suits, midi dresses, aso-ebi styles.",
            Casual: "Relaxed and comfortable — still elegant but without strict rules.",
          },
        },
        {
          name: "colorScheme",
          label: "Color Scheme",
          hint: "The palette to align with the wedding's theme or aso-ebi colour.",
          options: ["White/Ivory", "Pastel", "Bold", "Traditional"],
          optionDescriptions: {
            "White/Ivory": "Classic bridal palette — pure white or warm ivory tones.",
            Pastel: "Soft blush, mint, lavender — light and romantic.",
            Bold: "Rich, saturated colours — navy, burgundy, emerald, gold.",
            Traditional: "Aso-ebi fabric and colours as directed by the family.",
          },
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

  const isComplete = fields
    .filter((f) => f.required !== false)
    .every((field) => customizations[field.name]);

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

      <div className="space-y-10">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
              {field.label}
              {field.required === false && (
                <span className="ml-2 normal-case text-[10px] text-gray-300">
                  (optional)
                </span>
              )}
            </label>

            {field.hint && (
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                {field.hint}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {field.options.map((option: string) => (
                <button
                  key={option}
                  onClick={() => handleSelect(field.name, option)}
                  className={`px-5 py-2 border transition text-sm ${
                    customizations[field.name] === option
                      ? "border-black bg-black text-white"
                      : "border-black/10 text-gray-600 hover:border-black/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {customizations[field.name] &&
              field.optionDescriptions?.[customizations[field.name]] && (
                <p className="text-[11px] text-gray-500 mt-3 leading-relaxed pl-1 border-l-2 border-amber-200">
                  {field.optionDescriptions[customizations[field.name]]}
                </p>
              )}
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
