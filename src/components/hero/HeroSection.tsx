"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { HeroTitle } from "./HeroTitle";
import { Rotating3DCylinder } from "./Rotating3DCylinder";
import { ScrambleRevealText } from "@/components/common/ScrambleRevealText";

interface HeroSectionProps {
  isRevealed?: boolean;
}

export function HeroSection({ isRevealed = true }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center pt-24 sm:pt-28 lg:pt-24 pb-12 sm:pb-16 lg:pb-16 px-4 overflow-hidden">
      {/* Coordinated Editorial Hero Composition: Title -> Subtitle -> 3D Cylinder */}
      <div className="w-full flex flex-col items-center my-auto">
        {/* Massive Editorial Display Wordmark with Typographic Scramble-Resolution Reveal */}
        <div className="w-full text-center select-none">
          <HeroTitle text={PORTFOLIO_DATA.hero.wordmark} isRevealed={isRevealed} />
        </div>

      {/* Subtitle Statement: Coordinated Scramble-Resolution Sequence */}
      <div className="mt-7 md:mt-8 max-w-[680px] px-4 text-center select-none">
        <ScrambleRevealText
          text={PORTFOLIO_DATA.hero.subtitle}
          isRevealed={isRevealed}
          tag="p"
          delay={0.4}
          stagger={0.016}
          initialScrambleTime={0.15}
          tickSpeed={35}
          resolvedColor="#a1a1a1"
          scrambleColor="#ffffff"
          className="font-mono-custom text-[14px] sm:text-[16px] leading-[1.4] text-center select-none"
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
          delay: 0.75,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="w-full mt-9 md:mt-11 flex justify-center"
      >
        <Rotating3DCylinder />
      </motion.div>
      </div>
    </section>
  );
}
