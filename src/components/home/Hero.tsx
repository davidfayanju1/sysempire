import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays properly
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((error: { message: string; name: string; stack: string }) => {
          console.log("Video autoplay failed:", error);
        });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
      </video>

      {/* Black and White Overlay - Multiple layers for editorial magazine effect */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Grain/Noise Overlay for vintage magazine texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* Vogue-style badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-white/20 mb-8">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/70 font-['Times_New_Roman',serif]">
              Spring/Summer 2026
            </span>
          </div>

          {/* Main headline with Times New Roman on key words */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-6">
            Where{" "}
            <span className="font-['Times_New_Roman',serif] font-light italic text-white">
              Fashion
            </span>
            <br />
            Becomes{" "}
            <span className="font-['Times_New_Roman',serif] font-light italic text-white">
              Art
            </span>
          </h1>

          {/* Vogue-inspired subheadline */}
          <div className="mb-8">
            <p className="text-sm md:text-base text-white/60 max-w-xl font-light mx-auto leading-relaxed tracking-wide">
              The new collection. Defined by elegance.
              <br className="hidden sm:block" />
              Crafted for the modern visionary.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collection"
              className="group px-8 py-3 bg-white text-black hover:bg-white/90 transition-all font-[300] duration-300 tracking-wide text-sm"
            >
              Explore Collection
            </Link>
            <Link
              to="/about"
              className="group px-8 py-3 border font-[300] border-white/30 text-white hover:bg-white/10 transition-all duration-300 tracking-wide text-sm"
            >
              Read The Story
            </Link>
          </div>
        </div>
      </div>

      {/* Vogue-style decorative line */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-px h-8 bg-white/30" />
      </div>

      {/* Scroll Indicator - Vogue inspired */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[7px] tracking-[0.3em] uppercase text-white/40 font-['Times_New_Roman',serif]">
            CONTINUE
          </span>
          <div className="w-px h-10 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
