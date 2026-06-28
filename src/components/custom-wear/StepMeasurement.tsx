import { useState } from "react";
import { ChevronLeft, Camera, Image as ImageIcon, FileText, User, Users } from "lucide-react";
import MeasurementModal from "./MeasurementModal";

interface StepMeasurementProps {
  onBack: () => void;
  onNext: (measurements: any, method: "camera" | "upload" | "manual") => void;
}

interface MeasurementField {
  name: string;
  required: boolean;
  description: string;
  group: "general" | "top" | "bottom";
}

const FEMALE_FIELDS: MeasurementField[] = [
  { name: "Height",         required: true,  description: "Total standing height",                        group: "general" },
  { name: "Bust",           required: true,  description: "Fullest part of chest — at nipple line",       group: "top" },
  { name: "Under Bust",     required: true,  description: "Directly below the bust",                      group: "top" },
  { name: "Shoulder Width", required: true,  description: "Shoulder point to shoulder point",             group: "top" },
  { name: "Arm Length",     required: true,  description: "Shoulder point to wrist bone",                 group: "top" },
  { name: "Wrist",          required: false, description: "Around the wrist bone",                        group: "top" },
  { name: "Waist",          required: true,  description: "Narrowest part of natural waist",              group: "bottom" },
  { name: "Hips",           required: true,  description: "Fullest part of hips and seat",                group: "bottom" },
  { name: "Thigh",          required: false, description: "Fullest part of upper thigh",                  group: "bottom" },
  { name: "Calf",           required: false, description: "Fullest part of calf",                         group: "bottom" },
  { name: "Dress Length",   required: false, description: "Shoulder to floor (for full-length garment)",  group: "bottom" },
];

const MALE_FIELDS: MeasurementField[] = [
  { name: "Height",              required: true,  description: "Total standing height",                         group: "general" },
  { name: "Chest",               required: true,  description: "Fullest part of chest — across shoulder blades", group: "top" },
  { name: "Shoulder Width",      required: true,  description: "Shoulder point to shoulder point",              group: "top" },
  { name: "Sleeve Length",       required: true,  description: "Shoulder point to wrist (arm slightly bent)",   group: "top" },
  { name: "Neck",                required: false, description: "Around base of neck + 1 ease",                  group: "top" },
  { name: "Shirt / Buba Length", required: false, description: "Shoulder to hem of shirt or buba",              group: "top" },
  { name: "Wrist",               required: false, description: "Around the wrist bone",                         group: "top" },
  { name: "Waist",               required: true,  description: "Narrowest part of natural waist",               group: "bottom" },
  { name: "Hips",                required: true,  description: "Fullest part of the seat",                      group: "bottom" },
  { name: "Thigh",               required: false, description: "Fullest part of upper thigh",                   group: "bottom" },
  { name: "Inseam",              required: false, description: "Crotch to ankle — inner leg (trouser length)",  group: "bottom" },
];

// Estimated defaults in cm (used for photo upload fallback)
const FEMALE_DEFAULTS_CM: Record<string, number> = {
  Height: 163, Bust: 88, "Under Bust": 73, Waist: 70, Hips: 96,
  "Shoulder Width": 38, "Arm Length": 58, Wrist: 16, Thigh: 56,
  Calf: 36, "Dress Length": 153,
};
const MALE_DEFAULTS_CM: Record<string, number> = {
  Height: 172, Chest: 97, Waist: 84, Hips: 96, "Shoulder Width": 44,
  Neck: 40, "Sleeve Length": 64, Wrist: 18, Thigh: 54,
  Inseam: 80, "Shirt / Buba Length": 70,
};

const cmToIn = (cm: number) => parseFloat((cm / 2.54).toFixed(1));
const inToCm = (inch: number) => parseFloat((inch * 2.54).toFixed(1));

