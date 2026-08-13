import { create } from "zustand";

// Cross-component signal for scroll-driven layout behavior. Currently used by
// the Custom Wear step trail (StepTrail.tsx) to tell Nav.tsx when the trail
// has locked to the top of the viewport, so Nav can get out of its way on
// mobile instead of stacking two fixed bars.
interface ScrollUIStore {
  isStepTrailStuck: boolean;
  setStepTrailStuck: (stuck: boolean) => void;
}

export const useScrollUIStore = create<ScrollUIStore>((set) => ({
  isStepTrailStuck: false,
  setStepTrailStuck: (stuck) => set({ isStepTrailStuck: stuck }),
}));
