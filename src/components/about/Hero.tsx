// components/about/HeroSection.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <motion.section
      ref={ref}
      className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{ scale, opacity }}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')",
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 mb-6"
        >
          <Sparkles className="w-3 h-3 text-white/80 animate-pulse" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 font-['Times_New_Roman',serif]">
            Est. 2014
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight"
        >
          Crafting the Future
          <br />
          of{" "}
          <span className="font-['Times_New_Roman',serif] font-bold italic bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            African Fashion
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 64 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-16 h-px bg-white/30 mx-auto mb-6"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed"
        >
          A decade of excellence, thousands of stories, and a commitment to
          redefining luxury through authentic African craftsmanship.
        </motion.p>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-12 bg-white/30" />
      </motion.div>
    </motion.section>
  );
};
