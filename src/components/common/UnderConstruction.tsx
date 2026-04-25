import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Scissors,
  Ruler,
  Shirt,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UnderConstructionProps {
  pageName?: string;
  returnPath?: string;
  returnLabel?: string;
}

const UnderConstruction = ({
  pageName = "This Page",
  returnPath = "/",
  returnLabel = "Return Home",
}: UnderConstructionProps) => {
  const floatingIcons = [Scissors, Ruler, Shirt, Sparkles];

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((Icon, idx) => (
          <motion.div
            key={idx}
            className="absolute text-black/5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            style={{
              top: `${15 + idx * 15}%`,
              left: `${5 + idx * 20}%`,
            }}
          >
            <Icon size={40 + idx * 20} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl mx-auto relative z-10"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-8">
          <Clock className="w-3 h-3 text-black/40" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
            Coming Soon
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-light text-black mb-4 tracking-tight">
          {pageName}
          <br />
          <span className="font-['Times_New_Roman',serif] font-bold italic">
            Under Construction
          </span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-px bg-black/15 mx-auto my-6" />

        {/* Description */}
        <p className="text-black/60 text-sm leading-relaxed max-w-md mx-auto mb-8">
          We're diligently crafting something extraordinary for you. Our team is
          working tirelessly to bring you an exceptional experience.
        </p>

        {/* Animated Sewing/Construction Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <motion.div
            animate={{ width: ["20px", "40px", "20px"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-px bg-black/30"
          />
          <span className="text-[8px] tracking-[0.3em] uppercase text-black/30 font-['Times_New_Roman',serif]">
            In Progress
          </span>
          <motion.div
            animate={{ width: ["20px", "40px", "20px"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-px bg-black/30"
          />
        </div>

        {/* Return Button */}
        <Link
          to={returnPath}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/90 transition-colors group text-sm tracking-[0.1em] uppercase"
        >
          {returnLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60px" }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 h-px bg-black/20"
      />
    </div>
  );
};

export default UnderConstruction;
