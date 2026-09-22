'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Start loading when pathname changes
    handleStart();
    
    // Complete loading after a short delay to simulate page load
    const timer = setTimeout(handleComplete, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] bg-accent"
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1, transformOrigin: 'right' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
