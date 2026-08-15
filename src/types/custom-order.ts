// Full wire contract for a Personal Fit (custom wear) order creation request.
//
// This is the complete shape of everything the 8-step flow in pages/custom-wear.tsx
// collects, expressed as a structured POST body rather than the flattened
// `notes` string currently sent in CreateOrderPayload (services/index.ts).
//
// All image fields hold **hosted URLs** returned by `uploadMedia()` (POST /upload) —
// never data URLs or File objects. Local previews created with readAsDataURL are
// swapped for these URLs before the step advances.
//
// Required vs optional below mirrors what the flow can actually guarantee at
// submit time: a field is optional here whenever a valid path through the flow
// can leave it unset (e.g. fabric details only exist on the "have-fabric" branch).

// ── Primitives ────────────────────────────────────────────────────────────────

/** Step 1 — ids from StepOutfitType. */
export type OutfitType =
  | "native-wear"
  | "corporate"
  | "dresses"
  | "suits"
  | "casual"
  | "wedding"
  | "uniforms"
  | "other";

/** Step 3 — which fabric branch the client took. */
export type FabricOption = "have-fabric" | "source-fabric" | "not-sure";

/** Step 5 — how the measurements were obtained. */
export type MeasurementMethod = "camera" | "upload" | "manual";

/** Step 6 / Step 8. */
export type DeliveryPreference = "pickup" | "delivery";
export type ShippingMethod = "standard" | "express";
export type PaymentPlan = "full" | "deposit";

/** Payment gateway the order is charged through. */
export type PaymentGateway = "flutterwave";

export type MeasurementUnit = "cm" | "in";

// ── Shared sub-objects ────────────────────────────────────────────────────────

export interface AddressPayload {
  street: string;
  city: string;
  state: string;
  country: string;
  /** Rarely used in NG — sent as "" when the client leaves it blank. */
  postalCode?: string;
}

/**
 * Step 5 — one measured dimension. `name` is a human label ("Bust",
 * "Shirt / Buba Length"), not a slug, because the field set differs by gender.
 */
export interface MeasurementEntry {
  name: string;
  value: number;
  unit: MeasurementUnit;
  /** Tailor-facing note on where the measurement is taken from. */
  description?: string;
}

/** Step 3, "have-fabric" branch — client is supplying their own fabric. */
export interface FabricDetailsPayload {
  /** Hosted URLs of the client's fabric photos (uploadMedia results). */
  images?: string[];
  /** Free text, e.g. "Aso-oke", "Swiss voile". */
  type?: string;
  /** Free text as entered, e.g. "5 yards". */
  quantity?: string;
  /** Whether SYS EMPIRE collects the fabric or the client drops it off. */
  pickupPreference?: "pickup" | "dropoff";
  /** ISO date (YYYY-MM-DD). Only meaningful when pickupPreference === "pickup". */
  pickupDate?: string;
}

/** Step 3, "source-fabric" branch — SYS EMPIRE buys the fabric. */
export interface FabricPreferencesPayload {
  /** Hex or named colours as picked in the step. */
  colors?: string[];
  colorCount?: "single" | "multiple";
  /** Free text, e.g. "Cotton", "Silk blend". */
  material?: string;
  /** Free text budget as entered by the client. */
  budget?: string;
  quality?: "standard" | "premium";
  /** Free text, e.g. "Wedding", "Corporate event". */
  occasion?: string;
}

/**
 * Step 4 — outfit-specific answers, keyed by field name from StepCustomization.
 * The key set depends on outfitType; `fit` is the only key present for every type.
 * Values are the exact option labels ("Slim", "Double-Breasted", "Premium").
 */
export interface CustomizationsPayload {
  /** All outfit types. */
  fit?: string;

  // native-wear
  neckStyle?: string;
  sleeveType?: string;
  embroidery?: string;
  trouserStyle?: string;
  capStyle?: string;

  // dresses
  neckline?: string;
  length?: string;
  silhouette?: string;

  // corporate
  jacketStyle?: string;
  skirtOrTrousers?: string;
  color?: string;

  // wedding
  role?: string;
  formality?: string;
  colorScheme?: string;

