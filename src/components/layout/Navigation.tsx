"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { KamrulBrandWordmark } from "./KamrulBrandWordmark";

interface NavigationProps {
  isRevealed?: boolean;
}

function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia("(min-width: 1024px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}
function getServerDesktopSnapshot() {
  return true;
}

export function Navigation({ isRevealed = true }: NavigationProps) {
  const [timeStr, setTimeStr] = useState<string>("00:00 PM");
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot
  );

  // Live Asia/Dhaka clock
  useEffect(() => {
    function updateClock() {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setTimeStr(formatted);
      } catch {
        setTimeStr("4:30 PM");
      }
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Continuous Aurexa-style scroll interpolation
  const { scrollY } = useScroll();

  // Scroll interpolation range: 0px -> 170px for full compaction
  const rawProgress = useTransform(scrollY, [0, 170], [0, 1], { clamp: true });
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 260,
    damping: 28,
    mass: 0.45,
    restDelta: 0.001,
  });

  // Motion values for smooth hardware-accelerated transformation
  // Desktop logo scale: 1.0 -> 0.42 (compresses from 539x78 down to 226x32.7)
  const logoScaleDesktop = useTransform(smoothProgress, [0, 1], [1, 0.42]);
  // Mobile logo scale: 1.0 -> 0.78
  const logoScaleMobile = useTransform(smoothProgress, [0, 1], [1, 0.78]);

  // Header vertical padding:
  // Initial: 26px top & bottom (generous top whitespace matching Aurexa reference)
  // Scrolled: 14px top & bottom (sleek compact header)
  const paddingYDesktop = useTransform(smoothProgress, [0, 1], ["26px", "14px"]);
  const paddingYMobile = useTransform(smoothProgress, [0, 1], ["18px", "12px"]);

  // Glassmorphic background and border interpolation
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 0.82]);
  const borderOpacity = useTransform(smoothProgress, [0, 1], [0, 0.09]);
  const blurPx = useTransform(smoothProgress, [0, 1], [0, 20]);
  const shadowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.5]);

  const activeLogoScale = isDesktop ? logoScaleDesktop : logoScaleMobile;
  const activePaddingY = isDesktop ? paddingYDesktop : paddingYMobile;

  // Background color string with animated opacity
  const backgroundColor = useTransform(
    bgOpacity,
    (v) => `rgba(8, 8, 8, ${v.toFixed(3)})`
  );
  const borderBottomColor = useTransform(
    borderOpacity,
    (v) => `rgba(255, 255, 255, ${v.toFixed(3)})`
  );
  const backdropFilter = useTransform(
    blurPx,
    (v) => `blur(${v.toFixed(1)}px)`
  );
  const boxShadow = useTransform(
    shadowOpacity,
    (v) =>
      v > 0.01
        ? `0 10px 30px -10px rgba(0, 0, 0, ${(v * 0.8).toFixed(2)})`
        : "none"
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{
        opacity: isRevealed ? 1 : 0,
        y: isRevealed ? 0 : -24,
      }}
      transition={{
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
        delay: 0.15,
      }}
      style={{
        backgroundColor,
        borderBottom: "1px solid",
        borderBottomColor,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        boxShadow,
        paddingTop: activePaddingY,
        paddingBottom: activePaddingY,
      }}
      className="fixed top-0 left-0 right-0 z-40 w-full px-5 sm:px-8 md:px-12 lg:px-16 pointer-events-auto transition-colors duration-150"
    >
      <nav className="w-full max-w-[1440px] mx-auto flex items-start justify-between text-white">
        {/* BRAND / LOGO: Aurexa-style oversized editorial brand -> smooth compaction */}
        <div className="flex-1 flex items-start justify-start min-w-0">
          <Link
            href="/"
            aria-label={`${PORTFOLIO_DATA.brand.displayName} Homepage`}
            className="group inline-flex items-start select-none"
          >
            <motion.div
              style={{
                scale: activeLogoScale,
                transformOrigin: "left top",
              }}
              className="will-change-transform flex items-start"
            >
              <KamrulBrandWordmark className="w-[200px] sm:w-[300px] md:w-[420px] lg:w-[539px] h-auto text-white group-hover:text-white/85 transition-colors" />
            </motion.div>
          </Link>
        </div>

        {/* CENTER-LEFT: Status & Availability (Aurexa-style pulsing beacon) */}
        <div className="hidden xl:flex items-center gap-2.5 px-6 font-mono-custom text-[13px] text-[#a1a1a1] pt-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">Available for Projects</span>
        </div>

        {/* CENTER: Location & Live Time (Desktop) */}
        <div className="hidden md:flex flex-col text-left font-mono-custom px-6 border-l border-white/[0.08] pt-1">
          <span className="text-[#8e8e8e] text-[12px] uppercase tracking-wider">
            Chittagong, BD
          </span>
          <span className="font-medium text-[#f0f0f0] text-[13px] tracking-wide mt-0.5">
            {timeStr}
          </span>
        </div>

        {/* CENTER-RIGHT: Project Inquiries Email (Desktop) */}
        <div className="hidden lg:flex flex-col text-left font-mono-custom px-6 border-l border-white/[0.08] pt-1">
          <span className="text-[#8e8e8e] text-[12px] uppercase tracking-wider">
            Project Inquiries
          </span>
          <a
            href={`mailto:${PORTFOLIO_DATA.brand.email}`}
            className="hover-underline-link mt-0.5 text-[13px] tracking-wide text-white"
          >
            {PORTFOLIO_DATA.brand.email}
          </a>
        </div>

        {/* RIGHT: Live Time (Mobile) + Action CTA Pill */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono-custom text-right ml-4 pt-1">
          <span className="md:hidden text-[12px] text-[#a1a1a1] tracking-wider">
            {timeStr}
          </span>
          <a
            href={`mailto:${PORTFOLIO_DATA.brand.email}`}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.15] border border-white/10 hover:border-white/25 text-white text-[13px] tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Contact
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
