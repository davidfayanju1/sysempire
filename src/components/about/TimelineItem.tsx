// components/about/TimelineItem.tsx
import { motion } from "framer-motion";

interface TimelineItemProps {
  year: number;
  title: string;
  description: string;
  image: string;
  collection: string;
  index: number;
  isInView: boolean;
}

export const TimelineItem = ({
  year,
  title,
  description,
  image,
  collection,
  index,
  isInView,
}: TimelineItemProps) => {
  return (
    <motion.div
      className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="md:w-1/2"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 border border-black/10">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
      <div className="md:w-1/2 space-y-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-4xl md:text-5xl font-light text-black/20 font-['Times_New_Roman',serif]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
          >
            {year}
          </motion.span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 border-l border-black/20 pl-3">
            {collection}
          </span>
        </div>
        <motion.h3
          className="text-2xl md:text-3xl font-light text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.15 + 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-black/60 text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};
