// components/about/TimelineSection.tsx
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Clock } from "lucide-react";

const timelineData = [
  {
    year: 2014,
    title: "The Beginning",
    description:
      "Founded in a small studio with a sewing machine and a dream. The first collection featured 10 handmade pieces, each telling a unique story of African elegance.",
    image:
      "https://images.unsplash.com/photo-1536867520774-5b4f2628a69b?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    collection: "Inaugural Collection",
  },
  {
    year: 2016,
    title: "International Debut",
    description:
      "First international showroom opened in London. The brand gained recognition for blending traditional African textiles with contemporary silhouettes.",
    image:
      "https://images.unsplash.com/photo-1621370688441-8ce43a9903dd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    collection: "Diaspora Collection",
  },
  {
    year: 2019,
    title: "Flagship Launch",
    description:
      "Opened the flagship store in Lagos, Nigeria. Introduced the 'Afro-Futurism' collection at Lagos Fashion Week to critical acclaim.",
    image:
      "https://images.unsplash.com/photo-1628565931779-4f4f0b4f578a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    collection: "Afro-Futurism",
  },
  {
    year: 2021,
    title: "Global Recognition",
    description:
      "Featured in Vogue, Elle, and Harper's Bazaar. Collaborated with international designers and expanded to Paris and New York.",
    image:
      "https://images.unsplash.com/photo-1633655442168-c6ef0ed2f984?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    collection: "Global Citizen",
  },
  {
    year: 2024,
    title: "Sustainable Future",
    description:
      "Launched the eco-conscious collection using sustainable materials. Committed to ethical fashion and empowering local artisans.",
    image:
      "https://images.unsplash.com/photo-1620063224601-ead11b9737bf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    collection: "Conscious Couture",
  },
];

export const TimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // We slightly lower the stiffness to give it a "heavier", more premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-[#fdfdfd]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Large Year Mask */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.span
            style={{
              opacity: useTransform(smoothProgress, [0, 1], [0.05, 0.02]),
              scale: useTransform(smoothProgress, [0, 1], [1, 1.2]),
            }}
            className="text-[25vw] font-serif italic text-black select-none"
          >
            Archive
          </motion.span>
        </div>

        {/* Static Header */}
        <div className="absolute top-12 text-center z-30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-4 bg-white/50 backdrop-blur-md"
          >
            <Clock className="w-3 h-3 text-black/40" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-black/60 font-serif">
              Our Journey
            </span>
          </motion.div>
          <h2 className="text-4xl font-light text-black tracking-tight">
            A Decade of{" "}
            <span className="font-serif italic font-bold">
              Creative Evolution
            </span>
          </h2>
        </div>

        {/* 3D Stage - Perspective is key for "obvious" 3D */}
        <div
          className="relative mt-10 w-full max-w-6xl h-[65vh] md:h-[550px] flex items-center justify-center"
          style={{ perspective: "3000px" }}
        >
          {timelineData.map((item, index) => (
            <TimelineCard
              key={index}
              item={item}
              index={index}
              total={timelineData.length}
              progress={smoothProgress}
            />
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-16 w-48 h-[1px] bg-black/5">
          <motion.div
            className="h-full bg-black origin-left"
            style={{ scaleX: smoothProgress }}
          />
        </div>
      </div>
    </section>
  );
};

const TimelineCard = ({ item, index, total, progress }: any) => {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // INCREASED ANIMATION RANGES:
  // We use wider ranges (e.g., start - step) to ensure the outgoing card
  // is still visible/rotating while the new one enters.

  const rotateX = useTransform(
    progress,
    [start - step * 0.8, start, end, end + step * 0.8],
    [90, 0, 0, -90],
  );

  const z = useTransform(
    progress,
    [start - step, start, end, end + step],
    [-800, 0, 0, -800],
  );

  const scale = useTransform(
    progress,
    [start - step * 0.5, start, end, end + step * 0.5],
    [0.8, 1, 1, 0.8],
  );

  const opacity = useTransform(
    progress,
    [start - step * 0.4, start, end, end + step * 0.4],
    [0, 1, 1, 0],
  );

  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      style={{
        rotateX,
        z,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
    >
      <div
        className={`flex flex-col md:flex-row w-full h-full bg-white shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden pointer-events-auto ${
          isReversed ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image side with parallax zoom */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-gray-100">
          <motion.img
            style={{
              scale: useTransform(progress, [start, end], [1.2, 1]),
            }}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Content side with internal sliding animation */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-10 md:p-20 flex flex-col justify-center bg-white relative">
          <motion.div
            style={{
              y: useTransform(progress, [start, end], [40, 0]),
              opacity: useTransform(
                progress,
                [start, start + step * 0.2],
                [0, 1],
              ),
            }}
          >
            <span className="text-7xl font-serif italic text-black/[0.04] absolute top-10 right-10 leading-none select-none">
              {item.year}
            </span>

            <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6 block font-serif">
              {item.collection}
            </span>

            <h3 className="text-3xl md:text-4xl font-light mb-6 tracking-tight text-black uppercase">
              {item.title}
            </h3>

            <p className="text-gray-500 leading-relaxed font-light text-sm md:text-base max-w-sm mb-8">
              {item.description}
            </p>

            <div className="w-12 h-[1px] bg-black/20" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
