import DefaultLayout from "../layout/DefaultLayout";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LogIn, ShieldCheck, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Hero from "../components/custom-wear/Hero";
import StepOutfitType from "../components/custom-wear/StepOutfitType";
import StepInspiration from "../components/custom-wear/StepInspiration";
import StepFabric from "../components/custom-wear/StepFabric";
import StepCustomization from "../components/custom-wear/StepCustomization";
import StepDelivery from "../components/custom-wear/StepDelivery";
import StepPayment from "../components/custom-wear/StepPayment";
import StepMeasurement from "../components/custom-wear/StepMeasurement";
import StepReview from "../components/custom-wear/StepReview";
import type { Measurement } from "../lib/bodyMeasurement";

export interface FabricDetails {
  images?: string[];
  type?: string;
  quantity?: string;
  pickupPreference?: "pickup" | "dropoff";
}

export interface FabricPreferences {
  colors?: string[];
  colorCount?: "single" | "multiple";
  material?: string;
  budget?: string;
  quality?: "standard" | "premium";
  occasion?: string;
}

export interface OrderData {
  // Step 1: Outfit Type
  outfitType: string | null;

  // Step 2: Inspiration
  hasInspiration: boolean | null;
  inspirationImage?: string;
  inspirationDescription?: string;

  // Step 3: Fabric
  fabricOption: "have-fabric" | "source-fabric" | "not-sure" | null;
  fabricDetails?: FabricDetails;
  fabricPreferences?: FabricPreferences;

  // Step 4: Customization
  customizations: Record<string, string>;

  // Step 5: Measurements
  measurements: Measurement[] | null;
  measurementMethod: "camera" | "upload" | "manual" | null;

  // Step 6: Delivery
  eventDate?: string;
  deliveryPreference?: "pickup" | "delivery";
  isExpress?: boolean;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };

  // Step 8: Payment
  paymentMethod?: "full" | "deposit";
}

const DEFAULT_ORDER_DATA: OrderData = {
  outfitType: null,
  hasInspiration: null,
  fabricOption: null,
  customizations: {},
  measurements: null,
  measurementMethod: null,
};

const PROGRESS_STORAGE_KEY = "customWearProgress";
const PROGRESS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredProgress {
  step: number;
  orderData: OrderData;
  savedAt: number;
}

