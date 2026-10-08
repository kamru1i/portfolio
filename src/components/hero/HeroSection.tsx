"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { HeroTitle } from "./HeroTitle";
import { Rotating3DCylinder } from "./Rotating3DCylinder";

interface HeroSectionProps {
  isRevealed?: boolean;
}

export function HeroSection({ isRevealed = true }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-20 sm:pt-24 md:pt-28 lg:pt-[102px] pb-12 md:pb-16 px-4 overflow-hidden">
      {/* Massive Editorial Display Wordmark with Character-Staggered 3D Reveal */}
      <div className="w-full text-center select-none">
        <HeroTitle text={PORTFOLIO_DATA.hero.wordmark} isRevealed={isRevealed} />
      </div>

      {/* Subtitle Statement: Natural Follow-up Sequence */}
      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
        animate={
          isRevealed
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 22, filter: "blur(4px)" }
        }
        transition={{
          duration: 0.85,
          delay: 0.45,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="mt-6 md:mt-7 max-w-[680px] px-4 text-center select-none"
      >
        <p className="font-mono-custom text-[14px] sm:text-[16px] leading-[1.4] text-[#a1a1a1]">
          {PORTFOLIO_DATA.hero.subtitle}
        </p>
      </motion.div>

      {/* 3D Rotating Cylinder Carousel: Smooth Rise & Scale into Active Stage */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={
          isRevealed
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 35, scale: 0.96 }
        }
        transition={{
          duration: 0.95,
          delay: 0.65,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="w-full mt-8 md:mt-10 flex justify-center"
      >
        <Rotating3DCylinder />
      </motion.div>
    </section>
  );
}
