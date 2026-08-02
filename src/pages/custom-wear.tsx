import DefaultLayout from "../layout/DefaultLayout";
import { useState, useRef, useEffect } from "react";
import Hero from "../components/custom-wear/Hero";
import StepOutfitType from "../components/custom-wear/StepOutfitType";
import StepInspiration from "../components/custom-wear/StepInspiration";
import StepFabric from "../components/custom-wear/StepFabric";
import StepCustomization from "../components/custom-wear/StepCustomization";
import StepDelivery from "../components/custom-wear/StepDelivery";
import StepPayment from "../components/custom-wear/StepPayment";
import StepMeasurement from "../components/custom-wear/StepMeasurement";
import StepReview from "../components/custom-wear/StepReview";
import type { Measurement } from "../components/custom-wear/MeasurementModal";

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

const CustomWear = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    outfitType: null,
    hasInspiration: null,
    fabricOption: null,
    customizations: {},
    measurements: null,
    measurementMethod: null,
  });

  // Only one step is ever mounted at a time, so a single ref reused across
  // whichever step is showing is enough (avoids dynamic ref-object indexing).
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }));
  };

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
              }}
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CustomWear;
