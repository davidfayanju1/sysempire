// Progress trail shown directly beneath the hero on every step of the
// Custom Wear flow. A single fluid bar fills from 0 to 100% as the customer
// advances, rather than snapping between discrete blocks, so "how far am I"
// reads as continuous progress instead of a checklist.
import { useEffect, useRef } from "react";
import { useScrollUIStore } from "../../store/scrollStore";
import { STEP_LABELS } from "../../lib/customWearSteps";

interface StepTrailProps {
  currentStep: number;
  totalSteps?: number;
}

const StepTrail = ({ currentStep, totalSteps = 8 }: StepTrailProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const setStepTrailStuck = useScrollUIStore((s) => s.setStepTrailStuck);

  // Detect when this bar has locked to the top of the viewport (sticky
  // engaged) via a sentinel placed immediately before it — a standard
  // IntersectionObserver trick, since CSS alone can't expose sticky state.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setStepTrailStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      setStepTrailStuck(false);
    };
  }, [setStepTrailStuck]);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <div ref={sentinelRef} className="h-px" />
      <div className="sticky top-0 z-30 bg-[#fefaf5]/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 pt-2.5 pb-1.5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
            Step {currentStep} of {totalSteps}
            {STEP_LABELS[currentStep - 1] && (
              <span className="normal-case tracking-normal text-gray-400">
                {" "}
                · {STEP_LABELS[currentStep - 1]}
              </span>
            )}
          </p>
        </div>
        <div className="h-0.75 w-full bg-black/10">
          <div
            className="h-full bg-black transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default StepTrail;
