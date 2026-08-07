// components/product/ProductImageGallery.tsx
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { ProductImage } from "../../types/product";

const SPRING = { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.9 };

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

const ProductImageGallery = ({
  images,
  productName,
  selectedImage,
  onImageSelect,
}: ProductImageGalleryProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Single motion value owns the x position — Framer Motion mutates it
  // directly during drag and we animate it imperatively on slide change.
  const x = useMotionValue(0);

  // Measure the container once and on resize; snap x when width changes
  useEffect(() => {
    const measure = () => {
      const w = sliderRef.current?.offsetWidth;
      if (!w) return;
      setContainerWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sliderRef.current) ro.observe(sliderRef.current);
    return () => ro.disconnect();
  }, []);

  // When the container width changes snap to current index without animating
  // (resize / orientation flip — users don't notice a snap here)
  useEffect(() => {
    if (containerWidth === 0) return;
    x.set(-(selectedImage * containerWidth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  // Smooth spring to the right slide whenever the index changes from outside
  // (thumbnail click, colour-select jump, etc.)
  useEffect(() => {
    if (containerWidth === 0) return;
    const controls = animate(x, -(selectedImage * containerWidth), SPRING);
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, containerWidth]);

  const snapTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    animate(x, -(clamped * containerWidth), SPRING);
    if (clamped !== selectedImage) onImageSelect(clamped);
  };

  const handleDragEnd = (
    _: unknown,
    info: { velocity: { x: number } },
  ) => {
    setIsDragging(false);
    if (containerWidth === 0) return;

    // Nearest slide from current position
    const nearest = Math.round(-x.get() / containerWidth);

    // Override nearest with velocity flick (> 400 px/s goes one further)
    let target = Math.max(0, Math.min(nearest, images.length - 1));
    if (info.velocity.x < -400) target = Math.min(nearest + 1, images.length - 1);
    else if (info.velocity.x > 400) target = Math.max(nearest - 1, 0);

    snapTo(target);
  };

  return (
    <div className="lg:sticky lg:top-24 lg:self-start lg:space-y-4">
      {/* ── Mobile swipeable slider ── */}
      <div
        ref={sliderRef}
        className="relative mb-4 lg:hidden h-[88vh] w-screen ml-[calc(50%-50vw)] overflow-hidden bg-gray-50 select-none"
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          className="flex h-full"
          style={{
            x,
            width: `${images.length * 100}%`,
            cursor: isDragging ? "grabbing" : "grab",
            willChange: "transform",
          }}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{
            left: -(images.length - 1) * containerWidth,
            right: 0,
          }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={image.url}
                alt={image.alt || `${productName} view ${index + 1}`}
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Gradient overlay — keeps the transparent nav's white logo legible
            over bright product photos at the top of the slider. */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 via-black/10 to-transparent pointer-events-none z-10" />

        {/* Dot pagination — elongated active dot, floating pill */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-2.5 py-2 rounded-full">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => snapTo(index)}
                aria-label={`View image ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  selectedImage === index
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop main image ── */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative hidden lg:block aspect-[3/4] overflow-hidden bg-gray-50"
      >
        <img
          src={images[selectedImage]?.url || images[0]?.url}
          alt={images[selectedImage]?.alt || productName}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Thumbnail Navigation — shared by mobile and desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 px-6 md:px-0">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => snapTo(index)}
            className={`relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-50 transition-all ${
              selectedImage === index
                ? "ring-2 ring-black ring-offset-2"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
