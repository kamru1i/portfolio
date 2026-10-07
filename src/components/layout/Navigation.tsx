"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface NavigationProps {
  initialDelay?: number;
}

export function Navigation({ initialDelay = 2.3 }: NavigationProps) {
  const [timeStr, setTimeStr] = useState<string>("00:00 PM");
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);

  const [hasInitialAnimated, setHasInitialAnimated] = useState<boolean>(false);

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

  // Set initial animation complete after initialDelay
  useEffect(() => {
    const t = setTimeout(() => {
      setHasInitialAnimated(true);
    }, (initialDelay + 0.5) * 1000);
    return () => clearTimeout(t);
  }, [initialDelay]);

  // Reference scroll behavior: hides on scroll down, reveals when scrolled back to top
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -86 }}
      animate={{
        opacity: 1,
        y: isScrolledDown ? -86 : 0,
      }}
      transition={{
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1],
        delay: hasInitialAnimated ? 0 : initialDelay,
      }}
      className="fixed top-0 left-0 right-0 z-40 w-full px-4 sm:px-6 md:px-8 py-5 mix-blend-difference pointer-events-auto"
    >
      <nav className="w-full flex items-start justify-between font-mono-custom text-[15px] sm:text-[16px] leading-[1.2] text-white">
        {/* Brand */}
        <div className="flex-1">
          <Link
            href="/"
            className="tracking-wider uppercase hover:opacity-80 transition-opacity"
          >
            {PORTFOLIO_DATA.brand.displayName}
          </Link>
        </div>

        {/* Location & Live Time (Desktop / Tablet) */}
        <div className="hidden md:flex flex-col flex-1 pl-4">
          <span className="text-[#a1a1a1] text-[13px] sm:text-[14px]">
            Chittagong, BD
          </span>
          <span className="font-medium text-[#fafafa] tracking-wide mt-0.5">
            {timeStr}
          </span>
        </div>

        {/* Project Inquiries Email (Desktop) */}
        <div className="hidden lg:flex flex-col flex-1 pl-4">
          <span className="text-[#a1a1a1] text-[13px] sm:text-[14px]">
            Project Inquiries
          </span>
          <a
            href={`mailto:${PORTFOLIO_DATA.brand.email}`}
            className="hover-underline-link mt-0.5 tracking-wide text-white"
          >
            {PORTFOLIO_DATA.brand.email}
          </a>
        </div>

        {/* Contact Action */}
        <div className="flex items-center gap-4 text-right">
          <span className="md:hidden text-[13px] text-[#a1a1a1]">{timeStr}</span>
          <a
            href={`mailto:${PORTFOLIO_DATA.brand.email}`}
            className="hover-underline-link text-white tracking-wider"
          >
            Contact
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
