import { Coffee, Ruler, Scissors } from "lucide-react";
import { useRef } from "react";

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

  return (
    <div className="relative h-[48vh] min-h-96 flex items-center justify-center overflow-hidden">
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
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-light tracking-tight text-white mb-3 md:mb-6">
          Your Vision. <br />
          <span className="font-serif italic font-bold">Our Hands.</span>
        </h1>
        <p className="text-white/80 text-[clamp(0.9rem,2vw,1.1rem)] font-light leading-snug md:leading-relaxed">
          Step into our creative space. Whether you come with a dream or need a
          little inspiration, we're here to bring your perfect piece to life.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 md:mt-8 text-xs text-white/70">
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
