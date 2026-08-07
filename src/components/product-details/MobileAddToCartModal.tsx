// components/product-details/MobileAddToCartModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductColor } from "../../types/product";
import ColorSelector from "./ColorSelector";

interface MobileAddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  addingToCart: boolean;
  onQuantityChange: (delta: number) => void;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  onConfirm: () => Promise<void>;
}

const MobileAddToCartModal = ({
  isOpen,
  onClose,
  product,
  quantity,
  selectedSize,
  selectedColor,
  addingToCart,
  onQuantityChange,
  onSizeSelect,
  onColorSelect,
  onConfirm,
}: MobileAddToCartModalProps) => {
  const isColorAvailable = (color: ProductColor) => {
    if (!selectedSize) return true;
    return product.variants.some(
      (variant) =>
        variant.color === color.name && variant.sizes.includes(selectedSize),
    );
  };

  const handleConfirm = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    await onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/50 z-[70]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-[75] rounded-t-2xl max-h-[88vh] flex flex-col"
          >
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="flex items-center gap-4 p-5 border-b border-gray-100">
              <div className="w-16 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium tracking-wide truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₦{(product.price * quantity).toLocaleString("en-NG")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-black transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                isColorAvailable={isColorAvailable}
                onSelect={onColorSelect}
              />

              <div className="space-y-3">
                <span className="text-sm font-medium tracking-wide">Size</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => onSizeSelect(size)}
                      className={`min-w-[56px] h-12 px-4 border transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium tracking-wide">
                  Quantity
                </span>
                <div className="flex items-center gap-4 border border-gray-300 w-fit">
                  <button
                    onClick={() => onQuantityChange(-1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => onQuantityChange(1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <button
                onClick={handleConfirm}
                disabled={addingToCart || !product.inStock}
                className="w-full bg-black text-white py-4 px-6 tracking-[0.2em] text-sm uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : !product.inStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart — ₦
                    {(product.price * quantity).toLocaleString("en-NG")}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileAddToCartModal;
