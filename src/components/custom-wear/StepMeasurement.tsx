import { useState } from "react";
import {
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import MeasurementModal from "./MeasurementModal";

interface StepMeasurementProps {
  onBack: () => void;
  onNext: (measurements: any, method: "camera" | "upload" | "manual") => void;
  gender?: "male" | "female" | null;
}

interface ManualMeasurement {
  name: string;
  value: number;
  unit: string;
  description: string;
}

const StepMeasurement = ({ onBack, onNext, gender }: StepMeasurementProps) => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [, setManualMeasurements] = useState<ManualMeasurement[]>([]);
  //   const [selectedMethod, setSelectedMethod] = useState<
  //     "camera" | "upload" | "manual" | null
  //   >(null);

  // Nigerian tailor measurements based on gender
  const getMeasurementFields = () => {
    if (gender === "female") {
      return [
        { name: "Height", placeholder: "cm", required: true },
        { name: "Bust", placeholder: "cm", required: true },
        { name: "Under Bust", placeholder: "cm", required: true },
        { name: "Waist", placeholder: "cm", required: true },
        { name: "Hips", placeholder: "cm", required: true },
        { name: "Shoulder Width", placeholder: "cm", required: true },
        { name: "Arm Length", placeholder: "cm", required: true },
        { name: "Wrist", placeholder: "cm", required: false },
        { name: "Thigh", placeholder: "cm", required: false },
        { name: "Calf", placeholder: "cm", required: false },
        { name: "Dress Length", placeholder: "cm", required: false },
      ];
    } else {
      return [
        { name: "Height", placeholder: "cm", required: true },
        { name: "Chest", placeholder: "cm", required: true },
        { name: "Waist", placeholder: "cm", required: true },
        { name: "Hips", placeholder: "cm", required: true },
        { name: "Shoulder Width", placeholder: "cm", required: true },
        { name: "Neck", placeholder: "cm", required: false },
        { name: "Sleeve Length", placeholder: "cm", required: true },
        { name: "Wrist", placeholder: "cm", required: false },
        { name: "Thigh", placeholder: "cm", required: false },
        { name: "Inseam", placeholder: "cm", required: false },
        { name: "Jacket Length", placeholder: "cm", required: false },
      ];
    }
  };

  const handleMeasurementComplete = (
    measurements: any,
    method: "camera" | "upload",
  ) => {
    onNext(measurements, method);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const measurements: any = getMeasurementFields().map((field) => ({
      name: field.name,
      value: parseFloat(formData.get(field.name) as string),
      unit: "cm",
    }));
    setManualMeasurements(measurements);
    onNext(measurements, "manual");
  };

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
            <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
              Enter Your Measurements
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
              Fill in your measurements as you would give to a traditional
              tailor.
            </p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {getMeasurementFields().map((field) => (
              <div key={field.name}>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  {field.name} {field.required && "*"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="flex-1 px-4 py-3 border border-black/10 bg-white focus:outline-none focus:border-black/40 transition"
                  />
                  <span className="text-sm text-gray-400">
                    {field.placeholder}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 pt-8 mt-8">
            <p className="text-xs text-gray-400 text-center mb-6">
              Tip: For best results, have someone help you measure or use a
              flexible measuring tape against bare skin or tight clothing.
            </p>
            <div className="flex gap-4">
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
                Continue to Review
              </button>
            </div>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm tracking-[0.3em] text-amber-600 uppercase font-serif">
          Step 03
        </span>
        <h2 className="text-3xl md:text-4xl font-light mt-4 mb-6">
          Your Measurements
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          For the perfect fit, we need your measurements. Choose the method that
          works best for you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Option 1: Self Measurement with Camera */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Self Measurement</h3>
            <p className="text-xs text-gray-400">AI-powered body scanning</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Stand in front of your camera. Our AI will detect your body
            proportions and calculate measurements automatically.
          </p>
          <button
            onClick={() => setShowCameraModal(true)}
            className="w-full py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-black/80 transition"
          >
            Use Camera
          </button>
        </div>

        {/* Option 2: Upload Photo */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Upload Photo</h3>
            <p className="text-xs text-gray-400">Full-body photo analysis</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Upload a clear full-body photo. Make sure you're standing straight
            with arms slightly away from your body.
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Handle photo upload and measurement extraction
                // For now, use mock measurements
                const mockMeasurements = getMeasurementFields().map(
                  (field) => ({
                    name: field.name,
                    value:
                      field.name === "Height"
                        ? 170
                        : Math.floor(Math.random() * 30) + 70,
                    unit: "cm",
                  }),
                );
                handleMeasurementComplete(mockMeasurements, "upload");
              }
            }}
          />
          <label
            htmlFor="photo-upload"
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition block text-center cursor-pointer"
          >
            Select Photo
          </label>
        </div>

        {/* Option 3: Send Measurements */}
        <div className="border border-black/10 p-6 hover:border-black/20 transition">
          <div className="mb-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-medium mb-1">Send Measurements</h3>
            <p className="text-xs text-gray-400">Fill in your numbers</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Already know your measurements? Enter them manually as you would
            give to a traditional tailor.
          </p>
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full py-3 border border-black/20 text-black/60 text-xs uppercase tracking-wider hover:border-black/40 transition"
          >
            Enter Manually
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Style
        </button>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <MeasurementModal
          onClose={() => setShowCameraModal(false)}
          onComplete={(measurements) =>
            handleMeasurementComplete(measurements, "camera")
          }
          gender={gender ?? null}
        />
      )}
    </section>
  );
};

export default StepMeasurement;
