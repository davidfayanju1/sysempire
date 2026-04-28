// components/about/VideoStorySection.tsx
import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

const floatVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const VideoStorySection = () => {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-[#1e2952]"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              variants={floatVariants}
              className="inline-flex items-center gap-2 px-3 py-1 border border-white/20"
            >
              <Sparkles className="w-3 h-3 text-white/60 animate-pulse" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-white/60 font-['Times_New_Roman',serif]">
                Behind the Seams
              </span>
            </motion.div>
            <motion.h2
              variants={floatVariants}
              className="text-3xl md:text-4xl font-light text-white tracking-tight"
            >
              The Art of
              <br />
              <span className="font-['Times_New_Roman',serif] font-bold italic bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Creation
              </span>
            </motion.h2>
            <motion.div
              variants={floatVariants}
              className="w-12 h-px bg-white/20"
            />
            <motion.p
              variants={floatVariants}
              className="text-white/50 text-sm leading-relaxed"
            >
              Witness the journey from concept to creation. Every garment is a
              labor of love, crafted by skilled artisans who pour their hearts
              into every stitch.
            </motion.p>
            <motion.p
              variants={floatVariants}
              className="text-white/40 text-xs tracking-[0.15em] uppercase"
            >
              Watch our story unfold
            </motion.p>
          </div>
          <motion.div
            className="relative overflow-hidden border border-white/10 bg-black/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
              <video
                ref={videoRef}
                src="/videos/drumming_man.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/70 text-xs tracking-[0.2em] uppercase font-light font-['Times_New_Roman',serif]">
                The Rhythm of Creation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
