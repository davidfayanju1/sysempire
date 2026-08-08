import { useState } from "react";
import { ChevronLeft, Camera, Image as ImageIcon, FileText, User, Users, X } from "lucide-react";
import { toast } from "sonner";
import { uploadMedia } from "../../services";
import { getApiErrorMessage } from "../../lib/axios";
import BodyScanCapture from "../measurement/BodyScanCapture";
import type { Measurement } from "../../lib/bodyMeasurement";

interface StepMeasurementProps {
  onBack: () => void;
  onNext: (
    measurements: Measurement[],
    method: "camera" | "upload" | "manual",
    photos?: string[],
  ) => void;
}

interface SelectedPhoto {
  file: File;
  preview: string;
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
  const [showPhotoUploadForm, setShowPhotoUploadForm] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [frontPhoto, setFrontPhoto] = useState<SelectedPhoto | null>(null);
  const [sidePhoto, setSidePhoto] = useState<SelectedPhoto | null>(null);

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

  const handlePhotoSelect =
    (slot: "front" | "side") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const selected = { file, preview: reader.result as string };
        if (slot === "front") setFrontPhoto(selected);
        else setSidePhoto(selected);
      };
      reader.readAsDataURL(file);
    };

  const handlePhotoSubmit = async () => {
    if (!frontPhoto || !sidePhoto) return;

    setIsUploadingPhoto(true);
    try {
      const [frontRes, sideRes] = await Promise.all([
        uploadMedia(frontPhoto.file),
        uploadMedia(sidePhoto.file),
      ]);
      const extractUrl = (res: {
        data?: { url?: string; file?: { url?: string }; secure_url?: string };
      }) =>
        res.data?.url ?? res.data?.file?.url ?? res.data?.secure_url ?? "";
      const photos = [extractUrl(frontRes), extractUrl(sideRes)].filter(
        Boolean,
      );

      toast.success(
        "Photos received! We've applied estimated measurements as a starting point — our team will review your photos and email you if anything needs verifying before we cut fabric.",
      );
      const measurements = fields.map((f) => ({
        name: f.name,
        value: defaultsCm[f.name] ?? 0,
        unit: "cm",
        description: f.description,
      }));
      onNext(measurements, "upload", photos);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Photo upload failed. Please try again."));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCameraComplete = (measurements: Measurement[]) => {
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

  // ── SCREEN 3: Photo Upload Form ────────────────────────────────────────────
  if (showPhotoUploadForm) {
    return (
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <button
          onClick={() => setShowPhotoUploadForm(false)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Options
        </button>

        <div className="text-center mb-10">
          <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
            Step 05
          </span>
          <h2 className="text-3xl md:text-4xl font-light mt-4 mb-3">
            Upload Your Photos
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Upload a clear photo facing forward and a clear photo of your
            side profile, both showing your full figure, standing straight
            with arms slightly away from your body. We apply estimates for a{" "}
            {localGender} profile, in cm, as a starting point.
          </p>
        </div>

        <div className="border border-amber-100 bg-amber-50 p-4 text-xs text-amber-700 leading-relaxed mb-10 max-w-xl mx-auto">
          <strong>Heads up:</strong> These are estimated starting values, not
          precise measurements. Our team reviews every photo set and will
          email you if anything needs verifying before we cut fabric.
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-10">
          {(["front", "side"] as const).map((slot) => {
            const photo = slot === "front" ? frontPhoto : sidePhoto;
            const setPhoto = slot === "front" ? setFrontPhoto : setSidePhoto;
            return (
              <div key={slot}>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 text-center">
                  {slot === "front" ? "Front View" : "Side View"}
                </p>
                {photo ? (
                  <div className="relative aspect-[3/4]">
                    <img
                      src={photo.preview}
                      alt={`${slot} photo`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white"
                    >
                      <X className="w-4 h-4 text-black" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`photo-${slot}`}
                    className="flex flex-col items-center justify-center gap-2 aspect-[3/4] border-2 border-dashed border-black/10 hover:border-black/30 transition cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id={`photo-${slot}`}
                      className="hidden"
                      onChange={handlePhotoSelect(slot)}
                      disabled={isUploadingPhoto}
                    />
                    <ImageIcon className="w-6 h-6 text-black/30" />
                    <span className="text-xs text-gray-400">
                      Click to upload
                    </span>
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-md mx-auto flex gap-4">
          <button
            type="button"
            onClick={() => setShowPhotoUploadForm(false)}
            className="flex-1 py-4 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePhotoSubmit}
            disabled={!frontPhoto || !sidePhoto || isUploadingPhoto}
            className="flex-1 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploadingPhoto ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              "Confirm & Continue"
            )}
          </button>
        </div>
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

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {/* Camera */}
        <div className="flex flex-col border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Self Measurement</h3>
            <p className="text-xs text-gray-400">Guided front and side camera scan</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Stand in front of your camera for a front and a side photo. We
            detect your body proportions from both and calculate your
            measurements automatically. Raise your hand to capture.
          </p>
          <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-3">
            ✓ Most accurate
          </span>
          <button
            onClick={() => setShowCameraModal(true)}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition mt-auto"
          >
            Use Camera
          </button>
        </div>

        {/* Photo upload */}
        <div className="flex flex-col border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload Photos</h3>
            <p className="text-xs text-gray-400">
              Front and side photo, estimated defaults
            </p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Upload a clear photo facing forward and a clear photo of your
            side profile. We apply estimates for a {localGender} profile, in
            cm, as a starting point.
          </p>
          <span className="block text-[10px] text-amber-600 uppercase tracking-wider mb-3">
            ⚠ Estimated, our team verifies by email
          </span>
          <button
            onClick={() => setShowPhotoUploadForm(true)}
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition mt-auto"
          >
            {frontPhoto && sidePhoto ? "Edit Photos" : "Upload Photos"}
          </button>
        </div>

        {/* Manual entry */}
        <div className="flex flex-col border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Enter Manually</h3>
            <p className="text-xs text-gray-400">Fill in your numbers</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Already have your measurements from a tailor? Enter them in cm or
            inches, exactly as you would hand them to any traditional tailor.
          </p>
          <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-3">
            ✓ Recommended if measured by a tailor
          </span>
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition mt-auto"
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
        <BodyScanCapture
          onClose={() => setShowCameraModal(false)}
          onComplete={handleCameraComplete}
          gender={localGender}
        />
      )}
    </section>
  );
};

export default StepMeasurement;