const loadStoredProgress = (): StoredProgress | null => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    if (Date.now() - parsed.savedAt > PROGRESS_TTL_MS) {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const clearStoredProgress = () => {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
};

const CustomWear = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [restoredProgress] = useState(loadStoredProgress);
  const [step, setStep] = useState(() => restoredProgress?.step ?? 1);
  const [orderData, setOrderData] = useState<OrderData>(
    () => restoredProgress?.orderData ?? DEFAULT_ORDER_DATA,
  );
  const [showSaveMeasurementsPrompt, setShowSaveMeasurementsPrompt] =
    useState(false);

  // Only one step is ever mounted at a time, so a single ref reused across
  // whichever step is showing is enough (avoids dynamic ref-object indexing).
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }));
  };

  // Persist progress on every change so a reload resumes where the user left off.
  useEffect(() => {
    try {
      localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify({ step, orderData, savedAt: Date.now() }),
      );
    } catch {
      /* storage unavailable — ignore */
    }
  }, [step, orderData]);

  useEffect(() => {
    if (restoredProgress && restoredProgress.step > 1) {
      toast.success("Welcome back. Picking up where you left off.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToStep = () => {
    setTimeout(() => {
      if (stepContainerRef.current) {
        const offset = 100;
        const elementPosition =
          stepContainerRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 100);
  };

  const goToNextStep = () => {
    setStep((prev) => prev + 1);
    scrollToStep();
  };

  const goToPreviousStep = () => {
    setStep((prev) => prev - 1);
    scrollToStep();
  };

  useEffect(() => {
    scrollToStep();
  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-[#fefaf5]">
        <Hero />

        {/* Step 1: Outfit Type */}
        {step === 1 && (
          <div ref={stepContainerRef}>
            <StepOutfitType
              onNext={(outfitType) => {
                updateOrderData({ outfitType });
                goToNextStep();
              }}
            />
          </div>
        )}

        {/* Step 2: Inspiration */}
        {step === 2 && (
          <div ref={stepContainerRef}>
            <StepInspiration
              onBack={goToPreviousStep}
              onNext={(
                hasInspiration,
                inspirationImage,
                inspirationDescription,
              ) => {
                updateOrderData({
                  hasInspiration,
                  inspirationImage,
                  inspirationDescription,
                });
                goToNextStep();
              }}
              outfitType={orderData.outfitType}
            />
          </div>
        )}
        {/* Step 3: Fabric Preference */}
        {step === 3 && (
          <div ref={stepContainerRef}>
            <StepFabric
              onBack={goToPreviousStep}
              onNext={(fabricOption, fabricDetails, fabricPreferences) => {
                updateOrderData({
                  fabricOption,
                  fabricDetails,
                  fabricPreferences,
                });
                goToNextStep();
              }}
            />
          </div>
        )}

        {/* Step 4: Outfit Customization */}
        {step === 4 && (
          <div ref={stepContainerRef}>
            <StepCustomization
              onBack={goToPreviousStep}
              onNext={(customizations) => {
                updateOrderData({ customizations });
                goToNextStep();
              }}
              outfitType={orderData.outfitType}
            />
          </div>
        )}

        {/* Step 5: Measurements */}
        {step === 5 && (
          <div ref={stepContainerRef}>
            <StepMeasurement
              onBack={goToPreviousStep}
              onNext={(measurements, method) => {
                updateOrderData({ measurements, measurementMethod: method });
                goToNextStep();
                if (method === "camera" && !user) {
                  setShowSaveMeasurementsPrompt(true);
                }
              }}
            />
          </div>
        )}

        {/* Step 6: Delivery Timeline */}
        {step === 6 && (
          <div ref={stepContainerRef}>
            <StepDelivery
              onBack={goToPreviousStep}
              onNext={(
                eventDate,
                deliveryPreference,
                isExpress,
                shippingAddress,
              ) => {
                updateOrderData({
                  eventDate,
                  deliveryPreference,
                  isExpress,
                  shippingAddress,
                });
                goToNextStep();
              }}
            />
          </div>
        )}

        {/* Step 7: Review Order */}
        {step === 7 && (
          <div ref={stepContainerRef}>
            <StepReview
              orderData={orderData}
              onBack={goToPreviousStep}
              onNext={() => goToNextStep()}
            />
          </div>
        )}

        {/* Step 8: Payment */}
        {step === 8 && (
          <div ref={stepContainerRef}>
            <StepPayment
              orderData={orderData}
              onBack={goToPreviousStep}
              onSubmit={(paymentMethod) => {
                updateOrderData({ paymentMethod });
                clearStoredProgress();
              }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSaveMeasurementsPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-6"
            onClick={() => setShowSaveMeasurementsPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSaveMeasurementsPrompt(false)}
                className="absolute top-4 right-4 text-black/30 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>

              <span className="text-[10px] tracking-[0.3em] text-amber-600 uppercase font-serif">
                Guest Checkout
              </span>
              <h2 className="text-2xl font-light text-black mt-3 mb-4">
                Save these measurements?
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                You're continuing as a guest, so this scan will only be used
                for the current order and won't be saved to an account. Sign
                in to keep it on file — no rescanning next time you order.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-black text-white text-sm uppercase tracking-[0.15em] hover:bg-black/80 transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => setShowSaveMeasurementsPrompt(false)}
                  className="w-full py-3 border border-black/20 text-black/60 text-sm uppercase tracking-[0.15em] hover:border-black/40 hover:text-black transition"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">
                Your order and these measurements are already saved to this
                session — signing in won't repeat any step.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
};

export default CustomWear;
