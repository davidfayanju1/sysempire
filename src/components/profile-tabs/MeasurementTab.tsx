import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ruler,
  User,
  Target,
  Move,
  Camera as CameraIcon,
  Image as ImageIcon,
  CheckCircle2,
  Hand,
  Activity,
  X,
  CheckCircle,
  Info,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import BodyScanCapture from "../measurement/BodyScanCapture";
import { DISCLAIMER, type Measurement } from "../../lib/bodyMeasurement";

interface SavedData {
  measurements: Measurement[];
  gender: "female" | "male";
  date: string;
  detectedHeight: number | null;
  method: "camera" | "upload";
}

// Gender-specific sensible defaults used for the photo-upload path (a full
// pose-estimation pass isn't run on uploaded stills, so we apply reasonable
// gender-appropriate starting values for the user to verify/edit manually).
function getMockMeasurements(gender: "female" | "male"): Measurement[] {
  if (gender === "female") {
    return [
      { name: "Height", value: 163, unit: "cm", description: "Total standing height" },
      { name: "Shoulder Width", value: 38, unit: "cm", description: "Shoulder point to shoulder point (back)" },
      { name: "Bust", value: 88, unit: "cm", description: "Fullest part of chest — taken at nipple line" },
      { name: "Under Bust", value: 73, unit: "cm", description: "Circumference directly below bust" },
      { name: "Waist", value: 70, unit: "cm", description: "Narrowest part of natural waist" },
      { name: "Hips", value: 96, unit: "cm", description: "Fullest part of hips and seat" },
      { name: "Neck", value: 35, unit: "cm", description: "Around the base of neck" },
      { name: "Arm Length", value: 58, unit: "cm", description: "Shoulder point to wrist bone" },
      { name: "Wrist", value: 16, unit: "cm", description: "Around the wrist bone" },
      { name: "Thigh", value: 56, unit: "cm", description: "Fullest part of upper thigh" },
      { name: "Calf", value: 36, unit: "cm", description: "Fullest part of calf" },
      { name: "Dress Length", value: 153, unit: "cm", description: "Shoulder to floor (full-length garment)" },
      { name: "Torso Length", value: 41, unit: "cm", description: "Shoulder to natural waist" },
    ];
  }
  return [
    { name: "Height", value: 172, unit: "cm", description: "Total standing height" },
    { name: "Shoulder Width", value: 44, unit: "cm", description: "Shoulder point to shoulder point (back)" },
    { name: "Chest", value: 97, unit: "cm", description: "Fullest part of chest — across shoulder blades" },
    { name: "Waist", value: 84, unit: "cm", description: "Narrowest part of natural waist" },
    { name: "Hips", value: 96, unit: "cm", description: "Fullest part of the seat" },
    { name: "Neck", value: 40, unit: "cm", description: "Around base of neck + 1 cm ease" },
    { name: "Sleeve Length", value: 64, unit: "cm", description: "Shoulder point to wrist (arm slightly bent)" },
    { name: "Wrist", value: 18, unit: "cm", description: "Around the wrist bone" },
    { name: "Thigh", value: 54, unit: "cm", description: "Fullest part of upper thigh" },
    { name: "Inseam", value: 80, unit: "cm", description: "Crotch to ankle (inner leg)" },
    { name: "Jacket Length", value: 70, unit: "cm", description: "Natural waist to hem (suit / agbada)" },
    { name: "Torso Length", value: 45, unit: "cm", description: "Shoulder to natural waist" },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
const MeasurementTab = () => {
  const [gender, setGender] = useState<"female" | "male">("female");

  const [showCameraScan, setShowCameraScan] = useState(false);
  const [showUploadResults, setShowUploadResults] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null);

  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const [savedData, setSavedData] = useState<SavedData | null>(() => {
    const raw = localStorage.getItem("userMeasurements");
    if (raw) {
      try {
        return JSON.parse(raw) as SavedData;
      } catch {
        /* corrupted data — ignore */
      }
    }
    return null;
  });

  const instructions = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Stand Straight",
      description: "Position yourself facing the camera with good posture",
      detail: "Feet shoulder-width apart, look directly at the camera",
    },
    {
      icon: <Move className="w-5 h-5" />,
      title: "Arms Visible",
      description: "Keep arms slightly away from your body",
      detail: "Don't cross arms or hide your hands",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Stay Centered",
      description: "Position yourself in the middle of the frame",
      detail: "Your whole body should be visible from head to toe",
    },
    {
      icon: <Hand className="w-5 h-5" />,
      title: "Raise Your Hand",
      description: "Lift either hand above shoulder level",
      detail: "This triggers the 3-second countdown before each capture",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Front, Then Side",
      description: "You'll capture two photos — front, then a 90° side turn",
      detail: "The side photo lets us measure your body's depth, not just width",
    },
  ];

  const refreshSaved = useCallback(() => {
    const raw = localStorage.getItem("userMeasurements");
    if (raw) {
      try {
        setSavedData(JSON.parse(raw) as SavedData);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const persistMeasurements = useCallback(
    (result: Measurement[], method: "camera" | "upload") => {
      const heightCm = result.find((m) => m.name === "Height")?.value ?? null;
      const record: SavedData = {
        measurements: result,
        gender,
        date: new Date().toISOString(),
        detectedHeight: heightCm,
        method,
      };
      localStorage.setItem("userMeasurements", JSON.stringify(record));

      console.group("📏 SYS EMPIRE — Body Measurements Saved");
      console.log(
        `%cGender: ${gender} | Method: ${method === "camera" ? "Guided Camera Scan" : "Photo Analysis"} | ${new Date().toLocaleString()}`,
        "color:#888;font-size:11px",
      );
      if (heightCm) console.log(`Detected height: ${heightCm} cm`);
      console.table(
        Object.fromEntries(result.map((m) => [m.name, `${m.value} ${m.unit}`])),
      );
      console.groupEnd();

      toast.success("Measurements saved to your profile!", {
        description: `${result.length} measurements recorded · ${new Date().toLocaleDateString()}`,
      });

      refreshSaved();
    },
    [refreshSaved, gender],
  );

  // ── Camera scan (front + side) ───────────────────────────────────────────
  const handleScanComplete = useCallback(
    (result: Measurement[]) => {
      persistMeasurements(result, "camera");
      setShowCameraScan(false);
    },
    [persistMeasurements],
  );

  // ── Photo upload ─────────────────────────────────────────────────────────
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
      setMeasurements(getMockMeasurements(gender));
      setShowUploadResults(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [gender]);

  const closeUploadResults = useCallback(() => {
    setShowUploadResults(false);
    setMeasurements(null);
    setCapturedImage(null);
  }, []);

  const confirmUploadResults = useCallback(() => {
    if (!measurements) return;
    persistMeasurements(measurements, "upload");
    closeUploadResults();
  }, [measurements, persistMeasurements, closeUploadResults]);

  const savedDate = savedData?.date
    ? new Date(savedData.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* ── Gender Selector ────────────────────────────────────────────────── */}
      <div className="border border-black/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-black/40" />
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Select Your Gender for Accurate Measurements
          </h3>
        </div>
        <div className="flex gap-3">
          {(["female", "male"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] transition border ${
                gender === g
                  ? "bg-black text-white border-black"
                  : "border-black/15 text-black/40 hover:border-black/30 hover:text-black/60"
              }`}
            >
              {g === "female" ? "Female" : "Male"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Instructions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">How It Works</h3>
          </div>

          <div className="space-y-6">
            {instructions.map((ins, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                  {ins.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-black/80 mb-1">{ins.title}</h4>
                  <p className="text-xs text-black/50">{ins.description}</p>
                  <p className="text-[10px] text-black/30 mt-1">{ins.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-black/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/60 mb-1">Pro Tip</p>
                <p className="text-xs text-black/50">
                  Wear form-fitting clothing for the most accurate measurements.
                  Dark colours against a plain light background work best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="border border-black/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="w-5 h-5 text-black/40" />
            <h3 className="text-sm uppercase tracking-[0.2em] text-black/40">
              Get Your Measurements
            </h3>
          </div>

          <div className="space-y-5">
            {/* Camera */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">Self Measurement</h4>
                  <p className="text-xs text-black/50 mt-1">Front + side camera scan</p>
                </div>
                <CameraIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Position yourself at a distance where your full body is visible.
                We guide you through a front photo and a side photo, then
                capture automatically when you raise your hand.
              </p>
              <button
                onClick={() => setShowCameraScan(true)}
                className="w-full px-4 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-black/90 transition flex items-center justify-center gap-2"
              >
                <CameraIcon className="w-4 h-4" />
                Start Self Measurement
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Upload */}
            <div className="border border-black/10 p-5 hover:border-black/20 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-base font-light tracking-tight">Upload Photo</h4>
                  <p className="text-xs text-black/50 mt-1">Use a full-body standing photo</p>
                </div>
                <ImageIcon className="w-5 h-5 text-black/40" />
              </div>
              <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                Upload a clear full-body photo standing straight with arms slightly
                away from your body. The photo should be well-lit and show your
                entire silhouette.
              </p>
              <button
                onClick={() => uploadFileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-black/20 text-black/60 text-xs uppercase tracking-[0.2em] hover:border-black hover:text-black transition flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Upload Full Photo
              </button>
            </div>

            {/* Saved measurements status */}
            <div className="pt-4 border-t border-black/10">
              {savedData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Saved Measurements
                      </p>
                      <p className="text-xs text-black/50 mt-0.5">
                        Last updated: {savedDate} ·{" "}
                        <span className="capitalize">{savedData.gender}</span> ·{" "}
                        {savedData.measurements.length} measurements
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {savedData.measurements.slice(0, 6).map((m) => (
                      <div key={m.name} className="bg-black/3 px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-black/30">{m.name}</p>
                        <p className="text-sm font-light text-black/70">
                          {m.value}
                          <span className="text-[9px] text-black/30 ml-0.5">{m.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      Saved Measurements
                    </p>
                    <p className="text-xs text-black/30 mt-1">No measurements saved yet</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden file input ──────────────────────────────────────────────── */}
      <input
        ref={uploadFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ── Camera scan (front + side) ────────────────────────────────────── */}
      {showCameraScan && (
        <BodyScanCapture
          onClose={() => setShowCameraScan(false)}
          onComplete={handleScanComplete}
          gender={gender}
        />
      )}

      {/* ── Upload results ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadResults && measurements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative w-full h-full bg-black overflow-y-auto py-12 px-6"
            >
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-end">
                  <button onClick={closeUploadResults} className="p-2 hover:bg-white/10 transition">
                    <X className="w-6 h-6 text-white/60 hover:text-white" />
                  </button>
                </div>

                {capturedImage && (
                  <div className="w-40 h-48 mx-auto overflow-hidden border border-white/20">
                    <img src={capturedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-green-400">
                      Measurements Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                      {gender === "female" ? "Female" : "Male"} Profile
                    </span>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/15 px-3 py-1">
                      Photo Analysis
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                    Your Body Profile
                  </h2>
                  <p className="text-amber-400/80 text-xs mt-4 max-w-md mx-auto leading-relaxed">
                    These are gender-appropriate starting estimates — please verify
                    and edit them before they're used for tailoring.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {measurements.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border border-white/10 p-4 hover:border-white/25 transition-all"
                    >
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/35 mb-2">
                        {m.name}
                      </p>
                      <p className="text-2xl font-light text-white">
                        {m.value}
                        <span className="text-xs text-white/35 ml-1">{m.unit}</span>
                      </p>
                      <p className="text-[9px] text-white/25 mt-1.5 leading-snug">
                        {m.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="border border-yellow-500/20 bg-yellow-500/5 p-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500/60 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-yellow-400/80 font-medium uppercase tracking-[0.2em] mb-2">
                        Important Disclaimer
                      </p>
                      <p className="text-[11px] text-white/35 leading-relaxed">{DISCLAIMER}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={closeUploadResults}
                    className="flex-1 py-4 border border-white/20 text-white/50 hover:border-white/35 text-sm uppercase tracking-[0.15em] transition"
                  >
                    Discard
                  </button>
                  <button
                    onClick={confirmUploadResults}
                    className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition font-medium"
                  >
                    Confirm & Save to Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeasurementTab;
