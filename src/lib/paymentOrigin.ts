// Remembers where a payment was started from, so a customer who cancels at the
// gateway lands back where they were instead of somewhere guessed.
//
// The cart cannot be used to infer this: it loads asynchronously, so it reads
// empty for a moment on every fresh page load after the redirect.
const KEY = "paymentOrigin";

/** Called just before handing off to the gateway. */
export const rememberPaymentOrigin = (path: string): void => {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    /* storage unavailable, fall back to the default on return */
  }
};

/** Reads and clears the stored origin. Defaults to the cart. */
export const takePaymentOrigin = (fallback = "/cart"): string => {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return path && path.startsWith("/") ? path : fallback;
  } catch {
    return fallback;
  }
};

export const forgetPaymentOrigin = (): void => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clean up */
  }
};
