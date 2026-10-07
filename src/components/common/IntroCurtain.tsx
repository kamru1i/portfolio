"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroCurtainProps {
  brandName?: string;
  onFinish?: () => void;
}

export function IntroCurtain({
  brandName = "KAMRUL ISLAM",
  onFinish,
}: IntroCurtainProps) {
  const [stage, setStage] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    // Stage 1: letter reveal finishes around 1400ms
    const timerExit = setTimeout(() => {
      setStage("exit");
    }, 1700);

    // Stage 2: curtain finishes sliding down at ~2600ms
    const timerDone = setTimeout(() => {
      setStage("done");
      if (onFinish) onFinish();
    }, 2650);

    return () => {
      clearTimeout(timerExit);
      clearTimeout(timerDone);
    };
  }, [onFinish]);

  if (stage === "done") return null;

  const characters = brandName.split("");

  return (
    <AnimatePresence>
      <motion.div
        key="curtain"
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black overflow-hidden select-none pointer-events-auto"
        initial={{ y: 0 }}
        animate={
          stage === "exit"
            ? {
                y: "100%",
                transition: {
                  duration: 0.95,
                  ease: [0.76, 0, 0.24, 1], // Expo-like smooth curtain slide
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
                  filter: "blur(14px)",
                  scale: 1.15,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.75,
                  delay: 0.2 + index * 0.045,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