// ─────────────────────────────────────────────────────────────────────────────
const StepMeasurement = ({ onBack, onNext }: StepMeasurementProps) => {
  const [localGender, setLocalGender] = useState<"male" | "female" | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [manualValues, setManualValues] = useState<Record<string, string>>({});

  const fields = localGender === "male" ? MALE_FIELDS : FEMALE_FIELDS;
  const defaultsCm = localGender === "male" ? MALE_DEFAULTS_CM : FEMALE_DEFAULTS_CM;

  const handleUnitChange = (newUnit: "cm" | "in") => {
    if (newUnit === unit) return;
    const converted: Record<string, string> = {};
    Object.entries(manualValues).forEach(([key, val]) => {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        converted[key] = newUnit === "in"
          ? cmToIn(num).toString()
          : inToCm(num).toString();
      } else {
        converted[key] = val;
      }
    });
    setManualValues(converted);
    setUnit(newUnit);
  };

  const handleManualSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const measurements = fields.map((f) => ({
      name: f.name,
      value: parseFloat(manualValues[f.name] ?? "0") || 0,
      unit,
      description: f.description,
    }));
    onNext(measurements, "manual");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const measurements = fields.map((f) => ({
      name: f.name,
      value: defaultsCm[f.name] ?? 0,
      unit: "cm",
      description: f.description,
    }));
    onNext(measurements, "upload");
  };

  const handleCameraComplete = (measurements: any) => {
    onNext(measurements, "camera");
  };

  // ── SCREEN 0: Gender Selection ─────────────────────────────────────────────
  if (!localGender) {
    return (
      <section className="py-20 px-6 max-w-3xl mx-auto">
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
            Your Measurements
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            First, select your profile so we show the right measurement fields
            for your garment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <button
            onClick={() => setLocalGender("female")}
            className="p-10 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-black/60" />
            </div>
            <h3 className="text-xl font-medium mb-2">Female</h3>
            <p className="text-xs text-gray-400">Bust, waist, hips & more</p>
          </button>

          <button
            onClick={() => setLocalGender("male")}
            className="p-10 bg-white border border-black/5 hover:border-black/20 transition-all text-center"
          >
            <div className="w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-black/60" />
            </div>
            <h3 className="text-xl font-medium mb-2">Male</h3>
            <p className="text-xs text-gray-400">Chest, buba, trouser & more</p>
          </button>
        </div>
      </section>
    );
  }

  // ── SCREEN 2: Manual Form ──────────────────────────────────────────────────
  if (showManualForm) {
    const groups: { key: "general" | "top" | "bottom"; label: string }[] = [
      { key: "general", label: "General" },
      {
        key: "top",
        label: localGender === "male" ? "Top — Buba / Shirt / Agbada" : "Top",
      },
      {
        key: "bottom",
        label: localGender === "male" ? "Bottom — Trouser / Sokoto" : "Bottom",
      },
    ];

    return (
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <button
          onClick={() => setShowManualForm(false)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Options
        </button>

        <div className="text-center mb-8">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 05
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-3">
            Enter Your Measurements
          </h2>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            {localGender} profile · Fields marked * are required
          </p>
        </div>

        {/* Unit toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Unit:
          </span>
          <div className="flex">
            <button
              type="button"
              onClick={() => handleUnitChange("cm")}
              className={`px-6 py-2 text-xs uppercase tracking-wider border border-r-0 transition ${
                unit === "cm"
                  ? "bg-black text-white border-black"
                  : "border-black/20 text-black/60 hover:border-black/40"
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange("in")}
              className={`px-6 py-2 text-xs uppercase tracking-wider border transition ${
                unit === "in"
                  ? "bg-black text-white border-black"
                  : "border-black/20 text-black/60 hover:border-black/40"
              }`}
            >
              inches
            </button>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-10">
          {groups.map(({ key, label }) => {
            const groupFields = fields.filter((f) => f.group === key);
            if (groupFields.length === 0) return null;
            return (
              <div key={key}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-600 font-medium whitespace-nowrap">
                    {label}
                  </span>
                  <div className="flex-1 h-px bg-black/10" />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {groupFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                        {field.name}{" "}
                        {field.required && (
                          <span className="text-black/60">*</span>
                        )}
                      </label>
                      <p className="text-[10px] text-gray-300 mb-2">
                        {field.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          name={field.name}
                          required={field.required}
                          value={manualValues[field.name] ?? ""}
                          onChange={(e) =>
                            setManualValues((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                          placeholder={unit === "cm" ? "e.g. 88" : "e.g. 34.6"}
                          className="flex-1 px-4 py-3 border border-black/10 bg-white focus:outline-none focus:border-black/40 transition text-sm"
                        />
                        <span className="text-sm text-gray-400 w-10 shrink-0">
                          {unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="border border-amber-100 bg-amber-50 p-4 text-xs text-amber-700 leading-relaxed">
            <strong>Tip:</strong> Use a flexible tape measure against bare skin
            or close-fitting clothing. Do not hold it too tight or too loose. If
            measuring in inches, use the inch side of your tape rule.
          </div>

          <div className="border-t border-black/10 pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="flex-1 py-4 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition"
            >
              Confirm & Continue
            </button>
          </div>
        </form>
      </section>
    );
  }

  // ── SCREEN 1: Method Selection ─────────────────────────────────────────────
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 05
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-4">
          Your Measurements
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          For the perfect fit, we need your measurements. Choose the method
          that works best for you.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <p className="text-xs text-gray-400 tracking-widest capitalize">
            {localGender} profile · {fields.length} measurements
          </p>
          <button
            onClick={() => setLocalGender(null)}
            className="text-[10px] text-amber-600 underline underline-offset-2"
          >
            Change
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Camera */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Self Measurement</h3>
            <p className="text-xs text-gray-400">AI-powered body scanning</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Stand in front of your camera. Our AI detects your body proportions
            and calculates all measurements automatically. Raise your hand to
            capture.
          </p>
          <span className="block text-[10px] text-green-600 uppercase tracking-wider mb-3">
            ✓ Most accurate
          </span>
          <button
            onClick={() => setShowCameraModal(true)}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition"
          >
            Use Camera
          </button>
        </div>

        {/* Photo upload */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload Photo</h3>
            <p className="text-xs text-gray-400">
              Full-body photo — estimated defaults
            </p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Upload a clear full-body photo standing straight with arms slightly
            away. We apply {localGender}-appropriate estimates in cm — verify or
            edit them manually.
          </p>
          <span className="block text-[10px] text-amber-600 uppercase tracking-wider mb-3">
            ⚠ Estimated values — verify manually
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={handlePhotoUpload}
          />
          <label
            htmlFor="photo-upload"
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition block text-center cursor-pointer"
          >
            Select Photo
          </label>
        </div>

        {/* Manual entry */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Enter Manually</h3>
            <p className="text-xs text-gray-400">Fill in your numbers</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Already have your measurements from a tailor? Enter them in cm or
            inches — exactly as you would hand them to any traditional tailor.
          </p>
          <span className="block text-[10px] text-blue-500 uppercase tracking-wider mb-3">
            ✓ Recommended if tailor-measured
          </span>
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
          >
            Enter Measurements
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Style
        </button>
      </div>

      {showCameraModal && (
        <MeasurementModal
          onClose={() => setShowCameraModal(false)}
          onComplete={handleCameraComplete}
          gender={localGender}
        />
      )}
    </section>
  );
};

export default StepMeasurement;
