import api from "../lib/axios";

// ── Services ──────────────────────────────────────────────────────────────────

export interface Service {
  _id: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  startingPrice: number;
  currency: string;
  features: string[];
  slug: string;
  isActive: boolean;
  order: number;
}

export const getServices = () =>
  api.get("/services").then((res) => res.data);

// ── Contact ──────────────────────────────────────────────────────────────────

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export const submitContact = (data: ContactPayload) =>
  api.post("/contact", data).then((res) => res.data);

// ── Inquiries ─────────────────────────────────────────────────────────────────

export type InquiryType = "archive-piece" | "bespoke-order" | "custom-design";
export type BudgetRange = "under-500" | "500-1000" | "1000-5000" | "5000-plus";
export type PreferredContact = "email" | "phone" | "whatsapp";

export interface InquiryPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  inquiryType: InquiryType;
  collection: string;
  product: string;
  eventDate?: string;
  budgetRange: BudgetRange;
  preferredContact: PreferredContact;
  message: string;
}

export const submitInquiry = (data: InquiryPayload) =>
  api.post("/inquiries", data).then((res) => res.data);

// ── Appointments ──────────────────────────────────────────────────────────────

export type AppointmentType =
  | "bespoke-consultation"
  | "styling-session"
  | "fitting"
  | "wardrobe-consultation";

export interface AppointmentPayload {
  name: string;
  email: string;
  phone: string;
  appointmentType: AppointmentType;
  service: string;
  scheduledAt: string;
  durationMinutes: number;
  isVirtual: boolean;
  notes: string;
}

export const submitAppointment = (data: AppointmentPayload) =>
  api.post("/appointments", data).then((res) => res.data);

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: "client";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authRegister = (data: RegisterPayload) =>
  api.post("/auth/register", data).then((res) => res.data);

export const authLogin = (data: LoginPayload) =>
  api.post("/auth/login", data).then((res) => res.data);

export const authLogout = () =>
  api.post("/auth/logout").then((res) => res.data);

export const getMe = () =>
  api.get("/auth/me").then((res) => res.data);

export const updateMe = (data: UpdateProfilePayload) =>
  api.patch("/auth/me", data).then((res) => res.data);

export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append("avatar", file);
  return api
    .post("/auth/me/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const updatePassword = (data: UpdatePasswordPayload) =>
  api.patch("/auth/update-password", data).then((res) => res.data);

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email }).then((res) => res.data);

export const resetPassword = (token: string, password: string) =>
  api.post("/auth/reset-password", { token, password }).then((res) => res.data);

export const verifyEmail = (token: string) =>
  api.post("/auth/verify-email", { token }).then((res) => res.data);

export const resendVerification = () =>
  api.post("/auth/resend-verification").then((res) => res.data);

// ── Media ─────────────────────────────────────────────────────────────────────

export const uploadMedia = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api
    .post("/media", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface OrderItemPayload {
  product: string;
  quantity: number;
  size: string;
  color: string;
  measurements?: Record<string, string>;
}

export interface AddressPayload {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  shippingAddress: AddressPayload;
  billingAddress?: AddressPayload;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  shippingMethod?: "standard" | "express";
  paymentMethod: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
}

export const createOrder = (data: CreateOrderPayload) =>
  api.post("/orders", data).then((res) => res.data);

// ── Payments ──────────────────────────────────────────────────────────────────

export const initiateFlutterwavePayment = (orderId: string) =>
  api
    .post(
      "/payments/flutterwave/initiate",
      { orderId },
      { headers: { "Idempotency-Key": crypto.randomUUID() } },
    )
    .then((res) => res.data);
