import { Link } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import { email, address, phoneNumber } from "./contact-us";

const EFFECTIVE_DATE = "1 January 2025";
const LAST_UPDATED = "June 2026";

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "",
        body: "By accessing or using the SYS EMPIRE platform, including our website, mobile experience, and custom-wear booking flow, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use our services. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance.",
      },
    ],
  },
  {
    number: "02",
    title: "Who We Are",
    content: [
      {
        subtitle: "",
        body: "SYS EMPIRE is a luxury bespoke fashion house headquartered in Lagos, Nigeria, specialising in made-to-measure garments including native wear, suits, corporate attire, dresses, and wedding wear. Our studio is located in Ajah, Lagos. All services described on this platform are provided by SYS EMPIRE or its authorised tailoring partners.",
      },
    ],
  },
  {
    number: "03",
    title: "Custom & Bespoke Orders",
    content: [
      {
        subtitle: "The Order Process",
        body: "Custom orders are initiated through our Personal Fit flow, which collects your measurements, style preferences, fabric choices, and delivery details. An order is confirmed only after you complete payment (deposit or full) and receive a written confirmation from us.",
      },
      {
        subtitle: "Pricing & Estimates",
        body: "All prices displayed during the booking flow are estimates based on typical complexity for the selected outfit type. The final price is confirmed during a stylist consultation after your order is placed. Your deposit secures your production slot and will be applied to the final balance. We will not proceed with production without your approval of the confirmed price.",
      },
      {
        subtitle: "Payment",
        body: "We accept payment via Flutterwave. For bespoke orders, a 70% deposit is required at the time of booking; the remaining 30% is due before delivery. For full payment orders, the entire amount is charged at checkout. All prices are in Nigerian Naira (NGN) unless otherwise stated.",
      },
      {
        subtitle: "Cancellations & Refunds",
        body: "Once production has commenced (typically within 5 business days of order confirmation), your deposit is non-refundable, as materials will have been sourced and cutting may have begun. If you cancel before production starts, we will refund your deposit less a 10% administrative fee. Ready-to-wear items may be returned within 7 days in unworn, unaltered condition with original tags attached.",
      },
      {
        subtitle: "Delivery & Timelines",
        body: "Standard bespoke production takes 4–8 weeks depending on the garment. Express orders may be available for an additional fee. Delivery timelines are estimates and may be affected by fabric sourcing, complexity, or unforeseen circumstances. SYS EMPIRE is not liable for delays caused by third-party logistics providers.",
      },
    ],
  },
  {
    number: "04",
    title: "Measurements & Fitting",
    content: [
      {
        subtitle: "Your Responsibility",
        body: "You are responsible for providing accurate measurements. SYS EMPIRE relies on the measurements and preferences you submit to craft your garment. Inaccurate measurements may affect fit, and alterations due to customer error may incur additional charges.",
      },
      {
        subtitle: "Fitting Sessions",
        body: "For applicable garments, we may schedule one or more fitting sessions at our Lagos studio. If you are unable to attend in person, remote fitting via video call may be arranged at our discretion.",
      },
    ],
  },
  {
    number: "05",
    title: "User Accounts",
    content: [
      {
        subtitle: "Registration",
        body: "You may place an order as a guest or by creating an account. If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Please notify us immediately of any suspected unauthorised access.",
      },
      {
        subtitle: "Account Eligibility",
        body: "You must be at least 18 years of age to create an account or place an order. By registering, you represent that you meet this requirement.",
      },
    ],
  },
  {
    number: "06",
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Our Content",
        body: "All content on this platform, including design concepts, photography, graphics, copy, and the SYS EMPIRE brand name and logo, is the exclusive property of SYS EMPIRE or its licensors and is protected by Nigerian and international copyright law. You may not reproduce, distribute, or create derivative works without our prior written consent.",
      },
      {
        subtitle: "Your Uploads",
        body: "When you upload inspiration images or design references to our platform, you grant SYS EMPIRE a limited, non-exclusive licence to use those materials solely to produce your garment. We will not use your uploaded images for marketing without your explicit written consent.",
      },
    ],
  },
  {
    number: "07",
    title: "Prohibited Conduct",
    content: [
      {
        subtitle: "You agree not to:",
        body: "Use the platform for any unlawful purpose or in violation of applicable Nigerian law; impersonate any person or entity; submit false measurements or fraudulent payment information; attempt to reverse-engineer, scrape, or circumvent any security measure; use automated tools or bots to interact with the platform; or engage in any conduct that damages the reputation or operations of SYS EMPIRE.",
      },
    ],
  },
  {
    number: "08",
    title: "Limitation of Liability",
    content: [
      {
        subtitle: "",
        body: "To the maximum extent permitted by Nigerian law, SYS EMPIRE and its directors, employees, and tailoring partners shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or our services — including loss of data, loss of profits, or reputational damage. Our total liability for any claim arising out of a specific order shall not exceed the amount you paid for that order.",
      },
      {
        subtitle: "Disclaimer",
        body: "Our platform is provided 'as is'. While we strive for accuracy, we do not warrant that the platform will be uninterrupted, error-free, or that defects will be corrected. Style inspiration images shown are for reference only; actual garments may vary based on fabric availability and design adjustments agreed during consultation.",
      },
    ],
  },
  {
    number: "09",
    title: "Dispute Resolution",
    content: [
      {
        subtitle: "First Contact",
        body: "If you are dissatisfied with your order or any aspect of our service, please contact us at sysempire@gmail.com within 14 days of receiving your order. We are committed to resolving disputes amicably and will respond within 5 business days.",
      },
      {
        subtitle: "Governing Law",
        body: "These Terms of Use are governed by the laws of the Federal Republic of Nigeria. Any dispute not resolved amicably shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.",
      },
    ],
  },
  {
    number: "10",
    title: "Third-Party Links & Services",
    content: [
      {
        subtitle: "",
        body: "Our platform may contain links to third-party websites (e.g., Flutterwave for payment). These are provided for convenience only. SYS EMPIRE is not responsible for the content, privacy practices, or terms of any third-party service. Visiting those sites is at your own risk.",
      },
    ],
  },
  {
    number: "11",
    title: "Changes to These Terms",
    content: [
      {
        subtitle: "",
        body: "We may modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the platform at least 7 days before taking effect. If you do not agree to the revised terms, you should stop using the platform before the changes take effect.",
      },
    ],
  },
];

