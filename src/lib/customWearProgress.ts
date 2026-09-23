// Saved progress through the Personal Fit flow, so a reload (or a trip out to
// the payment gateway) resumes where the customer left off.
//
// It lives here rather than in the page because the payment return page has to
// clear it once a payment is confirmed, and must NOT clear it before then: a
// cancelled payment has to leave every answer intact.
import type { OrderData } from "../pages/custom-wear";

const KEY = "customWearProgress";
const TTL_MS = 24 * 60 * 60 * 1000;

export interface StoredProgress {
  step: number;
  orderData: OrderData;
  savedAt: number;
}

export const loadStoredProgress = (): StoredProgress | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveProgress = (step: number, orderData: OrderData): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ step, orderData, savedAt: Date.now() }));
  } catch {
    /* storage unavailable, progress simply will not resume */
  }
};

export const clearStoredProgress = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable, ignore */
  }
};
