import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import KiddiesSlider from "../kids/KiddiesSlider";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1656741785524-1012253553b7?q=80&w=1600&auto=format&fit=crop",
    caption: "Tiny Trendsetters",
  },
  {
    image:
      "https://images.unsplash.com/photo-1597098327458-21edd96dc3ab?q=80&w=1600&auto=format&fit=crop",
    caption: "Sunshine & Silhouettes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1600&auto=format&fit=crop",
    caption: "Little Royals, Big Style",
  },
  {
    image:
      "https://images.unsplash.com/photo-1714124731489-7eb16af0ac91?q=80&w=1600&auto=format&fit=crop",
    caption: "Crafted With Love",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519238359922-989348752efb?q=80&w=1600&auto=format&fit=crop",
    caption: "Playful. Polished.",
  },
];

const LittleRoyals = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf1f4] via-[#fbe6ec] to-[#fdf1f4]">
      {/* Soft decorative accents */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-[#f4c2ce]/30 blur-3xl" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Intro */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-20">
          {/* Logo, shown in full on its native pink */}
          <motion.div
            className="flex justify-center md:justify-start"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/images/sys_children_logo.JPG"
              alt="Little Royals by SYS Empire"
              className="w-64 sm:w-80 md:w-full max-w-sm h-auto object-contain drop-shadow-[0_18px_35px_rgba(214,120,142,0.25)]"
            />
          </motion.div>

          {/* Copy */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-white/60 mb-6">
              <Heart className="w-3 h-3 text-[#c96b82]" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-black/50 font-['Times_New_Roman',serif]">
                A New Chapter
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-light tracking-tight text-black leading-[1.05] mb-6">
              Introducing{" "}
              <span className="italic font-['Times_New_Roman',serif] text-[#c96b82]">
                Little Royals
              </span>
            </h2>

            <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              The SYS Empire promise of craftsmanship and elegance, now
              tailored for the smallest members of the family. Little Royals
              brings playful silhouettes, soft fabrics, and the same
              unmistakable attention to detail to children's wear.
            </p>

            <Link
              to="/little-royals"
              className="inline-flex items-center gap-2 py-3 px-6 bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-[#c96b82] transition-colors duration-300"
            >
              Discover Little Royals
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Slider header */}
        <div className="max-w-[1100px] mx-auto text-center mb-10">
          <div className="w-12 h-px bg-[#c96b82]/30 mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-light text-black tracking-wide">
            Kiddies, In Frame
          </h3>
          <div className="w-12 h-px bg-[#c96b82]/30 mx-auto mt-6" />
        </div>

        <KiddiesSlider slides={SLIDES} className="max-w-[1100px] mx-auto" />
      </div>
    </section>
  );
};

export default LittleRoyals;
