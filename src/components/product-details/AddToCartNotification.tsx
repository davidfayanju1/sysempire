// components/product/AddToCartNotification.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AddToCartNotificationProps {
  isVisible: boolean;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  onClose: () => void;
}

const AddToCartNotification = ({
  isVisible,
  productName,
  quantity,
  size,
  color,
  onClose,
}: AddToCartNotificationProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 shadow-xl z-50 max-w-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-full">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Added to Cart!</p>
              <p className="text-xs text-gray-300 mt-1">
                {quantity} × {productName} - {size} / {color}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
              className="text-xs uppercase tracking-wider border-b border-white pb-1 hover:opacity-70 transition-opacity"
            >
              View Cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartNotification;
