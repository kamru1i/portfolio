"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface EditorialListCardProps {
  children: ReactNode;
  href?: string;
  isHovered?: boolean;
  isDimmed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * EditorialListCard — Reusable FAQ/Aurexa Card Pattern
 * Unifies the visual language across Services, Milestones, and FAQ:
 * - Rounded 14px card geometry
 * - Charcoal dark surface (#1a1a1a) with subtle border (#ffffff14)
 * - Elevated hover border (#ffffff26) and background (#1e1e1e)
 * - Flexible for links (Services) or non-clickable rows (Milestones)
 */
export function EditorialListCard({
  children,
  href,
  isHovered = false,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  className = "",
  ariaLabel,
}: EditorialListCardProps) {
  const baseClasses = `relative w-full rounded-[14px] bg-[#1a1a1a] transition-all duration-300 border ${
    isHovered
      ? "border-white/20 bg-[#1e1e1e]/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      : "border-white/[0.08] hover:border-white/15 hover:bg-[#1c1c1c]"
  } ${isDimmed ? "opacity-35" : "opacity-100"} ${className}`;

  if (href) {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        className={baseClasses}
      >
        <Link
          href={href}
          aria-label={ariaLabel}
          className="w-full h-full block cursor-pointer"
        >
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className={baseClasses}
    >
      {children}
    </div>
  );
}
