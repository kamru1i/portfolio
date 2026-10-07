"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { StatItem } from "@/lib/portfolio-data";

export function OdometerCounters({ stats }: { stats: StatItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <div
      ref={containerRef}
      className="w-full pt-20 md:pt-28 pb-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start"
    >
      {stats.map((stat, i) => (
        <CounterColumn key={i} stat={stat} index={i} triggered={isInView} />
      ))}
    </div>
  );
}

function CounterColumn({
  stat,
  index,
  triggered,
}: {
  stat: StatItem;
  index: number;
  triggered: boolean;
}) {
  const digits = String(stat.target).split("");

  return (
    <div className="flex flex-col">
      {/* Rolling Digits Display */}
      <div className="font-gambarino text-7xl sm:text-8xl md:text-[100px] lg:text-[120px] text-white leading-none tracking-[-0.02em] flex items-center select-none overflow-hidden h-[1em]">
        <div className="inline-flex items-center">
          {digits.map((digit, dIdx) => (
            <DigitReel
              key={dIdx}
              targetDigit={parseInt(digit, 10)}
              triggered={triggered}
              delay={index * 0.15 + dIdx * 0.1}
            />
          ))}
          {stat.suffix && (
            <span className="inline-block text-white ml-0.5">{stat.suffix}</span>
          )}
        </div>
      </div>

      {/* Label */}
      <span className="font-mono-custom text-[15px] sm:text-[16px] text-[#a1a1a1] mt-4 tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

function DigitReel({
  targetDigit,
  triggered,
  delay = 0,
}: {
  targetDigit: number;
  triggered: boolean;
  delay?: number;
}) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="relative inline-block overflow-hidden h-[1em] leading-[1em]">
      <motion.div
        className="flex flex-col will-change-transform"
        initial={{ y: "0em" }}
        animate={triggered ? { y: `-${targetDigit}em` } : { y: "0em" }}
        transition={{
          duration: 1.8,
          delay,
          ease: [0.16, 1, 0.3, 1], // Expo-out rolling brake curve
        }}
      >
        {numbers.map((n) => (
          <span
            key={n}
            className="h-[1em] leading-[1em] flex items-center justify-center min-w-[0.6em]"
          >
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
