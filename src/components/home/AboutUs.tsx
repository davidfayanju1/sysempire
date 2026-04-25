import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { useRef, useEffect } from "react";

const AboutUs = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

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

          {/* Video Section */}
          <div className="mt-16">
            <div className="relative overflow-hidden border border-black/10 bg-black/5">
              {/* Video */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src="/videos/drumming_man.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Subtle overlay for the video */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />

              {/* Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm tracking-[0.2em] uppercase font-light font-['Times_New_Roman',serif]">
                  The Rhythm of Creation
                </p>
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
