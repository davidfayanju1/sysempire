// components/product/MobileStickyBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Share2 } from "lucide-react";

interface MobileStickyBarProps {
  isVisible: boolean;
  productPrice: number;
  quantity: number;
  addingToCart: boolean;
  isWishlisted: boolean;
  inStock: boolean;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  onShareClick: () => void;
}

const MobileStickyBar = ({
  isVisible,
  productPrice,
  quantity,
  addingToCart,
  isWishlisted,
  inStock,
  onAddToCart,
  onWishlistToggle,
  onShareClick,
}: MobileStickyBarProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg z-50"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <div className="text-[10px] text-gray-500">Total Price</div>
              <div className="text-base font-medium whitespace-nowrap">
                ₦{(productPrice * quantity).toLocaleString("en-NG")}
              </div>
            </div>
            <button
              onClick={onWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="shrink-0 border border-gray-300 p-3 hover:border-black transition-all"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
            <button
              onClick={onShareClick}
              aria-label="Share"
              className="shrink-0 border border-gray-300 p-3 hover:border-black transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onAddToCart}
              disabled={addingToCart || !inStock}
              className="flex-1 bg-black text-white py-3 px-4 tracking-[0.15em] text-xs uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : !inStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyBar;
