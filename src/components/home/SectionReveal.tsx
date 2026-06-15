import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}

const SectionReveal = ({
  children,
  className = "",
  delay = 0,
  amount = 0.07,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount }}
      transition={{
        duration: 1.05,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
