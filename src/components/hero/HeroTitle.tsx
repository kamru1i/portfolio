"use client";

import { ScrambleRevealText } from "@/components/common/ScrambleRevealText";

interface HeroTitleProps {
  text: string;
  isRevealed: boolean;
  className?: string;
  onComplete?: () => void;
}

export function HeroTitle({ text, isRevealed, className = "", onComplete }: HeroTitleProps) {
  return (
    <ScrambleRevealText
      text={text}
      isRevealed={isRevealed}
      tag="h1"
      delay={0.12}
      stagger={0.065}
      initialScrambleTime={0.22}
      tickSpeed={38}
      resolvedColor="#ffffff"
      scrambleColor="#a1a1a1"
      onComplete={onComplete}
      className={`w-full flex flex-wrap items-start justify-center font-gambarino text-[52px] md:text-[110px] xl:text-[180px] text-[clamp(52px,12.5vw,180px)] leading-[0.95em] tracking-[-0.02em] uppercase text-center select-none ${className}`}
    />
  );
}
