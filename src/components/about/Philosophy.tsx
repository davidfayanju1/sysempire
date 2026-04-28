// components/about/PhilosophySection.tsx
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

const floatVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const PhilosophySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="bg-white py-20"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={floatVariants}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={floatVariants}
            className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6"
          >
            <Heart className="w-3 h-3 text-black/40" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
              Our Philosophy
            </span>
          </motion.div>
          <motion.h2
            variants={floatVariants}
            className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight"
          >
            Where{" "}
            <span className="font-['Times_New_Roman',serif] font-bold italic">
              passion
            </span>{" "}
            meets purpose
          </motion.h2>
          <motion.div
            variants={floatVariants}
            className="w-12 h-px bg-black/15 mx-auto my-6"
          />
          <motion.p
            variants={floatVariants}
            className="text-black/60 text-sm leading-relaxed"
          >
            We believe fashion is a powerful form of expression — one that tells
            stories, preserves culture, and creates impact. Every stitch carries
            meaning, every design honors tradition while embracing innovation.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};
