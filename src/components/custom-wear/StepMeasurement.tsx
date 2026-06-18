import { useState } from "react";
import { ChevronLeft, Camera, Image as ImageIcon, FileText } from "lucide-react";
import MeasurementModal from "./MeasurementModal";

interface StepMeasurementProps {
  onBack: () => void;
  onNext: (measurements: any, method: "camera" | "upload" | "manual") => void;
  gender?: "male" | "female" | null;
}

interface MeasurementField {
  name: string;
  unit: string;
  required: boolean;
  description: string;
}

const FEMALE_FIELDS: MeasurementField[] = [
  { name: "Height",         unit: "cm", required: true,  description: "Total standing height" },
  { name: "Bust",           unit: "cm", required: true,  description: "Fullest part of chest — at nipple line" },
  { name: "Under Bust",     unit: "cm", required: true,  description: "Directly below bust" },
  { name: "Waist",          unit: "cm", required: true,  description: "Narrowest part of natural waist" },
  { name: "Hips",           unit: "cm", required: true,  description: "Fullest part of hips and seat" },
  { name: "Shoulder Width", unit: "cm", required: true,  description: "Shoulder point to shoulder point" },
  { name: "Arm Length",     unit: "cm", required: true,  description: "Shoulder point to wrist bone" },
  { name: "Wrist",          unit: "cm", required: false, description: "Around the wrist bone" },
  { name: "Thigh",          unit: "cm", required: false, description: "Fullest part of upper thigh" },
  { name: "Calf",           unit: "cm", required: false, description: "Fullest part of calf" },
  { name: "Dress Length",   unit: "cm", required: false, description: "Shoulder to floor (full-length garment)" },
];

const MALE_FIELDS: MeasurementField[] = [
  { name: "Height",         unit: "cm", required: true,  description: "Total standing height" },
  { name: "Chest",          unit: "cm", required: true,  description: "Fullest part of chest — across shoulder blades" },
  { name: "Waist",          unit: "cm", required: true,  description: "Narrowest part of natural waist" },
  { name: "Hips",           unit: "cm", required: true,  description: "Fullest part of the seat" },
  { name: "Shoulder Width", unit: "cm", required: true,  description: "Shoulder point to shoulder point" },
  { name: "Neck",           unit: "cm", required: false, description: "Around base of neck + 1 cm ease" },
  { name: "Sleeve Length",  unit: "cm", required: true,  description: "Shoulder point to wrist (arm slightly bent)" },
  { name: "Wrist",          unit: "cm", required: false, description: "Around the wrist bone" },
  { name: "Thigh",          unit: "cm", required: false, description: "Fullest part of upper thigh" },
  { name: "Inseam",         unit: "cm", required: false, description: "Crotch to ankle (inner leg)" },
  { name: "Jacket Length",  unit: "cm", required: false, description: "Natural waist to hem (suit / agbada)" },
];

// Gender-appropriate defaults for photo upload (average West African body)
const FEMALE_DEFAULTS: Record<string, number> = {
  Height: 163, Bust: 88, "Under Bust": 73, Waist: 70, Hips: 96,
  "Shoulder Width": 38, "Arm Length": 58, Wrist: 16, Thigh: 56,
  Calf: 36, "Dress Length": 153,
};
const MALE_DEFAULTS: Record<string, number> = {
  Height: 172, Chest: 97, Waist: 84, Hips: 96, "Shoulder Width": 44,
  Neck: 40, "Sleeve Length": 64, Wrist: 18, Thigh: 54,
  Inseam: 80, "Jacket Length": 70,
};

// ─────────────────────────────────────────────────────────────────────────────
const StepMeasurement = ({ onBack, onNext, gender }: StepMeasurementProps) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const effectiveGender: "female" | "male" = gender === "male" ? "male" : "female";
  const fields = effectiveGender === "female" ? FEMALE_FIELDS : MALE_FIELDS;
  const defaults = effectiveGender === "female" ? FEMALE_DEFAULTS : MALE_DEFAULTS;

  const handleCameraComplete = (measurements: any) => {
    onNext(measurements, "camera");
  };

  const handleManualSubmit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const measurements = fields.map((f) => ({
      name: f.name,
      value: parseFloat(data.get(f.name) as string) || 0,
      unit: f.unit,
      description: f.description,
    }));

    console.group("📏 SYS EMPIRE — Body Measurements (Manual Entry)");
    console.log(
      `%cGender: ${effectiveGender} | Method: Manual Entry | ${new Date().toLocaleString()}`,
      "color:#888;font-size:11px",
    );
    console.table(Object.fromEntries(measurements.map((m) => [m.name, `${m.value} ${m.unit}`])));
    console.groupEnd();

    onNext(measurements, "manual");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    // Use gender-appropriate body defaults (real IMAGE-mode pose detection not available here)
    const measurements = fields.map((f) => ({
      name: f.name,
      value: defaults[f.name] ?? 0,
      unit: f.unit,
      description: f.description,
    }));

    console.group("📏 SYS EMPIRE — Body Measurements (Photo Upload — Estimated Defaults)");
    console.log(
      `%cGender: ${effectiveGender} | Method: Photo Upload | ${new Date().toLocaleString()}`,
      "color:#888;font-size:11px",
    );
    console.warn(
      "Photo-upload measurements are gender-appropriate estimates, not pose-detected values. Recommend camera scan or manual entry for precision.",
    );
    console.table(Object.fromEntries(measurements.map((m) => [m.name, `${m.value} ${m.unit}`])));
    console.groupEnd();

    onNext(measurements, "upload");
  };

  // ── Manual form ────────────────────────────────────────────────────────────
  if (showManualForm) {
    return (
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setShowManualForm(false)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Options
          </button>
          <div className="text-center">
            <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
              Step 03
            </span>
            <h2 className="text-3xl md:text-4xl font-light mt-4 mb-3">
              Enter Your Measurements
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-2">
              Fill in your measurements as you would give to a traditional tailor.
            </p>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              All measurements in centimetres (cm). Fields marked * are required.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleManualSubmit(e.currentTarget);
          }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                  {field.name} {field.required && <span className="text-black/60">*</span>}
                </label>
                <p className="text-[10px] text-gray-300 mb-2">{field.description}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    name={field.name}
                    required={field.required}
                    placeholder="e.g. 88"
                    className="flex-1 px-4 py-3 border border-black/10 bg-white focus:outline-none focus:border-black/40 transition text-sm"
                  />
                  <span className="text-sm text-gray-400 w-6 shrink-0">{field.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-amber-100 bg-amber-50 p-4 text-xs text-amber-700 leading-relaxed">
            <strong>Tip:</strong> For best results, have someone help you measure using a flexible
            tape measure against bare skin or close-fitting clothing. Do not hold the tape too
            tight or too loose.
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

  // ── Method selection ───────────────────────────────────────────────────────
  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 03
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-4">
          Your Measurements
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          For the perfect fit, we need your measurements. Choose the method
          that works best for you.
        </p>
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
          {effectiveGender} profile · {fields.length} measurements
        </p>
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
            Stand in front of your camera. Our AI detects your body proportions and
            calculates all measurements automatically. Raise your hand to capture.
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
            <p className="text-xs text-gray-400">Full-body photo — estimated defaults</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Upload a clear full-body photo standing straight with arms slightly away.
            We'll apply gender-appropriate estimated measurements — you can adjust them
            manually at any time.
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
            Already have your measurements from a tailor? Enter them directly —
            as you would hand them to any traditional tailor.
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
          gender={gender ?? null}
        />
      )}
    </section>
  );
};

export default StepMeasurement;