  // suits
  suitFor?: string;
  composition?: string;
  lapelStyle?: string;
  buttons?: string;
  vents?: string;
  pockets?: string;

  /** casual / uniforms / other add no extra fields today; keep the shape open. */
  [key: string]: string | undefined;
}

/**
 * Server-side price breakdown mirror. Sent so the backend can verify the
 * client-side estimate from calculatePrice() rather than trusting totalAmount alone.
 */
export interface PriceBreakdownPayload {
  basePrice: number;
  fabricFee: number;
  embroideryFee: number;
  weddingRoleFee: number;
  weddingFormalityFee: number;
  corporateBothFee: number;
  doubleBreastedFee: number;
  expressFee: number;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

// ── The order item ────────────────────────────────────────────────────────────

/**
 * A bespoke order is always a single item. `product` carries the outfit type
 * rather than a catalogue id, since no catalogue product backs a custom piece.
 */
export interface CustomOrderItemPayload {
  product: OutfitType | string;
  quantity: number;
  /** Always "custom" for Personal Fit orders. */
  size: "custom" | string;
  /** Primary colour: first fabric colour, else customizations.color, else "custom". */
  color: string;
  price: number;
  /** Flattened "Bust" -> "88cm" map, for tailors reading the order record. */
  measurements?: Record<string, string>;
}

// ── The full request body ─────────────────────────────────────────────────────

export interface CreateCustomOrderPayload {
  // ── Commerce core (required by POST /orders) ──
  items: CustomOrderItemPayload[];
  shippingAddress: AddressPayload;
  billingAddress?: AddressPayload;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  /** Amount actually charged now: full total, or 70% when paymentPlan is "deposit". */
  totalAmount: number;
  shippingMethod?: ShippingMethod;
  /** Gateway, not the client's full/deposit choice — that is `paymentPlan`. */
  paymentMethod: PaymentGateway;

  // ── Contact (required for guests; prefilled from the session when signed in) ──
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;

  /** Human-readable summary of everything below, for order emails and the admin view. */
  notes?: string;

  // ── Step 1: Outfit type ──
  outfitType: OutfitType;

  // ── Step 2: Inspiration ──
  /** null when the client never answered; false = "no inspiration to share". */
  hasInspiration?: boolean | null;
  /** Hosted URLs from uploadMedia — present only when hasInspiration is true. */
  inspirationImages?: string[];
  inspirationDescription?: string;

  // ── Step 3: Fabric ──
  fabricOption: FabricOption;
  /** Only on the "have-fabric" branch. */
  fabricDetails?: FabricDetailsPayload;
  /** Only on the "source-fabric" branch. */
  fabricPreferences?: FabricPreferencesPayload;

  // ── Step 4: Customization ──
  customizations: CustomizationsPayload;

  // ── Step 5: Measurements ──
  measurements: MeasurementEntry[];
  measurementMethod: MeasurementMethod;
  /**
   * Hosted URLs of the guided body-scan photos, ordered [front, side].
   * Present on the "upload" path; absent for "manual".
   */
  measurementPhotos?: string[];
  /** Drives which field set was shown; not currently plumbed out of StepMeasurement. */
  measurementGender?: "male" | "female";
  /**
   * True when values came from camera/photo estimation (±2–5cm) rather than a
   * tape. Backend should flag these for tailor verification before cutting.
   */
  measurementsAreEstimates?: boolean;

  // ── Step 6: Delivery ──
  /** ISO date (YYYY-MM-DD) the client needs the piece by. */
  eventDate?: string;
  deliveryPreference?: DeliveryPreference;
  /** Express adds 30% to the subtotal. */
  isExpress?: boolean;

  // ── Step 8: Payment ──
  /** "deposit" charges 70% now, balance on completion. */
  paymentPlan: PaymentPlan;
  /** Full quoted price, independent of what is charged now. */
  estimatedTotal: number;
  /** Amount outstanding after this charge — 0 when paymentPlan is "full". */
  balanceDue: number;
  /** Line-by-line derivation of estimatedTotal, for server-side verification. */
  priceBreakdown?: PriceBreakdownPayload;
}
