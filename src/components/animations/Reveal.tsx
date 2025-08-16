"use client";

import { motion, Variants, useAnimation, useInView } from "framer-motion";
import { PropsWithChildren, useEffect, useRef } from "react";

type RevealProps = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
  /**
   * When true, the animation runs only once on first reveal.
   * Default: false (re-animates when scrolling back up for a soothing effect)
   */
  once?: boolean;
  /**
   * Portion of element that must be visible to trigger (0-1).
   * Default: 0.2
   */
  amount?: number;
}>;

const getVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.21, 1.01, 0.35, 1] },
  },
});

export default function Reveal({ children, delay = 0, y = 24, className, once = false, amount = 0.2 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount, once });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else if (!once) {
      // Allow re-animate when scrolling back up
      controls.start("hidden");
    }
  }, [inView, controls, once]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getVariants(y)}
      initial="hidden"
      animate={controls}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
