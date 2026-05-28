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
    <div className="speakers-hero">
      <div className="marquee-wrapper">
        <div className="marquee-track" ref={marqueeRef}>
          {allImages.map((image, i) => (
            <div key={`${image.id}-${i}`} className="marquee-card">
              <img src={image.src} alt={image.alt} className="marquee-img" />
              {/* Subtle individual gradient layer if needed */}
              <div className="marquee-card-overlay"></div>
            </div>
          ))}
        </div>
        {/* Global deep overlay covering the entire marquee background */}
        <div className="hero-global-overlay"></div>
      </div>

      <div className="hero-text-container">
        <h1 className="hero-heading">
          Your Vision. <br />
          <span className="hero-accent">Our Hands.</span>
        </h1>
        <p className="hero-sub">
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
    </div>
  );
};

export default Hero;
