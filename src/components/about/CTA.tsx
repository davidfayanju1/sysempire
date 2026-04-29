// components/about/CTASection.tsx
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { address, email, phoneNumber } from "../../data/contact";

const contactInfo = {
  email: email,
  phone: phoneNumber,
  studio: "Studio by appointment only",
  address: address,
};

const floatVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  hover: { y: -5, transition: { duration: 0.2 } },
};

export const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.section
      ref={ref}
      className="relative py-24 bg-white overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Decorative background elements - consistent with site */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-black/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-black/5" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card - No rounded corners */}
          <motion.div
            variants={floatVariants}
            className="relative bg-white p-8 md:p-12"
          >
            {/* Minimalist corner accents - straight lines only */}
            <div className="absolute top-0 left-0 w-12 h-px bg-black/10" />
            <div className="absolute top-0 left-0 w-px h-12 bg-black/10" />
            <div className="absolute bottom-0 right-0 w-12 h-px bg-black/10" />
            <div className="absolute bottom-0 right-0 w-px h-12 bg-black/10" />

            <div className="text-center mb-12">
              <motion.div
                variants={floatVariants}
                className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6"
              >
                <Sparkles className="w-3 h-3 text-black/40" />
                <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                  Let's Connect
                </span>
              </motion.div>

              <motion.h2
                variants={floatVariants}
                className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight"
              >
                Become Part of
                <span className="font-['Times_New_Roman',serif] font-bold italic block mt-2">
                  Our Story
                </span>
              </motion.h2>

              <div className="w-12 h-px bg-black/15 mx-auto my-6" />

              <motion.p
                variants={floatVariants}
                className="text-black/60 text-sm max-w-md mx-auto"
              >
                Whether you're seeking a custom creation, have a collaboration
                in mind, or simply wish to share your vision, we're here to
                bring it to life.
              </motion.p>
            </div>

            {/* Contact Cards - Square corners */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-12"
              variants={staggerVariants}
            >
              <motion.a
                href={`mailto:${contactInfo.email}`}
                className="group block text-center p-6 border border-black/10 hover:border-black/30 transition-all duration-300 bg-white"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex justify-center mb-3">
                  <Mail className="w-5 h-5 text-black/40 group-hover:text-black transition-colors" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Email
                </p>
                <p className="text-xs text-black/60 group-hover:text-black transition-colors break-all">
                  {contactInfo.email}
                </p>
              </motion.a>

              <motion.a
                href={`tel:${contactInfo.phone}`}
                className="group block text-center p-6 border border-black/10 hover:border-black/30 transition-all duration-300 bg-white"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex justify-center mb-3">
                  <Phone className="w-5 h-5 text-black/40 group-hover:text-black transition-colors" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Phone
                </p>
                <p className="text-xs text-black/60 group-hover:text-black transition-colors">
                  {contactInfo.phone}
                </p>
              </motion.a>

              <motion.div
                className="block text-center p-6 border border-black/10 bg-white cursor-default"
                variants={cardVariants}
              >
                <div className="flex justify-center mb-3">
                  <MapPin className="w-5 h-5 text-black/40" />
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
                  Studio
                </p>
                <p className="text-xs text-black/60">{contactInfo.address}</p>
                <p className="text-[10px] text-black/40 mt-1">
                  {contactInfo.studio}
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Button - Square edges */}
            <motion.div variants={floatVariants} className="text-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-300 text-sm tracking-[0.1em] uppercase group"
                >
                  <span>Get in Touch</span>
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div>

              <p className="text-[9px] tracking-[0.2em] uppercase text-black/30 mt-6">
                Bespoke consultations available by appointment
              </p>
            </motion.div>
          </motion.div>

          {/* Brand statement */}
          <motion.div variants={floatVariants} className="text-center mt-12">
            <p className="text-[7px] tracking-[0.3em] uppercase text-black/30 font-['Times_New_Roman',serif]">
              WHERE EVERY STITCH TELLS A STORY
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
