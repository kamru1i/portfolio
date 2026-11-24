"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      return;
    }

    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId: number | null = null;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    const startRaf = () => {
      if (rafId === null && !document.hidden) {
        rafId = requestAnimationFrame(raf);
      }
    };

    const stopRaf = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRaf();
      } else {
        startRaf();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startRaf();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopRaf();
      lenisRef.current = null;
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, [isAdminRoute]);

  return <>{children}</>;
}
