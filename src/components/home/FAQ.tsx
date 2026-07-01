import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place a custom order?",
      answer:
        "Simply visit our 'Made For You' page and follow the step-by-step process. You'll select your gender, style preference, provide your measurements, and our team will reach out within 24 hours to confirm your order and discuss fabric options.",
    },
    {
      question: "How long does it take to complete a custom piece?",
      answer:
        "Typically, custom orders take 2-4 weeks from measurement confirmation to delivery. This includes pattern making, cutting, sewing, and quality control. Rush orders may be available for an additional fee, please contact our team for details.",
    },
    {
      question: "How do I provide my measurements?",
      answer:
        "You have three options: use our AI-powered camera measurement tool (recommended), upload a full-body photo for analysis, or enter your measurements manually following our guide. All measurements are kept confidential and used only for your garment.",
    },
    {
      question: "What if the fit isn't perfect?",
      answer:
        "Your satisfaction is our priority. We offer one free fitting adjustment within 14 days of receiving your garment. Our team will work with you to ensure the perfect fit, whether that means alterations or a remake in extreme cases.",
    },
    {
      question: "What fabrics do you use?",
      answer:
        "We source premium fabrics from around the world – Italian wool, Egyptian cotton, French lace, and locally sourced African textiles. Our collection includes options for every season and occasion, from everyday wear to wedding ensembles.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide. Shipping times and costs vary by location. All international orders include tracking and insurance. Customs duties may apply depending on your country's regulations.",
    },
    {
      question: "Can I request a specific design or sketch?",
      answer:
        "Absolutely. If you have a style in mind, our designers will work with you to bring your vision to life. You can share reference images, sketches, or mood boards, and we'll create a custom design just for you.",
    },
    {
      question: "What is your return policy for custom orders?",
      answer:
        "Because each piece is made specifically for you, custom orders are final sale. However, we stand behind our craftsmanship – if there's a manufacturing defect, we'll remake the piece at no cost. Fit adjustments are handled as described above.",
    },
  ];

  return (
    <section id="faq" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-serif">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-black mt-4 mb-4">
            We Have Answers
          </h2>
          <div className="w-12 h-px bg-black/20 mx-auto" />
        </div>

        {/* FAQ Items */}
        <div className="divide-y divide-black/5">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className="text-base md:text-lg font-light text-black tracking-tight pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-black/40 group-hover:text-black/70 transition-colors" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 pt-2">
                      <p className="text-sm text-gray-500 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 pt-8 text-center border-t border-black/5">
          <p className="text-sm text-gray-500 font-light mb-4">
            Still have questions?
          </p>
          <Link
            to="mailto:fayanjufemi@gmail.com"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors border border-black/20 px-6 py-3 hover:border-black/40"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
