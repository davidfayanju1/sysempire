import { motion, AnimatePresence } from "framer-motion";

interface PageLoadingOverlayProps {
  isLoading: boolean;
}

const PageLoadingOverlay = ({ isLoading }: PageLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-200 bg-black/30 flex items-center justify-center"
        >
          <img
            src="/images/logo_light.png"
            alt=""
            className="w-16 h-16 md:w-40 md:h-40 object-contain animate-pulse"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoadingOverlay;
