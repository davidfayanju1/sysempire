import { Link } from "react-router-dom";
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const brandImages = [
    {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80",
      alt: "Luxury fashion design sketch",
    },
    {
      src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80",
      alt: "Elegant fashion boutique",
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80",
      alt: "Fashion runway",
    },
    {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80",
      alt: "Fashion design studio",
    },
    {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80",
      alt: "Fashion collection",
    },
  ];

  // Handle image transition with crossfade
  const changeImage = (newIndex: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setNextImageIndex(newIndex);

    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const nextImage = () => {
    setIsAutoPlaying(false);
    const newIndex = (currentImageIndex + 1) % brandImages.length;
    changeImage(newIndex);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevImage = () => {
    setIsAutoPlaying(false);
    const newIndex =
      (currentImageIndex - 1 + brandImages.length) % brandImages.length;
    changeImage(newIndex);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-play carousel with crossfade
  useEffect(() => {
    let interval: number;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        const newIndex = (currentImageIndex + 1) % brandImages.length;
        changeImage(newIndex);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentImageIndex, brandImages.length]);

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24">
        {/* Central narrative - Vogue editorial style */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="md:mb-16 mb-8">
            <div className="w-16 md:block hidden h-px bg-black/15 mx-auto mb-8" />
            <p className="text-3xl md:text-5xl font-light text-black leading-[1.3] md:leading-[1.4] tracking-tight font-['Times_New_Roman',serif]">
              Fashion has always been{" "}
              <span className="font-bold italic">in the heart</span>
            </p>
            <p className="text-2xl md:text-4xl font-light text-black/70 mt-4 font-['Times_New_Roman',serif]">
              converting it into a project that spans{" "}
              <span className="font-bold italic">across countries</span>
            </p>
            <div className="w-16 h-px bg-black/15 mx-auto mt-8" />
          </div>

          {/* The story */}
          <div className="grid md:grid-cols-2 md:gap-12 gap-8 text-left md:mb-20 mb-10">
            <div>
              <p className="text-sm leading-[18px] text-justify text-black/60 tracking-wide">
                What began as a spark of passion has grown into an international
                movement. The vision was simple: create clothing that transcends
                trends, speaks to the soul, and stands the test of time.
              </p>
            </div>
            <div>
              <p className="text-sm leading-[18px] text-black/60 text-justify tracking-wide">
                Today, that vision spans continents. Each piece is a testament
                to a decade-long journey, one fueled by relentless pursuit of
                excellence and an unshakable belief in the power of artistry.
              </p>
            </div>
          </div>

          {/* The mission statement */}
          <div className="border-t border-b border-black/10 py-16 my-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-8">
              <Heart className="w-3 h-3 text-black/40" />
              <span className="text-[8px] tracking-[0.2em] uppercase text-black/40 font-['Times_New_Roman',serif]">
                The Culture
              </span>
            </div>
            <p className="text-lg md:text-xl font-new-roman font-light text-black leading-relaxed max-w-2xl mx-auto">
              "Because creating excellence became a culture.
              <br />A 10-year adventure lead to this lifetime of artistry."
            </p>
            <p className="text-[10px] text-black/30 mt-6 tracking-[0.2em] uppercase">
              — Founder
            </p>
          </div>

          {/* Image Carousel */}
          <div className="mt-16">
            <div className="relative overflow-hidden border border-black/10 bg-black/5">
              {/* Main Image Container with Crossfade */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                {/* Current Image */}
                <img
                  src={brandImages[currentImageIndex].src}
                  alt={brandImages[currentImageIndex].alt}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                />

                {/* Next Image (for crossfade) */}
                <img
                  src={brandImages[nextImageIndex].src}
                  alt={brandImages[nextImageIndex].alt}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    isTransitioning ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              {/* Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm tracking-[0.2em] uppercase font-light font-['Times_New_Roman',serif]">
                  {brandImages[currentImageIndex].alt
                    .split(" ")
                    .slice(0, 3)
                    .join(" ")}
                </p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center rounded-full z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center rounded-full z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 z-20">
                <div
                  className="h-full bg-white/60 transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentImageIndex + 1) / brandImages.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Closing statement */}
          <div className="mt-12">
            <blockquote className="text-xs text-black/40 italic max-w-md mx-auto leading-relaxed font-['Times_New_Roman',serif]">
              "What started as a personal dream has become a shared journey —
              one that continues to unfold with every collection, every stitch,
              and every story we tell."
            </blockquote>
          </div>

          {/* CTA */}
          <div className="mt-16">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors group text-xs tracking-[0.15em] uppercase"
            >
              Read the full story
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
