'use client';

import { motion, AnimatePresence } from 'framer-motion';

type ContentLoadingBarProps = {
  isLoading: boolean;
};

export default function ContentLoadingBar({ isLoading }: ContentLoadingBarProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#2f81f7] z-50 origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: [0, 0.4, 0.8, 1], opacity: [1, 1, 1, 0.5] }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3 } }}
        />
      )}
    </AnimatePresence>
  );
}
