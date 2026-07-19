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
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isBespoke: boolean;
}

export interface ApiOrderStatusEntry {
  status: string;
  label: string;
  note: string;
  timestamp: string;
}

export interface ApiOrder {
  _id: string;
  orderNumber: string;
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
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  statusHistory: ApiOrderStatusEntry[];
  createdAt: string;
  updatedAt: string;
}
