"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { KamrulBrandWordmark } from "./KamrulBrandWordmark";

export function CurtainFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeStr, setTimeStr] = useState<string>("11:45 PM (GMT +6)");

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
        setTimeStr(`${formatted} (GMT +6)`);
      } catch {
        setTimeStr("11:45 PM (GMT +6)");
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Iridescent Liquid Chrome Wordmark Shader Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      const w = width;
      const h = height;

      // Base silver / chrome metallic gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#f0f0f4");
      grad.addColorStop(0.2, "#8c8c96");
      grad.addColorStop(0.4, "#ffffff");
      grad.addColorStop(0.6, "#5a5a62");
      grad.addColorStop(0.8, "#d5d5dc");
      grad.addColorStop(1, "#9e9ea8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Chromatic dispersion ripples
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.globalCompositeOperation = "color-dodge";
        ctx.beginPath();

        const hue = (t * 22 + i * 85) % 360;
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, 0.38)`;

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
        ctx.restore();
      }

      // Specular shine sweep across letters
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sweepX = ((Math.sin(t * 0.7) + 1) * 0.5) * w;
      const sweepGrad = ctx.createRadialGradient(
        sweepX,
        h * 0.5,
        15,
        sweepX,
        h * 0.5,
        w * 0.45
      );
      sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      sweepGrad.addColorStop(0.5, "rgba(210, 230, 255, 0.25)");
      sweepGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Step 2: Mask with the giant wordmark "KAMRUL ISLAM" spanning ~96% width
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Dynamically calculate font size so wordmark spans edge-to-edge
      let fontSize = h * 0.88;
      ctx.font = `400 ${fontSize}px Gambarino, serif`;
      let textWidth = ctx.measureText("KAMRUL ISLAM").width;
      if (textWidth > w * 0.96) {
        fontSize = fontSize * ((w * 0.96) / textWidth);
        ctx.font = `400 ${fontSize}px Gambarino, serif`;
      }

      ctx.fillText("KAMRUL ISLAM", w * 0.5, h * 0.52);
      ctx.restore();

      // Step 3: Beveled metallic edge stroke
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `400 ${fontSize}px Gambarino, serif`;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = Math.max(1, fontSize * 0.007);
      ctx.strokeText("KAMRUL ISLAM", w * 0.5, h * 0.52);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
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
      aria-label="Footer"
      className="fixed bottom-0 left-0 right-0 z-[1] w-full h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] bg-black text-white flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8 overflow-hidden pointer-events-auto select-none"
    >
      {/* Top Hairline Rule */}
      <div className="w-full">
        <HairlineRule />
      </div>

      {/* Patrick Jane Top Metadata Row */}
      <div className="w-full flex items-center justify-between text-[#888] font-mono-custom text-xs pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <KamrulBrandWordmark className="h-4 w-auto inline-block text-white" />
          <span className="text-[#555] hidden sm:inline">|</span>
          <span className="hidden sm:inline">Creative Technologist</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80">{timeStr}</span>
          </div>

          <a
            href={`mailto:${PORTFOLIO_DATA.brand.email}`}
            className="hover-underline-link text-white/90 hover:text-white transition-colors hidden md:inline"
          >
            {PORTFOLIO_DATA.brand.email}
          </a>
        </div>
      </div>

      {/* Giant Iridescent Chromatic Wordmark: Full Width Scale */}
      <div className="relative w-full h-[140px] sm:h-[190px] md:h-[260px] lg:h-[300px] flex items-center justify-center my-auto">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Giant Central Navigation Links (Patrick Jane Editorial Hierarchy) */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2.5 sm:space-y-3.5 my-auto">
        <Link
          href="/#projects"
          onClick={(e) => handleAnchorClick(e, "/#projects")}
          className="font-gambarino text-2xl sm:text-3xl md:text-[38px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          PROJECTS &amp; WORKS
        </Link>
        <Link
          href="/#about"
          onClick={(e) => handleAnchorClick(e, "/#about")}
          className="font-gambarino text-2xl sm:text-3xl md:text-[38px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          ABOUT
        </Link>
        <Link
          href="/contact-us"
          className="font-gambarino text-2xl sm:text-3xl md:text-[38px] uppercase text-white tracking-widest hover-underline-link transition-opacity hover:opacity-80"
        >
          CONTACT US
        </Link>
      </div>

      {/* Lower Metadata & Social Links Bar */}
      <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-xs text-[#a1a1a1]">
        {/* Left: Social Links in Gambarino */}
        <div className="flex items-center gap-5 font-gambarino text-lg sm:text-xl text-white">
          {PORTFOLIO_DATA.brand.socials.map((social) => (
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
          <span>{PORTFOLIO_DATA.footer.copyright}</span>
        </div>

        {/* Right: Location & Availability Note */}
        <div className="text-center sm:text-right">
          <span>{PORTFOLIO_DATA.footer.locationNote}</span>
        </div>
      </div>
    </footer>
  );
}
