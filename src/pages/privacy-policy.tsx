import { Link } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import { email, address, phoneNumber } from "./contact-us";

const EFFECTIVE_DATE = "1 January 2025";
const LAST_UPDATED = "June 2026";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Information You Provide Directly",
        body: "When you create an account, place an order, or contact us, we collect: your full name, email address, phone number, shipping and billing address, body measurements, style preferences, design inspirations you upload, and payment information (processed securely through Flutterwave, we never store your card details).",
      },
      {
        subtitle: "Information Collected Automatically",
        body: "When you visit our platform, we may automatically collect device information, browser type, IP address, pages visited, and time spent on the site. This helps us improve the experience and diagnose technical issues.",
      },
      {
        subtitle: "Information From Third Parties",
        body: "If you connect a social account (e.g., Google) or our payment processor shares transaction metadata, we may receive limited data from those services in accordance with their own privacy policies.",
      },
    ],
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Fulfilling Your Orders",
        body: "Your measurements, design preferences, and contact details are shared with our in-house tailoring team solely to produce and deliver your bespoke garment. Inspiration images you upload are stored securely and used only for your order.",
      },
      {
        subtitle: "Communication",
        body: "We use your email and phone number to send order confirmations, fitting updates, delivery notifications, and, with your consent, occasional news about new collections or exclusive offers. You can opt out of marketing communications at any time.",
      },
      {
        subtitle: "Platform Improvement",
        body: "Aggregated, anonymised usage data helps us understand how clients interact with our platform so we can improve the booking flow, style guides, and measurement tools.",
      },
      {
        subtitle: "Legal Compliance",
        body: "We may process your data where required by Nigerian law, including the Nigeria Data Protection Act (NDPA) 2023, court orders, or regulatory obligations.",
      },
    ],
  },
  {
    number: "03",
    title: "Sharing of Information",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        body: "SYS EMPIRE does not sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
      {
        subtitle: "Service Providers",
        body: "We share data with trusted service providers who help us operate: Flutterwave for payment processing, cloud infrastructure providers for data storage, and logistics partners for delivery. All providers are contractually bound to protect your data.",
      },
      {
        subtitle: "Legal Requirements",
        body: "We may disclose your information if required by law, regulation, legal process, or a governmental request, or where necessary to protect the safety and rights of SYS EMPIRE, its clients, or the public.",
      },
    ],
  },
  {
    number: "04",
    title: "Your Measurements & Design Data",
    content: [
      {
        subtitle: "Sensitive by Nature",
        body: "We understand that your body measurements are personal. They are stored securely and accessed only by the tailors working on your garment. We do not use measurement data for advertising or share it with unrelated parties.",
      },
      {
        subtitle: "Retention",
        body: "We retain your measurements for up to 24 months after your last order to make repeat orders more convenient. You may request deletion at any time by contacting us.",
      },
    ],
  },
  {
    number: "05",
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        body: "We use strictly necessary cookies to keep you logged in and maintain your shopping session. These cannot be disabled without affecting site functionality.",
      },
      {
        subtitle: "Analytics",
        body: "We may use analytics tools to measure page visits and platform performance. This data is aggregated and does not personally identify you.",
      },
      {
        subtitle: "Managing Cookies",
        body: "You can manage or disable cookies through your browser settings. Note that some features may not function correctly without cookies.",
      },
    ],
  },
  {
    number: "06",
    title: "Data Security",
    content: [
      {
        subtitle: "Our Commitments",
        body: "We implement industry-standard security measures including HTTPS encryption, access controls, and regular security reviews. Payments are handled entirely by Flutterwave's PCI-DSS compliant infrastructure, your card details never touch our servers.",
      },
      {
        subtitle: "No Guarantee",
        body: "While we take every reasonable precaution, no transmission over the internet is 100% secure. We encourage you to use strong passwords and to contact us immediately if you suspect unauthorised access to your account.",
      },
    ],
  },
  {
    number: "07",
    title: "Your Rights",
    content: [
      {
        subtitle: "Under the Nigeria Data Protection Act 2023",
        body: "You have the right to: access the personal data we hold about you; correct inaccurate information; request deletion of your data (subject to legal retention requirements); object to or restrict processing; and withdraw consent where processing is based on consent. To exercise any of these rights, contact us at the details below.",
      },
    ],
  },
  {
    number: "08",
    title: "Children's Privacy",
    content: [
      {
        subtitle: "Age Restriction",
        body: "Our platform is intended for users aged 18 and above. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.",
      },
    ],
  },
  {
    number: "09",
    title: "Changes to This Policy",
    content: [
      {
        subtitle: "Updates",
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of material changes via email or a prominent notice on the platform. Your continued use of SYS EMPIRE after changes take effect constitutes acceptance of the updated policy.",
      },
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <DefaultLayout>
      {/* Hero */}
      <section className="relative pt-40 h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop')",
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
            Privacy{" "}
            <span className="font-['Times_New_Roman',serif] font-bold italic">
              Policy
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
            At <span className="font-medium text-black">SYS EMPIRE</span>, your
            privacy is as important to us as the craftsmanship in every stitch.
            This policy explains what personal information we collect, how we
            use it, and the rights you hold over your data, in plain language,
            without the legalese.
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
                        <h3 className="text-[11px] tracking-[0.12em] uppercase text-black/50 mb-2">
                          {item.subtitle}
                        </h3>
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
                  10
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-black tracking-[0.15em] uppercase mb-6">
                  Contact Us
                </h2>
                <p className="text-black/75 text-sm font-light leading-[1.85] mb-6">
                  If you have questions about this Privacy Policy, wish to
                  exercise your data rights, or need to report a concern, please
                  reach us at:
                </p>
                <div className="border border-black/10 p-6 space-y-3">
                  <p className="text-xs tracking-widest uppercase text-black/40">
                    SYS EMPIRE — Data Enquiries
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
                    to="/terms"
                    className="text-black/60 hover:text-black underline underline-offset-2 transition-colors"
                  >
                    Terms of Use
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
            "Where fashion meets artistry" — SYS EMPIRE, Lagos
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PrivacyPolicy;
