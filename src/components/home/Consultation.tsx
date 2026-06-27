import { ArrowRight, Heart, MapPin, Phone, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitAppointment,
  getServices,
  type AppointmentPayload,
  type AppointmentType,
  type Service,
} from "../../services";

interface ConsultationProps {
  className?: string;
}

const APPOINTMENT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: "bespoke-consultation", label: "Bespoke Consultation" },
  { value: "styling-session", label: "Styling Session" },
  { value: "fitting", label: "Fitting" },
  { value: "wardrobe-consultation", label: "Wardrobe Consultation" },
];

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  appointmentType: "bespoke-consultation" as AppointmentType,
  service: "",
  scheduledAt: "",
  durationMinutes: 60,
  consultationType: "virtual" as "virtual" | "in-store",
  notes: "",
};

const Consultation = ({ className = "bg-gray-100" }: ConsultationProps) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data: servicesRes, isLoading: loadingServices } = useQuery<{
    data: Service[];
  }>({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 10 * 60 * 1000,
  });
  const services: Service[] = servicesRes?.data ?? [];

  const { mutate, isPending } = useMutation({
    mutationFn: (data: typeof formData) => {
      const payload: AppointmentPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        appointmentType: data.appointmentType,
        service: data.service,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        durationMinutes: data.durationMinutes,
        isVirtual: data.consultationType === "virtual",
        notes: data.notes,
      };
      return submitAppointment(payload);
    },
    onSuccess: () => {
      toast.success(
        "Consultation request received! Our team will confirm within 24 hours.",
      );
      setFormData(EMPTY_FORM);
    },
    onError: () => {
      toast.error("Failed to submit request. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  // Build the min datetime string (now) for the date picker
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <section className={`overflow-hidden ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="w-16 h-px bg-black/15 mx-auto mb-8" />
          <p className="text-3xl md:text-5xl font-light text-black leading-[1.3] md:leading-[1.4] tracking-tight">
            Personal <span className="font-bold">Style Consultation</span>
          </p>
          <div className="w-16 h-px bg-black/15 mx-auto mt-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 max-w-[1070px] mx-auto">
          {/* Left Column - Hero Image */}
          <div className="relative h-[500px] lg:h-auto lg:min-h-[600px] overflow-hidden group">
            <div className="absolute inset-0">
              <img
                src="/images/female-clothing/blue.png"
                alt="Luxury style consultation"
                className="w-full h-full scale-120 object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />
            </div>

            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
              <div className="self-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20">
                  <Heart className="w-3 h-3 text-white" />
                  <span className="text-[8px] tracking-[0.2em] uppercase text-white font-['Times_New_Roman',serif]">
                    By Appointment Only
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <blockquote className="text-white/90 text-sm md:text-base italic leading-relaxed max-w-sm font-['Times_New_Roman',serif]">
                  "Style is a way to say who you are without having to speak"
                </blockquote>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs tracking-wide">
                      Flexible scheduling
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs tracking-wide">
                      24/7 concierge support
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs tracking-wide">
                      Lagos, Nigeria
                    </span>
                  </div>
                </div>

                <div className="w-12 h-px bg-white/40" />
                <p className="text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  Since 2022
                </p>
              </div>
            </div>

            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-32 bg-white/10 rotate-12 hidden lg:block" />
          </div>

          {/* Right Column - Form */}
          <div className="bg-transparent lg:pl-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
                <Heart className="w-3 h-3 text-black/40" />
                <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                  Begin Your Journey
                </span>
              </div>
              <p className="text-sm leading-[22px] text-black/60 mb-4">
                Elevate your wardrobe with a one-on-one consultation with our
                expert stylists. Whether you're seeking the perfect fit for a
                special occasion or a complete wardrobe refresh, we're here to
                bring your vision to life.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone & Appointment Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Appointment Type *
                  </label>
                  <div className="relative">
                    <select
                      name="appointmentType"
                      required
                      value={formData.appointmentType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-9 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black appearance-none cursor-pointer"
                    >
                      {APPOINTMENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                  Service *
                </label>
                <div className="relative">
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    disabled={loadingServices}
                    className="w-full px-4 py-2.5 pr-9 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {loadingServices ? "Loading services..." : "Select a service"}
                    </option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Preferred Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    required
                    min={minDateTime}
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Duration *
                  </label>
                  <div className="relative">
                    <select
                      name="durationMinutes"
                      required
                      value={formData.durationMinutes}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-9 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black appearance-none cursor-pointer"
                    >
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40" />
                  </div>
                </div>
              </div>

              {/* Virtual / In-store */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                  Consultation Format *
                </label>
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="consultationType"
                      value="virtual"
                      checked={formData.consultationType === "virtual"}
                      onChange={handleChange}
                      className="w-3 h-3 accent-black"
                    />
                    <span className="text-xs text-black/60">
                      Virtual (Online)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="consultationType"
                      value="in-store"
                      checked={formData.consultationType === "in-store"}
                      onChange={handleChange}
                      className="w-3 h-3 accent-black"
                    />
                    <span className="text-xs text-black/60">In-Studio</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30 resize-none"
                  placeholder="Style preferences, occasion details, or anything else we should know..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-6 bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-black/80 transition-colors disabled:bg-black/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Consultation
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[9px] text-black/30 text-center mt-6 tracking-wide">
              By submitting this form, you agree to our privacy policy and
              consent to being contacted regarding your consultation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
