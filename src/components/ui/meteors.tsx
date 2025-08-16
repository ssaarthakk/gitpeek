"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to spread meteors across full width
        const leftPosition = Math.random() * 100; // Random position from 0-100%
        const topPosition = Math.random() * 50; // Random position from 0-50%

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: `${topPosition}%`,
              left: `${leftPosition}%`,
              animationDelay: Math.random() * 8 + "s", // Random delay between 0-8s
              animationDuration: (Math.random() * 6 + 8) + "s", // Duration between 8-14s
            }}
          ></span>
        );
      })}
    </>
  );
};
