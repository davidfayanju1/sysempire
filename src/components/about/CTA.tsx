// components/about/CTASection.tsx
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Heart, ArrowRight } from "lucide-react";

const contactInfo = {
  email: "hello@velvetnoir.com",
  phone: "+44 (0) 20 1234 5678",
  studio: "Studio by appointment only",
};

const floatVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-white"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={floatVariants}
            className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6"
          >
            <Heart className="w-3 h-3 text-black/40 animate-pulse" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
              Let's Connect
            </span>
          </motion.div>
          <motion.h2
            variants={floatVariants}
            className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight"
          >
            Become Part of
            <span className="font-['Times_New_Roman',serif] font-bold italic block">
              Our Story
            </span>
          </motion.h2>
          <motion.div
            variants={floatVariants}
            className="w-12 h-px bg-black/15 mx-auto my-6"
          />
          <motion.p
            variants={floatVariants}
            className="text-black/60 text-sm max-w-lg mx-auto mb-12"
          >
            Whether you're looking for a custom piece, want to collaborate, or
            simply share your thoughts — we'd love to hear from you.
          </motion.p>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-12"
            variants={staggerVariants}
          >
            <motion.div className="space-y-2" variants={cardVariants}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">
                Email
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-black/80 hover:text-black transition-colors text-sm"
              >
                {contactInfo.email}
              </a>
            </motion.div>
            <motion.div className="space-y-2" variants={cardVariants}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">
                Phone
              </p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-black/80 hover:text-black transition-colors text-sm"
              >
                {contactInfo.phone}
              </a>
            </motion.div>
            <motion.div className="space-y-2" variants={cardVariants}>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">
                Studio
              </p>
              <p className="text-black/80 text-sm">{contactInfo.studio}</p>
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-black/90 transition-all group text-sm tracking-[0.1em] uppercase"
            >
              Get in Touch
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
