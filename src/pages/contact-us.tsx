import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Briefcase } from "lucide-react";

export const phoneNumber = "+234 (0) 816 152 5506";
export const email = "sysempire@gmail.com";
export const address = "123 Fashion Street, Lagos, Nigeria";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    serviceOption: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = [
    "Custom Tailoring",
    "Ready-to-Wear Collection",
    "Bridal Collection",
    "Accessories",
    "Consultation",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        serviceOption: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative pt-[10rem] h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-6">
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 font-['Times_New_Roman',serif]">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 tracking-tight">
            Let's Create{" "}
            <span className="font-['Times_New_Roman',serif] font-bold italic">
              Something Beautiful
            </span>
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto my-6" />
          {/* <p className="text-white/70 text-sm leading-relaxed max-w-lg mx-auto">
            Whether you're looking for a custom piece, have a question about our
            collections, or want to collaborate — we'd love to hear from you.
          </p> */}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold text-black tracking-[0.15em] uppercase mb-6">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-black/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-black/60" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
                        Phone
                      </p>
                      <p className="text-black/80 text-sm font-light">
                        {phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-black/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-black/60" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-black/80 text-sm font-light hover:text-black transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-black/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-black/60" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
                        Studio Address
                      </p>
                      <p className="text-black/80 text-sm font-light leading-relaxed">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio Hours */}
              <div className="pt-6 border-t border-black/10">
                <h3 className="text-xs font-medium text-black mb-3">
                  Studio Hours
                </h3>
                <div className="space-y-1 text-black/60 text-sm font-light">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Brand Quote */}
              <div className="pt-6">
                <p className="text-[9px] tracking-[0.2em] uppercase text-black/30 italic">
                  "Where fashion meets artistry"
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="border border-black/10 p-6 md:p-8 bg-white">
              <h2 className="text-sm font-semibold text-black tracking-[0.15em] uppercase mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-black/10 focus:border-black/30 outline-none transition-colors text-sm text-black placeholder:text-black/30"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-black/10 focus:border-black/30 outline-none transition-colors text-sm text-black placeholder:text-black/30"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-black/10 focus:border-black/30 outline-none transition-colors text-sm text-black placeholder:text-black/30"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Service of Interest
                  </label>
                  <div className="relative">
                    <select
                      name="serviceOption"
                      value={formData.serviceOption}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-black/10 focus:border-black/30 outline-none transition-colors text-sm text-black appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Briefcase className="w-4 h-4 text-black/40" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-black/50 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-black/10 focus:border-black/30 outline-none transition-colors text-sm text-black placeholder:text-black/30 resize-none"
                    placeholder="Tell us about your vision..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black text-white hover:bg-black/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {isSubmitted && (
                  <div className="text-center text-black/60 text-xs py-2 animate-pulse">
                    Thank you! We'll get back to you shortly.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ContactUs;
