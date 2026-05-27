import { ArrowRight, Heart, MapPin, Phone, Calendar } from "lucide-react";
import { useState } from "react";

const Consultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consultationType: "virtual",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24">
        {/* Header - Vogue editorial style */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="w-16 h-px bg-black/15 mx-auto mb-8" />
          <p className="text-3xl md:text-5xl font-light text-black leading-[1.3] md:leading-[1.4] tracking-tight">
            Personal <span className="font-bold">Style Consultation</span>
          </p>
          <p className="text-2xl md:text-4xl font-light text-black/70 mt-4">
            crafting your <span className="font-bold">signature look</span>
          </p>
          <div className="w-16 h-px bg-black/15 mx-auto mt-8" />
        </div>

        {/* Two Column Layout with Image */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 max-w-[1070px] mx-auto">
          {/* Left Column - Hero Image with Overlay Text */}
          <div className="relative h-[500px] lg:h-auto lg:min-h-[600px] overflow-hidden group">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Luxury style consultation"
                className="w-full h-full object-cover object-center"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
              {/* Top Tag */}
              <div className="self-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20">
                  <Heart className="w-3 h-3 text-white" />
                  <span className="text-[8px] tracking-[0.2em] uppercase text-white font-['Times_New_Roman',serif]">
                    By Appointment Only
                  </span>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="space-y-6">
                {/* Quote */}
                <blockquote className="text-white/90 text-sm md:text-base italic leading-relaxed max-w-sm font-['Times_New_Roman',serif]">
                  "Style is a way to say who you are without having to speak"
                </blockquote>

                {/* Service Features */}
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

                {/* Decorative Line */}
                <div className="w-12 h-px bg-white/40" />

                <p className="text-white/60 text-[10px] tracking-[0.15em] uppercase">
                  Since 2014
                </p>
              </div>
            </div>

            {/* Diagonal Accent Line */}
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-32 bg-white/10 rotate-12 hidden lg:block" />
          </div>

          {/* Right Column - Form */}
          <div className="bg-transparent lg:pl-12 flex flex-col justify-center">
            {/* Intro Text */}
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
              <p className="text-sm leading-[22px] text-black/60">
                Each consultation is tailored to your unique style preferences,
                body type, and lifestyle needs. Experience the luxury of
                personalized attention.
              </p>
            </div>

            {/* Consultation Options Quick Info */}
            {/* <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border-l-2 border-black/20 pl-3">
                <h3 className="text-xs font-medium text-black mb-1">Virtual</h3>
                <p className="text-[10px] text-black/50 leading-relaxed">
                  45-min video session
                </p>
              </div>
              <div className="border-l-2 border-black/20 pl-3">
                <h3 className="text-xs font-medium text-black mb-1">
                  In-Store
                </h3>
                <p className="text-[10px] text-black/50 leading-relaxed">
                  Private styling + champagne
                </p>
              </div>
            </div> */}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Consultation Type *
                  </label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="consultationType"
                        value="virtual"
                        checked={formData.consultationType === "virtual"}
                        onChange={handleChange}
                        className="w-3 h-3 accent-black"
                      />
                      <span className="text-xs text-black/60">Virtual</span>
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
                      <span className="text-xs text-black/60">In-Store</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-black/20 focus:border-black/60 outline-none transition-colors bg-transparent text-sm text-black placeholder:text-black/30 resize-none"
                  placeholder="Tell us about your style preferences or occasion..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-black/80 transition-colors disabled:bg-black/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
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

              {/* Success Message */}
              {isSubmitted && (
                <div className="mt-4 p-4 bg-black/5 border border-black/20 text-center">
                  <p className="text-xs text-black/70">
                    Thank you for your request. Our concierge will reach out
                    within 24 hours.
                  </p>
                </div>
              )}
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
