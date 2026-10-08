"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface ScrambleSubtitleProps {
  text: string;
  isRevealed: boolean;
  className?: string;
  delay?: number; // Delay in seconds before scramble starts
  speed?: number; // 1 to 100, matching Framer default (95)
  scrambledLetters?: number; // Number of leading scrambled glyphs (10)
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?~";

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMin === inMax) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

function generateRandomString(sourceText: string): string {
  let result = "";
  for (let i = 0; i < sourceText.length; i++) {
    const char = sourceText[i];
    if (char === " " || char === "\n" || char === "\t") {
      result += char;
    } else {
      result += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }
  }
  return result;
}

export function ScrambleSubtitle({
  text,
  isRevealed,
  className = "",
  delay = 0.25,
  speed = 95,
  scrambledLetters = 10,
}: ScrambleSubtitleProps) {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState<number>(0);
  const [scrambleString, setScrambleString] = useState<string>(() => generateRandomString(text));
  const animRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Tick step interval: map speed 1..100 to 0.2s..0.002s matching Framer's Ge(u, 1, 100, .2, .002)
  const charDuration = useMemo(() => mapRange(speed, 1, 100, 0.2, 0.002), [speed]);
  const totalDuration = useMemo(
    () => charDuration * (text.length + scrambledLetters),
    [charDuration, text.length, scrambledLetters]
  );

  useEffect(() => {
    if (!isRevealed || shouldReduceMotion) {
      return;
    }

    let delayTimer: NodeJS.Timeout | null = null;

    delayTimer = setTimeout(() => {
      // Periodic scramble character shuffle
      intervalRef.current = setInterval(() => {
        setScrambleString(generateRandomString(text));
      }, Math.max(charDuration * 1000, 30));

      // Continuous linear progress animation
      const startLoop = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = (time - startTimeRef.current) / 1000;
        const currentProgress = Math.min(elapsed / totalDuration, 1);
        setProgress(currentProgress);

        if (currentProgress < 1) {
          animRef.current = requestAnimationFrame(startLoop);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };

      animRef.current = requestAnimationFrame(startLoop);
    }, delay * 1000);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRevealed, shouldReduceMotion, delay, totalDuration, charDuration, text]);

  if (shouldReduceMotion) {
    return (
      <p className={`font-mono-custom text-[14px] sm:text-[16px] leading-[1.4] text-[#a1a1a1] select-none ${className}`}>
        {text}
      </p>
    );
  }

  // Exact 3-stage slicing from Framer's ScrambleText component
  const leftIndex = clamp(
    Math.floor(mapRange(progress, 0, 1, -scrambledLetters, text.length)),
    0,
    text.length
  );
  const rightIndex = clamp(
    Math.floor(mapRange(progress, 0, 1, 0, text.length + scrambledLetters)),
    0,
    text.length
  );

  const resolvedPart = text.substring(0, leftIndex);
  const scrambledPart = scrambleString.substring(leftIndex, rightIndex);
  const upcomingPart = text.substring(rightIndex);

  return (
    <p
      className={`font-mono-custom text-[14px] sm:text-[16px] leading-[1.4] select-none pointer-events-none ${className}`}
      style={{
        color: "#a1a1a1",
        letterSpacing: "0em",
      }}
    >
      {/* 1. Resolved settled text in neutral grey #a1a1a1 */}
      <span>{resolvedPart}</span>

      {/* 2. Leading scrambled glyphs in bright white #ffffff */}
      {scrambledPart.length > 0 && (
        <span style={{ color: "#ffffff", fontWeight: 500 }}>{scrambledPart}</span>
      )}

      {/* 3. Upcoming undiscovered text kept in DOM with opacity: 0 to lock layout & wrapping */}
      {upcomingPart.length > 0 && (
        <span style={{ opacity: 0 }}>{upcomingPart}</span>
      )}
    </p>
  );
}
