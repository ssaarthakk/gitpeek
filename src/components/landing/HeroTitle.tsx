'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { FlipWords } from '@/components/ui/flip-words';

interface HeroTitleProps {
  className?: string;
}

export const HeroTitle = ({ className = "" }: HeroTitleProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const words = ["Securely", "Temporarily", "Effortlessly", "Safely"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-1 md:space-y-2"
      >
        {/* First line */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 md:gap-x-3 gap-y-1">
          <span>Share</span>
          <span className="relative text-blue-500">
            Private
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8c15-3 25-1 35-2 12-1 20-2 30-1 8 1 15 2 20 1 3-1 6-2 8-1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-blue-500"
                />
                <path
                  d="M1 6c20-2 30-1 40-1 15 0 25-1 35 0 7 1 12 2 18 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-blue-400 opacity-60"
                />
              </svg>
            </div>
          </span>
          <span>GitHub Repos</span>
        </div>
        
        <div className="flex items-center justify-center gap-x-2 md:gap-x-3 min-h-[1.2em]">
          <span className="text-white">Instantly</span>
          <span>&</span>
          <span className="text-blue-500">
            <FlipWords words={words} duration={2500} />
          </span>
        </div>
      </motion.div>
    </div>
  );
};
