"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { HeroTitle } from "./HeroTitle";
import { Rotating3DCylinder } from "./Rotating3DCylinder";

import { ScrambleSubtitle } from "./ScrambleSubtitle";

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

      {/* Subtitle Statement: Reference Scramble/Cipher Decrypt Animation */}
      <div className="mt-6 md:mt-7 max-w-[680px] px-4 text-center select-none">
        <ScrambleSubtitle
          text={PORTFOLIO_DATA.hero.subtitle}
          isRevealed={isRevealed}
          delay={0.35}
          speed={95}
          scrambledLetters={10}
        />
      </div>

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