const TermsOfUse = () => {
  return (
    <DefaultLayout>
      {/* Hero */}
      <section className="relative pt-40 h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1763739528420-bdc297ff4ec7?q=80&w=987&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-6">
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 font-['Times_New_Roman',serif]">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">
            Terms of{" "}
            <span className="font-['Times_New_Roman',serif] font-bold italic">
              Use
            </span>
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto my-6" />
          <p className="text-white/60 text-sm font-light tracking-wider">
            Effective {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-[#EBE9E4]/40 border-b border-black/5">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 py-12">
          <p className="text-black/70 text-sm font-light leading-[1.85] text-center max-w-2xl mx-auto">
            These Terms of Use govern your relationship with{" "}
            <span className="font-medium text-black">SYS EMPIRE</span>. Please
            read them carefully before using our platform or placing an order.
            They are written to be clear and fair, protecting both you as a
            client and our team of artisans.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={section.number} className="flex gap-8 md:gap-12">
                {/* Number */}
                <div className="hidden md:block shrink-0 w-12">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-amber-600 font-['Times_New_Roman',serif]">
                    {section.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-black tracking-[0.15em] uppercase mb-6">
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        {item.subtitle && (
                          <h3 className="text-[11px] tracking-[0.12em] uppercase text-black/50 mb-2">
                            {item.subtitle}
                          </h3>
                        )}
                        <p className="text-black/75 text-sm font-light leading-[1.85]">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="w-full h-px bg-black/8" />

            {/* Contact */}
            <div className="flex gap-8 md:gap-12">
              <div className="hidden md:block shrink-0 w-12">
                <span className="text-[10px] tracking-[0.2em] uppercase text-amber-600 font-['Times_New_Roman',serif]">
                  12
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-black tracking-[0.15em] uppercase mb-6">
                  Contact Us
                </h2>
                <p className="text-black/75 text-sm font-light leading-[1.85] mb-6">
                  For any questions about these Terms, your order, or to
                  exercise your rights, please reach out to us directly:
                </p>
                <div className="border border-black/10 p-6 space-y-3">
                  <p className="text-xs tracking-[0.1em] uppercase text-black/40">
                    SYS EMPIRE — Client Relations
                  </p>
                  <p className="text-sm font-light text-black/80">{address}</p>
                  <a
                    href={`mailto:${email}`}
                    className="block text-sm font-light text-black hover:text-black/60 transition-colors"
                  >
                    {email}
                  </a>
                  <p className="text-sm font-light text-black/80">
                    {phoneNumber}
                  </p>
                </div>
                <p className="text-xs text-black/40 font-light mt-4">
                  Also see our{" "}
                  <Link
                    to="/privacy"
                    className="text-black/60 hover:text-black underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <section className="bg-black py-8">
        <div className="max-w-[860px] mx-auto px-6 text-center">
          <p className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-['Times_New_Roman',serif] italic">
            Where fashion meets artistry - SYS EMPIRE, Lagos
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default TermsOfUse;
