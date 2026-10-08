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
  className = "w-[539px] h-[78px]",
  fill = "currentColor",
}: KamrulBrandWordmarkProps) {
  return (
    <svg
      viewBox="0 0 539 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KAMRUL I"
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

      {/* --- M --- */}
      <path
        d="M170 0H192L210 46L228 0H250V78H230V24L216 58H204L190 24V78H170V0Z"
        fill={fill}
      />

      {/* --- R --- */}
      <path
        d="M246 0H306C319 0 327 9 327 23C327 34 320 41 310 44L328 78H304L288 48H268V78H246V0ZM268 16V33H301C305 33 307 30 307 25C307 20 305 16 301 16H268Z"
        fill={fill}
      />

      {/* --- U --- */}
      <path
        d="M324 0H346V54C346 61 349 64 355 64C361 64 364 61 364 54V0H386V54C386 70 375 78 355 78C335 78 324 70 324 54V0Z"
        fill={fill}
      />

      {/* --- L --- */}
      <path d="M394 0H416V62H448V78H394V0Z" fill={fill} />

      {/* --- I (Distinct Pillar) --- */}
      <path d="M464 0H488V78H464V0Z" fill={fill} />

      {/* --- Registered Trademark Mark ® --- */}
      <circle
        cx="516"
        cy="14"
        r="8"
        stroke={fill}
        strokeWidth="1.5"
        fill="none"
      />
      <text
        x="516"
        y="17"
        fontSize="8.5"
        fontFamily="sans-serif"
        fontWeight="900"
        fill={fill}
        textAnchor="middle"
      >
        R
      </text>
    </svg>
  );
}
