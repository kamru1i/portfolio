"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeroTitleProps {
  text: string;
  isRevealed: boolean;
  className?: string;
}

export function HeroTitle({ text, isRevealed, className = "" }: HeroTitleProps) {
  const shouldReduceMotion = useReducedMotion();

  // Split by words first so that words never break awkwardly across lines on smaller screens
  const words = text.split(" ");
  let globalCharIndex = 0;

  if (shouldReduceMotion) {
    return (
      <h1
        className={`w-full flex flex-wrap items-start justify-center font-gambarino text-[52px] md:text-[110px] xl:text-[180px] text-[clamp(52px,12.5vw,180px)] leading-[0.92em] sm:leading-[0.95em] tracking-[-0.02em] text-white uppercase text-center select-none ${className}`}
      >
        {text}
      </h1>
    );
  }

  return (
    <h1
      className={`w-full flex flex-wrap items-start justify-center font-gambarino text-[52px] md:text-[110px] xl:text-[180px] text-[clamp(52px,12.5vw,180px)] leading-[0.92em] sm:leading-[0.95em] tracking-[-0.02em] text-white uppercase text-center select-none ${className}`}
      style={{
        perspective: "1200px",
      }}
    >
      {words.map((word, wordIndex) => {
        const chars = word.split("");
        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{
              marginRight: wordIndex < words.length - 1 ? "0.28em" : "0",
            }}
          >
            {chars.map((char) => {
              const charIndex = globalCharIndex++;
              return (
                <span
                  key={charIndex}
                  className="inline-block overflow-visible relative"
                  style={{
                    perspective: "800px",
                  }}
                >
                  <motion.span
                    className="inline-block relative"
                    style={{
                      transformOrigin: "center center",
                      willChange: "transform, filter, clip-path",
                    }}
                    initial={{
                      clipPath: "inset(100% -50% 0 -50%)",
                      opacity: 0,
                      rotateX: 40,
                      filter: "blur(5px)",
                      y: 35,
                    }}
                    animate={
                      isRevealed
                        ? {
                            clipPath: "inset(-50% -50% -50% -50%)",
                            opacity: 1,
                            rotateX: 0,
                            filter: "blur(0px)",
                            y: 0,
                          }
                        : {
                            clipPath: "inset(100% -50% 0 -50%)",
                            opacity: 0,
                            rotateX: 40,
                            filter: "blur(5px)",
                            y: 35,
                          }
                    }
                    transition={{
                      duration: 1.0,
                      delay: charIndex * 0.055,
                      ease: [0.645, 0.045, 0.355, 1], // Exact cubic-bezier from reference
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
