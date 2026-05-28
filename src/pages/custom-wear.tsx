import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import Hero from "../components/custom-wear/Hero";
import StepGender from "../components/custom-wear/StepGender";
import StepStyleIntent from "../components/custom-wear/StepStyleIntent";
import StepMeasurement from "../components/custom-wear/StepMeasurement";
import StepReview from "../components/custom-wear/StepReview";

export interface OrderData {
  gender: "male" | "female" | null;
  hasStyleInMind: boolean | null;
  styleDescription?: string;
  measurements: any | null;
  measurementMethod: "camera" | "upload" | "manual" | null;
}

const CustomWear = () => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    gender: null,
    hasStyleInMind: null,
    measurements: null,
    measurementMethod: null,
  });

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData((prev) => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-[#fefaf5]">
        <Hero />

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <StepGender
            onNext={(gender) => {
              updateOrderData({ gender });
              goToNextStep();
            }}
          />
        )}

        {/* Step 2: Style Intent */}
        {step === 2 && (
          <StepStyleIntent
            onBack={goToPreviousStep}
            onNext={(hasStyleInMind, styleDescription) => {
              updateOrderData({ hasStyleInMind, styleDescription });
              goToNextStep();
            }}
          />
        )}

        {/* Step 3: Measurement */}
        {step === 3 && (
          <StepMeasurement
            onBack={goToPreviousStep}
            onNext={(measurements, method) => {
              updateOrderData({ measurements, measurementMethod: method });
              goToNextStep();
            }}
            gender={orderData.gender}
          />
        )}

        {/* Step 4: Review & Order */}
        {step === 4 && (
          <StepReview
            orderData={orderData}
            onBack={goToPreviousStep}
            onSubmit={() => {
              // Handle order submission
              console.log("Order submitted:", orderData);
              // Navigate to success page or show confirmation
            }}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export default CustomWear;
