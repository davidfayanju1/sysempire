// components/about/StatsSection.tsx
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Award, Globe, Users, Sparkles } from "lucide-react";

const stats = [
  { value: "10+", label: "Years of Excellence", icon: Award },
  { value: "5+", label: "Countries Served", icon: Globe },
  { value: "10k+", label: "Happy Clients", icon: Users },
  { value: "10+", label: "Collections", icon: Sparkles },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  hover: { y: -8, scale: 1.02, transition: { duration: 0.3 } },
};

export const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      className="border-y border-black/10 py-16 bg-white"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center space-y-2"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center">
                <stat.icon className="w-6 h-6 text-black/30" />
              </div>
              <motion.div
                className="text-3xl md:text-4xl font-light text-black font-['Times_New_Roman',serif]"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-black/40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
