"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export interface ScrambleRevealTextProps {
  text: string;
  isRevealed: boolean;
  tag?: "h1" | "h2" | "p" | "span" | "div";
  className?: string;
  delay?: number; // Delay in seconds before scramble starts
  stagger?: number; // Time in seconds between each letter resolving (e.g. 0.075s)
  initialScrambleTime?: number; // Minimum chaos time before first letter resolves (e.g. 0.25s)
  tickSpeed?: number; // Milliseconds between glyph flips (e.g. 40ms)
  resolvedColor?: string; // Text color when resolved
  scrambleColor?: string; // Text color while actively scrambling
  characters?: string; // Custom character set for glyph generation
  onComplete?: () => void;
}

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?~";

export function ScrambleRevealText({
  text,
  isRevealed,
  tag: Tag = "div",
  className = "",
  delay = 0.15,
  stagger = 0.07,
  initialScrambleTime = 0.25,
  tickSpeed = 40,
  resolvedColor = "#ffffff",
  scrambleColor = "#a1a1a1",
  characters = DEFAULT_CHARACTERS,
  onComplete,
}: ScrambleRevealTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [resolvedIndex, setResolvedIndex] = useState<number>(-1);
  const [activeGlyphs, setActiveGlyphs] = useState<string[]>(() =>
    Array.from({ length: text.length }, () => characters[Math.floor(Math.random() * characters.length)])
  );
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const getRandomGlyph = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  useEffect(() => {
    if (!isRevealed || shouldReduceMotion) {
      return;
    }

    timerRef.current = setTimeout(() => {
      setHasStarted(true);

      // 1. High-frequency glyph shuffle interval for actively scrambling characters
      intervalRef.current = setInterval(() => {
        setActiveGlyphs((prev) =>
          prev.map((_, i) => (text[i] === " " ? " " : getRandomGlyph()))
        );
      }, tickSpeed);

      // 2. Continuous time-based resolution loop
      const runLoop = (now: number) => {
        if (!startTimeRef.current) startTimeRef.current = now;
        const elapsed = (now - startTimeRef.current) / 1000;

        // Calculate how many characters should be resolved by now
        if (elapsed >= initialScrambleTime) {
          const resolveProgress = elapsed - initialScrambleTime;
          const targetIndex = Math.min(
            Math.floor(resolveProgress / stagger),
            text.length
          );
          setResolvedIndex((prev) => (targetIndex > prev ? targetIndex : prev));

          if (targetIndex >= text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (onCompleteRef.current) onCompleteRef.current();
            return;
          }
        }

        rafRef.current = requestAnimationFrame(runLoop);
      };

      rafRef.current = requestAnimationFrame(runLoop);
    }, delay * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    isRevealed,
    shouldReduceMotion,
    delay,
    stagger,
    initialScrambleTime,
    tickSpeed,
    text,
    getRandomGlyph,
  ]);

  // Reduced motion fallback: instantly render final text
  if (shouldReduceMotion) {
    return (
      <Tag className={`select-none ${className}`} style={{ color: resolvedColor }}>
        {text}
      </Tag>
    );
  }

  // Pre-split text into words to guarantee 100% natural and responsive word wrapping
  const words = text.split(" ");
  let globalCharIndex = 0;

  return (
    <Tag
      className={`select-none ${className}`}
      aria-label={text}
      style={{
        opacity: hasStarted ? 1 : 0,
        transition: "opacity 0.2s ease-out",
      }}
    >
      <span aria-hidden="true" className="contents">
        {words.map((word, wordIndex) => {
          const wordChars = word.split("");
          return (
            <span
              key={wordIndex}
              className="inline-block whitespace-nowrap"
              style={{
                marginRight: wordIndex < words.length - 1 ? "0.28em" : "0",
              }}
            >
              {wordChars.map((targetChar) => {
                const charIdx = globalCharIndex++;
                const isResolved = resolvedIndex >= charIdx;
                const displayChar = isResolved ? targetChar : activeGlyphs[charIdx] || targetChar;

                return (
                  <span
                    key={charIdx}
                    className="relative inline-block overflow-visible"
                    style={{
                      lineHeight: "inherit",
                    }}
                  >
                    {/* Invisible ghost character locking cell dimensions with zero layout shift */}
                    <span className="invisible select-none pointer-events-none">
                      {targetChar}
                    </span>

                    {/* Visible animated glyph strictly locked to cell bounds */}
                    <span
                      className="absolute inset-0 flex items-center justify-center select-none"
                      style={{
                        color: isResolved ? resolvedColor : scrambleColor,
                        transition: isResolved
                          ? "color 0.15s ease-out, filter 0.2s ease-out"
                          : "none",
                        filter: isResolved ? "none" : "brightness(0.95)",
                      }}
                    >
                      {displayChar}
                    </span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
