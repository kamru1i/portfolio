"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HairlineRule } from "@/components/common/HairlineRule";
import { BRAND_CONFIG, FOOTER_CONFIG } from "@/lib/brand-config";
import { useDhakaClock } from "@/hooks/useDhakaClock";
import { KamrulBrandWordmark } from "./KamrulBrandWordmark";

export function CurtainFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeStr = useDhakaClock("11:45 PM (GMT +6)");

  // Iridescent Liquid Chrome Wordmark Shader Canvas (cross-browser & iOS Safari WebKit safe)
  // Pauses 60fps animation when occluded behind <main>, when tab is hidden, or under prefers-reduced-motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isDisposed = false;
    let animationFrameId: number | null = null;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = reducedMotionQuery.matches;
    const mainEl = document.querySelector("main");
    let isRevealed = true;

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);
    let width = Math.max(1, Math.floor(canvas.offsetWidth * getDpr()));
    let height = Math.max(1, Math.floor(canvas.offsetHeight * getDpr()));
    canvas.width = width;
    canvas.height = height;

    let cachedFontFamily = getComputedStyle(canvas).fontFamily || "Gambarino, serif";
    let cachedFontSize = 16;
    let cachedGrad = ctx.createLinearGradient(0, 0, width, height);

    const recomputeMetrics = () => {
      if (!canvas) return;
      cachedFontFamily = getComputedStyle(canvas).fontFamily || "Gambarino, serif";
      const refSize = 100;
      ctx.font = `400 ${refSize}px ${cachedFontFamily}`;
      const measuredRefWidth = ctx.measureText("KAMRUL ISLAM").width;
      const safeRefWidth = measuredRefWidth > 10 ? measuredRefWidth : refSize * 6.5;
      cachedFontSize = Math.max(
        16,
        Math.floor(Math.min(height * 0.82, refSize * ((width * 0.96) / safeRefWidth)))
      );

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#f0f0f4");
      grad.addColorStop(0.2, "#8c8c96");
      grad.addColorStop(0.4, "#ffffff");
      grad.addColorStop(0.6, "#5a5a62");
      grad.addColorStop(0.8, "#d5d5dc");
      grad.addColorStop(1, "#9e9ea8");
      cachedGrad = grad;
    };

    recomputeMetrics();

    let t = 0;

    const drawFrame = (advanceTime: boolean) => {
      if (advanceTime) {
        t += 0.02;
      }
      const w = width;
      const h = height;
      const fontSize = cachedFontSize;
      const fontSpec = `400 ${fontSize}px ${cachedFontFamily}`;

      ctx.clearRect(0, 0, w, h);

      // Step 1: Draw the "KAMRUL ISLAM" glyph mask FIRST onto the cleared canvas (alpha = 1 inside letters, 0 outside)
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = fontSpec;
      ctx.fillStyle = "#ffffff";
      ctx.fillText("KAMRUL ISLAM", w * 0.5, h * 0.52);
      ctx.restore();

      // Step 2: Paint cached base silver / chrome metallic gradient ONLY where glyph alpha > 0 (source-atop)
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = cachedGrad;
      ctx.fillRect(0, 0, w, h);

      // Chromatic dispersion ripples locked strictly inside the glyph alpha mask
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const hue = (t * 22 + i * 85) % 360;
        ctx.fillStyle = `hsla(${hue}, 85%, 68%, 0.34)`;

        for (let x = 0; x <= w; x += 16) {
          const y =
            h * 0.5 +
            Math.sin(x * 0.005 + t + i * 1.5) * h * 0.35 +
            Math.cos(x * 0.009 - t * 0.8) * h * 0.2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }

      // Specular shine sweep across letters locked strictly inside the glyph alpha mask
      const sweepX = ((Math.sin(t * 0.7) + 1) * 0.5) * w;
      const sweepGrad = ctx.createRadialGradient(
        sweepX,
        h * 0.5,
        10,
        sweepX,
        h * 0.5,
        w * 0.45
      );
      sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0.78)");
      sweepGrad.addColorStop(0.5, "rgba(210, 230, 255, 0.22)");
      sweepGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Step 3: Beveled metallic edge stroke
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = fontSpec;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = Math.max(1, fontSize * 0.007);
      ctx.strokeText("KAMRUL ISLAM", w * 0.5, h * 0.52);
      ctx.restore();
    };

    const shouldAnimate = (): boolean => {
      return !prefersReducedMotion && !document.hidden && isRevealed;
    };

    const loop = () => {
      if (!shouldAnimate()) {
        animationFrameId = null;
        return;
      }
      drawFrame(true);
      animationFrameId = requestAnimationFrame(loop);
    };

    const syncLoopState = () => {
      if (shouldAnimate()) {
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(loop);
        }
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const updateRevealStatus = () => {
      isRevealed = mainEl
        ? mainEl.getBoundingClientRect().bottom < window.innerHeight + 60
        : true;
      syncLoopState();
    };

    const handleResize = () => {
      if (!canvas || isDisposed) return;
      const dpr = getDpr();
      width = canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
      height = canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
      recomputeMetrics();
      isRevealed = mainEl
        ? mainEl.getBoundingClientRect().bottom < window.innerHeight + 60
        : true;
      drawFrame(false);
      syncLoopState();
    };

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      drawFrame(false);
      syncLoopState();
    };

    // Always paint an initial crisp frame immediately so reveal has zero blank flash
    updateRevealStatus();
    drawFrame(false);

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", updateRevealStatus, { passive: true });
    document.addEventListener("visibilitychange", syncLoopState);
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready
        .then(() => {
          if (!isDisposed) {
            handleResize();
          }
        })
        .catch(() => {});
    }

    return () => {
      isDisposed = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRevealStatus);
      document.removeEventListener("visibilitychange", syncLoopState);
      reducedMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") || href.startsWith("/#")) {
      const hash = href.startsWith("/#") ? href.slice(1) : href;
      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        const lenis = (window as unknown as { lenis?: { scrollTo: (target: Element | string, options?: { offset?: number; duration?: number }) => void } }).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(element, { offset: -80, duration: 1.2 });
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
        window.history.pushState(null, "", hash);
      }
    }
  };

  return (
    <footer
      id="contact"
      aria-label="Footer"
      className="fixed bottom-0 left-0 right-0 z-1 w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] bg-black text-white flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8 overflow-hidden pointer-events-auto select-none"
    >
      {/* Top Hairline Rule */}
      <div className="w-full">
        <HairlineRule />
      </div>

      {/* Top Metadata Row */}
      <div className="w-full flex items-center justify-between gap-2 text-[#888] font-mono-custom text-[11px] sm:text-xs pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <KamrulBrandWordmark className="h-3.5 sm:h-4 w-auto inline-block text-white" />
          <span className="text-[#555] hidden sm:inline">|</span>
          <span className="hidden sm:inline">Creative Technologist</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-white/80">{timeStr}</span>
          </div>

          <a
            href={`mailto:${BRAND_CONFIG.email}`}
            className="hover-underline-link text-white/90 hover:text-white transition-colors hidden md:inline whitespace-nowrap"
          >
            {BRAND_CONFIG.email}
          </a>
        </div>
      </div>

      {/* Giant Iridescent Chromatic Wordmark: Full Width Scale */}
      <div className="relative w-full h-[80px] sm:h-[140px] md:h-[240px] lg:h-[290px] flex items-center justify-center my-auto">
        <canvas ref={canvasRef} aria-hidden="true" className="w-full h-full block font-gambarino" />
      </div>

      {/* Giant Central Navigation Links (Editorial Hierarchy) */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2.5 my-auto">
        <Link
          href="/#projects"
          onClick={(e) => handleAnchorClick(e, "/#projects")}
          className="font-gambarino text-xl sm:text-2xl md:text-[34px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          PROJECTS &amp; WORKS
        </Link>
        <Link
          href="/#about"
          onClick={(e) => handleAnchorClick(e, "/#about")}
          className="font-gambarino text-xl sm:text-2xl md:text-[34px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          ABOUT
        </Link>
        <Link
          href="/cv"
          className="font-gambarino text-xl sm:text-2xl md:text-[34px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          CURRICULUM VITAE
        </Link>
        <Link
          href="/contact-us"
          className="font-gambarino text-xl sm:text-2xl md:text-[34px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          CONTACT US
        </Link>
      </div>

      {/* Lower Metadata & Social Links Bar */}
      <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-xs text-[#a1a1a1]">
        {/* Left: Social Links in Gambarino */}
        <div className="flex items-center gap-5 font-gambarino text-lg sm:text-xl text-white">
          {BRAND_CONFIG.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="hover-underline-link hover:text-white transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Center: Copyright */}
        <div className="text-center">
          <span>{FOOTER_CONFIG.copyright}</span>
        </div>

        {/* Right: Location & Availability Note */}
        <div className="text-center sm:text-right">
          <span>{FOOTER_CONFIG.locationNote}</span>
        </div>
      </div>
    </footer>
  );
}
