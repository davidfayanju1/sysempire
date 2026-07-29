// types/api-cart.ts
// Shape returned by the backend /cart endpoints.
export interface ApiCartItemProductRef {
  id: string;
  name: string;
  slug: string;
  status: string;
  isBespoke: boolean;
}

export interface ApiCartItem {
  id: string;
  product: ApiCartItemProductRef;
  variantId: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currency: string;
  image: string;
  inStock: boolean;
  maxQuantity: number;
}

export interface ApiCartSummary {
  itemCount: number;
  lineCount: number;
  subtotal: number;
  currency: string;
}

export interface ApiCart {
  id: string;
  sessionId: string;
  items: ApiCartItem[];
  summary: ApiCartSummary;
}

// Matches the AddressPayload shape already used by /orders (services/index.ts)
export interface CheckoutAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface CheckoutPayload {
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  shippingFee: number;
  tax: number;
  discount: number;
  shippingMethod: string;
  paymentMethod: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  clearCart: boolean;
}

export interface ApiOrderItem {
  _id: string;
  slug: string;
  name: string;
  image?: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isBespoke: boolean;
  measurements?: Record<string, string>;
}

export interface ApiOrderStatusEntry {
  status: string;
  label: string;
  note: string;
  timestamp: string;
}

export interface OrderAddress extends CheckoutAddress {
  fullName: string;
  phone: string;
}

export interface ApiOrder {
  _id: string;
  orderNumber: string;
  customer?: string;
  items: ApiOrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  statusHistory: ApiOrderStatusEntry[];
  createdAt: string;
  updatedAt: string;
  idempotencyKey?: string;
  paymentLink?: string;
  paymentReturnUrl?: string;
  txRef?: string;
}

// ── Order Tracking ──────────────────────────────────────────────────────────

export interface OrderTrackingTimelineStep {
  status: string;
  label: string;
  description: string;
  note?: string;
  completedAt?: string;
  completed: boolean;
  current: boolean;
  upcoming: boolean;
}

export interface OrderTrackingProgress {
  currentStep: number;
  totalSteps: number;
  percent: number;
}

export interface OrderTracking {
  orderNumber: string;
  status: string;
  statusLabel: string;
  statusDescription: string;
  isTerminal: boolean;
  isCancelled: boolean;
  paymentStatus: string;
  shippingMethod: string;
  placedAt: string;
  estimatedDelivery: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress?: OrderAddress;
  items: ApiOrderItem[];
  totals: {
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  timeline: OrderTrackingTimelineStep[];
  progress: OrderTrackingProgress;
}
