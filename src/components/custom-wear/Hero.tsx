import { Coffee, Ruler, Scissors, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  // Sample images for the marquee slider
  const sliderImages = [
    {
      id: 1,
      src: "/images/female-clothing/blue.png",
      alt: "Fashion design process",
    },
    {
      id: 2,
      src: "/images/female-clothing/lunch.png",
      alt: "Fabric selection",
    },
    {
      id: 3,
      src: "/images/female-clothing/pink.png",
      alt: "Tailoring session",
    },
    {
      id: 4,
      src: "/images/female-clothing/purple.png",
      alt: "Fashion consultation",
    },
    {
      id: 5,
      src: "/images/female-clothing/international.png",
      alt: "Style inspiration",
    },
    {
      id: 6,
      src: "/images/female-clothing/lemon.png",
      alt: "Fashion design studio",
    },
  ];

  // Create tripled array for seamless loop
  const allImages = [...sliderImages, ...sliderImages, ...sliderImages];

  const scrollToNextSection = () => {
    const nextSection = document.querySelector("section");
    if (nextSection) {
      const offset = 80;
      const elementPosition = nextSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Marquee Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div
          ref={marqueeRef}
          className="flex h-full w-max animate-[scroll_80s_linear_infinite]"
          style={{
            animation: "scroll 80s linear infinite",
          }}
        >
          {allImages.map((image, i) => (
            <div
              key={`${image.id}-${i}`}
              className="relative shrink-0 w-[280px] h-full overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ))}
        </div>
        {/* Global overlay */}
        <div className="absolute inset-0 bg-black/30 z-1" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[800px] px-6">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight text-white mb-6">
          Your Vision. <br />
          <span className="font-serif italic font-bold">Our Hands.</span>
        </h1>
        <p className="text-white/80 text-[clamp(0.9rem,2vw,1.1rem)] font-light leading-relaxed">
          Step into our creative space. Whether you come with a dream or need a
          little inspiration, we're here to bring your perfect piece to life.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <Ruler className="w-3 h-3" /> Precise Measurements
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1">
            <Scissors className="w-3 h-3" /> Expert Craftsmanship
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1">
            <Coffee className="w-3 h-3" /> Warm Consultation
          </span>
        </div>
      </div>

      {/* Down Arrow with Continue */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 group cursor-pointer"
        aria-label="Continue to next section"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 group-hover:text-white/90 transition-colors">
            Continue
          </span>
          <div className="w-8 h-12 rounded-full border-2 border-white/40 group-hover:border-white/70 transition-all flex items-start justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-2 bg-white/60 rounded-full mt-2"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors animate-bounce" />
        </div>
      </button>

      {/* Add keyframes for scroll animation */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
          .animate-bounce {
            animation: bounce 1s infinite;
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(4px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Hero;
