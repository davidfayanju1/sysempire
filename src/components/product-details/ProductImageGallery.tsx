// components/product/ProductImageGallery.tsx
import { motion } from "framer-motion";
import type { ProductImage } from "../../types/product";

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
  return (
    <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
      {/* Main Image */}
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-[3/4] overflow-hidden bg-gray-50"
      >
        <img
          src={images[selectedImage]?.url || images[0]?.url}
          alt={images[selectedImage]?.alt || productName}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onImageSelect(index)}
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
