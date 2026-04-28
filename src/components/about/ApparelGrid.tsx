// components/about/ApparelGrid.tsx
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

interface ApparelYear {
  year: number;
  name: string;
  image: string;
  pieces: string[];
}

const apparelYears: ApparelYear[] = [
  {
    year: 2014,
    name: "Heritage",
    image:
      "https://images.unsplash.com/photo-1696962701419-6f510910e838?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Ankara Gowns", "Kaftans"],
  },
  {
    year: 2016,
    name: "Diaspora",
    image:
      "https://images.unsplash.com/photo-1648329008114-bce0ec0b5950?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Cocktail Dresses", "Evening Wear"],
  },
  {
    year: 2018,
    name: "Modernist",
    image:
      "https://images.unsplash.com/photo-1666985152385-5075e84caf0e?q=80&w=1360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Power Suits", "Blazers"],
  },
  {
    year: 2020,
    name: "Avant-Garde",
    image:
      "https://images.unsplash.com/photo-1619610405999-d6ab699dc9b4?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Statement Pieces", "Bridal"],
  },
  {
    year: 2022,
    name: "Minimalist",
    image:
      "https://images.unsplash.com/photo-1668035188870-9bba52206be9?q=80&w=1015&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Daily Wear", "Essentials"],
  },
  {
    year: 2024,
    name: "Eco-Chic",
    image:
      "https://images.unsplash.com/photo-1773398972684-2ba88aa89499?q=80&w=997&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieces: ["Sustainable Collection"],
  },
];

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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const ApparelGrid = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      className="py-20 bg-white"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.div
            variants={floatVariants}
            className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6"
          >
            <Star className="w-3 h-3 text-black/40" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
              Design Evolution
            </span>
          </motion.div>
          <motion.h2
            variants={floatVariants}
            className="text-3xl md:text-4xl font-light text-black tracking-tight"
          >
            Signature Collections
            <br />
            <span className="font-['Times_New_Roman',serif] font-bold italic text-sm tracking-[0.2em] uppercase text-black/50">
              Through the years
            </span>
          </motion.h2>
          <motion.div
            variants={floatVariants}
            className="w-12 h-px bg-black/15 mx-auto mt-6"
          />
        </div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerVariants}
        >
          {apparelYears.map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden border border-black/10 bg-white hover:shadow-2xl transition-all duration-300"
              variants={cardVariants}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs tracking-[0.2em] uppercase opacity-80">
                  {item.year}
                </p>
                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-[10px] opacity-70 mt-1">
                  {item.pieces.join(" • ")}
                </p>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1">
                <span className="text-[8px] tracking-[0.2em] uppercase text-black font-semibold">
                  {item.year}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
