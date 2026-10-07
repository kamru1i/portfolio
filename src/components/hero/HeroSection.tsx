"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { Rotating3DCylinder } from "./Rotating3DCylinder";

interface HeroSectionProps {
  initialDelay?: number;
}

export function HeroSection({ initialDelay = 2.4 }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-start pt-24 sm:pt-28 md:pt-32 pb-16 px-4 overflow-hidden">
      {/* Massive Editorial Display Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 180,
          delay: initialDelay,
        }}
        className="w-full text-center select-none"
      >
        <h1 className="font-gambarino text-[46px] lg:text-[80px] xl:text-[100px] leading-[0.9] tracking-[-0.01em] text-white uppercase mx-auto">
          {PORTFOLIO_DATA.hero.wordmark}
        </h1>
      </motion.div>

      {/* Subtitle Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.9,
          delay: initialDelay + 0.2,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="mt-6 md:mt-8 max-w-[640px] px-4 text-center"
      >
        <p className="font-mono-custom text-[14px] sm:text-[16px] leading-[1.6] text-[#a1a1a1]">
          {PORTFOLIO_DATA.hero.subtitle}
        </p>
      </motion.div>

      {/* 3D Rotating Cylinder Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 160,
          delay: initialDelay + 0.35,
        }}
        className="w-full mt-6 md:mt-10 flex justify-center"
      >
        <Rotating3DCylinder />
      </motion.div>
    </section>
  );
}
