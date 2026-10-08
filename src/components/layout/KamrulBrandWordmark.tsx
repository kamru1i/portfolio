"use client";

import React from "react";

interface KamrulBrandWordmarkProps {
  className?: string;
  fill?: string;
}

/**
 * Precision Architectural Vector Wordmark for "KAMRUL I®"
 * Recreating the Aurexa oversized brutalist/editorial aesthetic (539x78 aspect ratio)
 * with heavyweight geometric stems, aerodynamic cuts, and razor-sharp vector fidelity.
 */
export function KamrulBrandWordmark({
  className = "w-[440px] h-[78px]",
  fill = "currentColor",
}: KamrulBrandWordmarkProps) {
  return (
    <svg
      viewBox="0 0 440 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KAMRUL"
      role="img"
    >
      {/* --- K --- */}
      <path d="M0 0H24V78H0V0Z" fill={fill} />
      <path d="M22 41L64 0H92L44 45L92 78H64L22 47V41Z" fill={fill} />

      {/* --- A --- */}
      <path
        d="M88 78L120 0H144L176 78H151L145 61H119L113 78H88ZM125 45H139L132 20L125 45Z"
        fill={fill}
      />

      {/* --- M (Right stem at 228-250 is shared with R) --- */}
      <path
        d="M170 0H192L210 46L228 0H250V78H228V24L216 58H204L190 24V78H170V0Z"
        fill={fill}
      />

      {/* --- R (Branches off shared stem at X=250, zero double-stem artifact) --- */}
      <path
        d="M248 0H286C299 0 307 9 307 23C307 33 300 41 290 43L308 78H284L268 46H248V0ZM248 15V31H282C286 31 288 28 288 23C288 18 286 15 282 15H248Z"
        fill={fill}
      />

      {/* --- U --- */}
      <path
        d="M316 0H338V54C338 61 341 64 346 64C351 64 354 61 354 54V0H376V54C376 70 365 78 346 78C327 78 316 70 316 54V0Z"
        fill={fill}
      />

      {/* --- L --- */}
      <path d="M384 0H406V62H436V78H384V0Z" fill={fill} />
    </svg>
  );
}
