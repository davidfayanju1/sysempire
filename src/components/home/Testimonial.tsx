import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Quotes } from "phosphor-react";

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Isabella Omotola",
      role: "Creative Director, Lagos Fashion Week",
      text: "The craftsmanship is absolutely breathtaking. Every piece tells a story of dedication and artistry. I've never felt more confident than when wearing their designs.",
      rating: 5,
      location: "Lagos, Nigeria",
      image: "/images/testimonials/client1.jpg",
    },
    {
      id: 2,
      name: "Michael Okafor",
      role: "Corporate Executive",
      text: "Their attention to detail is unmatched. From the initial consultation to the final fitting, every step was handled with professionalism and genuine care.",
      rating: 5,
      location: "Abuja, Nigeria",
      image: "/images/testimonials/client2.jpg",
    },
    {
      id: 3,
      name: "Dr. Amina Bello",
      role: "Entrepreneur & Philanthropist",
      text: "A brand that understands the modern African woman. The designs are elegant, timeless, and incredibly flattering. I'm a loyal customer for life.",
      rating: 5,
      location: "London, UK",
      image: "/images/testimonials/client3.jpg",
    },
    {
      id: 4,
      name: "Chidi Okonkwo",
      role: "Tech Investor",
      text: "Exceptional quality and service. The suit they created for me has become my signature piece. Highly recommended for anyone who values true craftsmanship.",
      rating: 5,
      location: "New York, USA",
      image: "/images/testimonials/client4.jpg",
    },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="bg-white py-14 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center md:mb-16 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 mb-6">
            <span className="text-[9px] tracking-[0.2em] uppercase text-black/50 font-['Times_New_Roman',serif]">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-black mb-3 tracking-tight">
            What our clients say
          </h2>
          <div className="w-12 h-px bg-pink-400/50 mx-auto" />
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          {/* Quote mark */}
          <div className="text-center md:mb-8">
            <Quotes size={72} className="text-black/20 text-center mx-auto" />
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-center">
            <p className="text-lg md:text-xl lg:text-2xl font-light text-black/80 leading-relaxed md:leading-relaxed mb-8 font-['Times_New_Roman',serif] italic">
              "{current.text}"
            </p>
          </blockquote>

          {/* Rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-500 text-yellow-500"
              />
            ))}
          </div>

          {/* Client Info */}
          <div className="text-center">
            <h4 className="text-base font-semibold text-black tracking-wide">
              {current.name}
            </h4>
            <p className="text-xs text-black/40 mt-1 tracking-wide">
              {current.role}
            </p>
            <p className="text-[10px] text-black/30 mt-1">{current.location}</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={prevSlide}
              className="w-10 h-10 border border-black/10 hover:border-black/30 transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronLeft className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                  }}
                  className={`h-[1px] transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-blue-800"
                      : "w-4 bg-black/20 hover:bg-black/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 border border-black/10 hover:border-black/30 transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronRight className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        blockquote {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
