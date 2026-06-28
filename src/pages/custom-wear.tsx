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

export interface OrderData {
  // Step 1: Outfit Type
  outfitType: string | null;

  // Step 2: Inspiration
  hasInspiration: boolean | null;
  inspirationImage?: string;
  inspirationDescription?: string;

  // Step 3: Fabric
  fabricOption: "have-fabric" | "source-fabric" | "not-sure" | null;
  fabricDetails?: {
    images?: string[];
    type?: string;
    quantity?: string;
    pickupPreference?: "pickup" | "dropoff";
  };
  fabricPreferences?: {
    colors?: string[];
    material?: string;
    budget?: string;
    quality?: "standard" | "premium";
    occasion?: string;
  };

  // Step 4: Customization
  customizations: Record<string, any>;

  // Step 5: Measurements
  measurements: any | null;
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

  const stepRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
    6: useRef<HTMLDivElement>(null),
    7: useRef<HTMLDivElement>(null),
    8: useRef<HTMLDivElement>(null),
  };

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }));
  };

  const scrollToStep = (stepNumber: number) => {
    setTimeout(() => {
      const currentRef = stepRefs[stepNumber as keyof typeof stepRefs];
      if (currentRef.current) {
        const offset = 100;
        const elementPosition = currentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 100);
  };

  const goToNextStep = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    scrollToStep(nextStep);
  };

  const goToPreviousStep = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    scrollToStep(prevStep);
  };

  useEffect(() => {
    scrollToStep(1);
  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-[#fefaf5]">
        <Hero />

        {/* Step 1: Outfit Type */}
        {step === 1 && (
          <div ref={stepRefs[1]}>
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
          <div ref={stepRefs[2]}>
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
          <div ref={stepRefs[3]}>
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
          <div ref={stepRefs[4]}>
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
          <div ref={stepRefs[5]}>
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
          <div ref={stepRefs[6]}>
            <StepDelivery
              onBack={goToPreviousStep}
              onNext={(eventDate, deliveryPreference, isExpress, shippingAddress) => {
                updateOrderData({ eventDate, deliveryPreference, isExpress, shippingAddress });
                goToNextStep();
              }}
            />
          </div>
        )}

        {/* Step 7: Review Order */}
        {step === 7 && (
          <div ref={stepRefs[7]}>
            <StepReview
              orderData={orderData}
              onBack={goToPreviousStep}
              onNext={() => goToNextStep()}
            />
          </div>
        )}

        {/* Step 8: Payment */}
        {step === 8 && (
          <div ref={stepRefs[8]}>
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
