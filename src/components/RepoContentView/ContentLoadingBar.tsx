'use client';

import { motion, AnimatePresence } from 'motion/react';

type ContentLoadingBarProps = {
  isLoading: boolean;
};

export default function ContentLoadingBar({ isLoading }: ContentLoadingBarProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 z-10"
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={{ 
            scaleX: [0, 0.7, 0.7, 1],
            transformOrigin: ['left', 'left', 'right', 'right']
          }}
          exit={{ 
            scaleX: 1, 
            transformOrigin: 'right',
            transition: { duration: 0.2 }
          }}
          transition={{ 
            duration: 2,
            times: [0, 0.7, 0.9, 1],
            ease: 'easeInOut'
          }}
        />
      )}
    </AnimatePresence>
  );
}
