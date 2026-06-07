// components/product/MobileStickyBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Share2 } from "lucide-react";

interface MobileStickyBarProps {
  isVisible: boolean;
  productPrice: number;
  quantity: number;
  addingToCart: boolean;
  isWishlisted: boolean;
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
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50"
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Total Price</div>
              <div className="text-lg font-medium">
                ₦{(productPrice * quantity).toLocaleString("en-NG")}
              </div>
            </div>
            <button
              onClick={onAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-black text-white py-3 px-6 tracking-[0.2em] text-xs uppercase font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={onWishlistToggle}
              className="flex-1 border border-gray-300 py-2 text-xs uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2"
            >
              <Heart
                className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
              />
              Wishlist
            </button>
            <button
              onClick={onShareClick}
              className="flex-1 border border-gray-300 py-2 text-xs uppercase tracking-[0.2em] font-light hover:border-black transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-3 h-3" />
              Share
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyBar;
