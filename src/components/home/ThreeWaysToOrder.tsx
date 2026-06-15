import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const WAYS = [
  {
    number: "01",
    tag: "RTW",
    title: "Ready to Wear",
    subtitle:
      "Curated pieces crafted for the discerning modern woman — available now.",
    image: "/images/female-clothing/orange.png",
    to: "/wears/new-arrivals",
    cta: "Shop Collection",
  },
  {
    number: "02",
    tag: "Personal Fit",
    title: "Made to Measure",
    subtitle:
      "Bespoke garments tailored to your exact dimensions and creative vision.",
    image: "/images/female-clothing/purple.png",
    to: "/custom-wear",
    cta: "Start Your Order",
  },
  {
    number: "03",
    tag: "Group Orders",
    title: "Aso-Ebi",
    subtitle:
      "Coordinated luxury looks for weddings, milestones, and celebrations.",
    image: "/images/apparells/adire.png",
    to: "/contact",
    cta: "Inquire Now",
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 70 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      ease: EASE,
    },
  }),
};

const ThreeWaysToOrder = () => {
  return (
    <section className="bg-[#0c0c0c] py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 md:mb-20"
        >
          <p className="text-white/30 text-[9px] tracking-[0.35em] uppercase mb-5 font-light">
            How to shop
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl md:text-[3.25rem] font-light text-white tracking-tight leading-tight">
              Three Ways
              <br />
              <span className="font-['Times_New_Roman',serif] italic text-white/70">
                to Order
              </span>
            </h2>
            <div className="hidden md:block w-24 h-px bg-white/10" />
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-2">
          {WAYS.map((way, i) => (
            <motion.div
              key={way.number}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={cardVariants}
            >
              <Link
                to={way.to}
                className="group relative flex overflow-hidden"
                style={{ aspectRatio: "3 / 4" }}
              >
                {/* Background image */}
                <img
                  src={way.image}
                  alt={way.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/15 transition-opacity duration-500 group-hover:opacity-95" />

                {/* Top row: number + tag pill */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                  <span className="text-white/20 text-[11px] tracking-[0.3em] uppercase font-light select-none">
                    {way.number}
                  </span>
                  <span className="border border-white/15 text-white/50 text-[8px] tracking-[0.18em] uppercase px-3 py-1 backdrop-blur-sm">
                    {way.tag}
                  </span>
                </div>

                {/* Bottom: title + subtitle + CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-2xl md:text-[1.6rem] font-light text-white tracking-tight mb-2.5 leading-tight">
                    {way.title}
                  </h3>
                  <p className="text-white/45 text-[11px] leading-relaxed font-light mb-6 max-w-[200px]">
                    {way.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-300">
                    <span className="text-[9px] tracking-[0.25em] uppercase">
                      {way.cta}
                    </span>
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom accent line that sweeps in on hover */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-white/60 w-0 group-hover:w-full transition-all duration-500 ease-out z-10" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeWaysToOrder;
