// components/product/SizeGuideModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SizeRow {
  size: string;
  shoulder: number;
  bust: number;
  length: number;
}

const FEMALE_SIZES: SizeRow[] = [
  { size: "XS", shoulder: 14, bust: 31.5, length: 23 },
  { size: "S", shoulder: 15.5, bust: 35, length: 25 },
  { size: "M", shoulder: 16.5, bust: 39, length: 26 },
  { size: "L", shoulder: 18, bust: 44, length: 27 },
  { size: "XL", shoulder: 19, bust: 47, length: 28 },
  { size: "XXL", shoulder: 20.5, bust: 52, length: 29 },
];

const MALE_SIZES: SizeRow[] = [
  { size: "S", shoulder: 16.5, bust: 35, length: 28 },
  { size: "M", shoulder: 19, bust: 39, length: 28.5 },
  { size: "L", shoulder: 21, bust: 45, length: 31 },
  { size: "XL", shoulder: 23.5, bust: 49.5, length: 31 },
  { size: "XXL", shoulder: 25, bust: 52, length: 32 },
];

const TShirtDiagram = () => (
  <svg
    viewBox="-20 0 140 118"
    className="w-full max-w-[170px] mx-auto"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M10 15 L10 30 L30 32 L30 100 L70 100 L70 32 L90 30 L90 15 L65 8 Q50 18 35 8 Z"
      strokeWidth="1.5"
    />

    {/* Shoulder */}
    <line
      x1="25"
      y1="19"
      x2="75"
      y2="19"
      strokeWidth="1"
      strokeDasharray="3 2"
    />
    <text
      x="50"
      y="8"
      textAnchor="middle"
      fontSize="8"
      stroke="none"
      fill="currentColor"
    >
      Shoulder
    </text>

    {/* Bust */}
    <line
      x1="30"
      y1="46"
      x2="70"
      y2="46"
      strokeWidth="1"
      strokeDasharray="3 2"
    />
    <text x="102" y="49" fontSize="8" stroke="none" fill="currentColor">
      Bust
    </text>

    {/* Length */}
    <line
      x1="0"
      y1="15"
      x2="0"
      y2="100"
      strokeWidth="1"
      strokeDasharray="3 2"
    />
    <text
      x="-12"
      y="60"
      fontSize="8"
      stroke="none"
      fill="currentColor"
      transform="rotate(-90 -12 60)"
      textAnchor="middle"
    >
      Length
    </text>
  </svg>
);

const SizeTable = ({ title, rows }: { title: string; rows: SizeRow[] }) => (
  <div>
    <h3 className="text-xl font-bold uppercase tracking-wide text-center mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-2"></th>
              <th className="border border-gray-300 px-3 py-2 font-normal text-gray-600">
                Shoulder
                <br />
                (inch)
              </th>
              <th className="border border-gray-300 px-3 py-2 font-normal text-gray-600">
                Bust
                <br />
                (inch)
              </th>
              <th className="border border-gray-300 px-3 py-2 font-normal text-gray-600">
                Length
                <br />
                (inch)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size}>
                <td className="border border-gray-300 px-3 py-2 font-medium">
                  {row.size}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {row.shoulder}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {row.bust}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {row.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TShirtDiagram />
    </div>
  </div>
);

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
          className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-wide">Size Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors border border-gray-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-10">
            <SizeTable title="Female" rows={FEMALE_SIZES} />
            <SizeTable title="Male" rows={MALE_SIZES} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
