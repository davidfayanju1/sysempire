// components/product/SizeGuideModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Info } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-light tracking-wide">Size Guide</h2>
              <p className="text-sm text-gray-500 mt-1">
                Find your perfect fit with our detailed measurements
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-8">
            {/* How to Measure Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Maximize2 className="w-5 h-5" />
                How to Measure
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Bust Illustration
                    </span>
                  </div>
                  <p className="font-medium text-sm">Bust</p>
                  <p className="text-xs text-gray-500">
                    Measure around the fullest part of your bust, keeping the
                    tape measure straight across your back.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Waist Illustration
                    </span>
                  </div>
                  <p className="font-medium text-sm">Waist</p>
                  <p className="text-xs text-gray-500">
                    Measure around the narrowest part of your natural waist,
                    typically just above your belly button.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      Hips Illustration
                    </span>
                  </div>
                  <p className="font-medium text-sm">Hips</p>
                  <p className="text-xs text-gray-500">
                    Measure around the fullest part of your hips, keeping the
                    tape measure parallel to the floor.
                  </p>
                </div>
              </div>
            </div>

            {/* Size Chart */}
            <div>
              <h3 className="text-lg font-medium mb-4">Size Chart (inches)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Size
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Bust
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Waist
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        Hips
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        US Size
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium">
                        UK Size
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        size: "XXS",
                        bust: "30-31",
                        waist: "23-24",
                        hips: "32-33",
                        us: "0",
                        uk: "4",
                      },
                      {
                        size: "XS",
                        bust: "32-33",
                        waist: "25-26",
                        hips: "34-35",
                        us: "2",
                        uk: "6",
                      },
                      {
                        size: "S",
                        bust: "34-35",
                        waist: "27-28",
                        hips: "36-37",
                        us: "4-6",
                        uk: "8-10",
                      },
                      {
                        size: "M",
                        bust: "36-37",
                        waist: "29-30",
                        hips: "38-39",
                        us: "8-10",
                        uk: "12-14",
                      },
                      {
                        size: "L",
                        bust: "38-40",
                        waist: "31-33",
                        hips: "40-42",
                        us: "12-14",
                        uk: "16-18",
                      },
                      {
                        size: "XL",
                        bust: "41-43",
                        waist: "34-36",
                        hips: "43-45",
                        us: "16-18",
                        uk: "20-22",
                      },
                      {
                        size: "XXL",
                        bust: "44-46",
                        waist: "37-39",
                        hips: "46-48",
                        us: "20-22",
                        uk: "24-26",
                      },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm font-medium">
                          {row.size}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          {row.bust}"
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          {row.waist}"
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          {row.hips}"
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          {row.us}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          {row.uk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Fit Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • If you're between sizes, we recommend sizing up for a
                  comfortable fit.
                </li>
                <li>
                  • Our garments are designed with a tailored fit. Please refer
                  to the size chart for accurate measurements.
                </li>
                <li>
                  • For custom fittings, our customer service team is available
                  to assist you.
                </li>
                <li>
                  • Model is 5'9" (175cm) and wearing size S for reference.
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Need more help? Contact our{" "}
                <button className="text-black underline hover:no-underline">
                  customer service
                </button>{" "}
                for personalized assistance.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
