"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface IntroCurtainProps {
  brandName?: string;
  onReveal?: () => void;
  onComplete?: () => void;
}

export function IntroCurtain({
  brandName = "KAMRUL ISLAM",
  onReveal,
  onComplete,
}: IntroCurtainProps) {
  const [stage, setStage] = useState<"enter" | "exit" | "done">("enter");
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Stage 1: Brand text reveals via blurIn stagger, holds until 1650ms
    const timerExit = setTimeout(() => {
      setStage("exit");
      if (onRevealRef.current) {
        onRevealRef.current();
      }
    }, 1650);

    // Stage 2: Curtain finishes sliding down completely at 2550ms
    const timerDone = setTimeout(() => {
      setStage("done");
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 2550);

    return () => {
      clearTimeout(timerExit);
      clearTimeout(timerDone);
    };
  }, []);

  if (stage === "done") return null;

  const characters = brandName.split("");

  return (
    <motion.div
      key="intro-curtain"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden select-none ${
        stage === "exit" ? "pointer-events-none" : "pointer-events-auto"
      }`}
      initial={{ y: 0 }}
      animate={
        stage === "exit"
          ? {
              y: "100%",
              transition: {
                duration: 0.85,
                ease: [0.76, 0, 0.24, 1], // Exact theatrical curtain slide curve
              },
            }
          : { y: 0 }
      }
    >
      <div className="flex flex-wrap items-center justify-center px-4 max-w-full">
        <h1 className="font-gambarino text-4xl sm:text-6xl md:text-8xl lg:text-[100px] tracking-[-0.01em] uppercase text-white flex flex-wrap justify-center leading-[0.95em]">
          {characters.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              initial={{
                opacity: 0,
                filter: "blur(12px)",
                scale: 1.12,
                y: 14,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.15 + index * 0.05,
                ease: [0.645, 0.045, 0.355, 1], // Exact cubic-bezier from reference
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
      </div>
    </motion.div>
  );
}
