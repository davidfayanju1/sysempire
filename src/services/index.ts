import api from "../lib/axios";

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
