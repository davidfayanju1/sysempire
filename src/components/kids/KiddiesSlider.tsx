import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface KiddiesSlide {
  image: string;
  caption: string;
}

interface KiddiesSliderProps {
  slides: KiddiesSlide[];
  aspectClassName?: string;
  autoplayMs?: number;
  className?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.06,
    rotate: direction * 1.5,
  }),
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.96,
    rotate: direction * -1.5,
  }),
};

const KiddiesSlider = ({
  slides,
  aspectClassName = "aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]",
  autoplayMs = 4500,
  className = "",
}: KiddiesSliderProps) => {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    setSlide(([current]) => [
      (next + slides.length) % slides.length,
      next > current ? 1 : -1,
    ]);
  };

  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setSlide(([current]) => [(current + 1) % slides.length, 1]);
    }, autoplayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoplayMs, slides.length]);

  return (
    <div
      className={`relative overflow-hidden border border-[#c96b82]/20 ${aspectClassName} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence custom={direction} mode="popLayout" initial={false}>
        <motion.img
          key={index}
          src={slides[index].image}
          alt={slides[index].caption}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Scrim + caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.p
          key={slides[index].caption}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-5 left-5 md:bottom-8 md:left-8 text-white italic text-lg md:text-2xl font-['Times_New_Roman',serif]"
        >
          {slides[index].caption}
        </motion.p>
      </AnimatePresence>

      {/* Arrows */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
            style={{ width: i === index ? 22 : 6 }}
          >
            {i === index && (
              <motion.span
                layoutId={`kiddies-dot-${aspectClassName}`}
                className="absolute inset-0 rounded-full bg-white"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KiddiesSlider;
