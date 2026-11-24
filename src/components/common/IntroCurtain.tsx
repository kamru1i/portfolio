"use client";

import { m } from "motion/react";
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
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onRevealRef.current = onReveal;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem("ki_intro_seen") === "1";
    } catch {}

    if (prefersReducedMotion || hasSeenIntro) {
      const immediateTimer = setTimeout(() => {
        onRevealRef.current?.();
        setStage("done");
        onCompleteRef.current?.();
      }, 0);
      return () => clearTimeout(immediateTimer);
    }

    try {
      sessionStorage.setItem("ki_intro_seen", "1");
    } catch {}

    // Stage 1: Brand text reveals cleanly, holds until 850ms
    const timerExit = setTimeout(() => {
      setStage("exit");
      if (onRevealRef.current) {
        onRevealRef.current();
      }
    }, 850);

    // Stage 2: Curtain finishes sliding down completely at 1550ms
    const timerDone = setTimeout(() => {
      setStage("done");
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 1550);

    return () => {
      clearTimeout(timerExit);
      clearTimeout(timerDone);
    };
  }, []);

  if (stage === "done") return null;

  const characters = brandName.split("");

  return (
    <m.div
      key="intro-curtain"
      className={`fixed inset-0 z-999 flex flex-col items-center justify-center bg-black overflow-hidden select-none ${
        stage === "exit" ? "pointer-events-none" : "pointer-events-auto"
      }`}
      initial={{ y: 0 }}
      animate={
        stage === "exit"
          ? {
              y: "-100%",
              transition: {
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1], // Exact theatrical curtain slide curve
              },
            }
          : { y: 0 }
      }
    >
      <div className="flex flex-wrap items-center justify-center px-4 max-w-full" aria-hidden="true">
        <div className="font-gambarino text-4xl sm:text-6xl md:text-8xl lg:text-[100px] tracking-[-0.01em] uppercase text-white flex flex-wrap justify-center leading-[0.95em]">
          {characters.map((char, index) => (
            <m.span
              key={index}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              initial={{
                opacity: 0,
                scale: 1.08,
                y: 14,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.04,
                ease: [0.645, 0.045, 0.355, 1], // Exact cubic-bezier from reference
              }}
            >
              {char === " " ? "\u00A0" : char}
            </m.span>
          ))}
        </div>
      </div>
    </m.div>
  );
}
