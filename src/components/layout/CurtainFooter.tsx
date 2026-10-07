"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function CurtainFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // Step 1: Draw liquid chromatic metallic bands
      const w = width;
      const h = height;

      // Base silver / chrome gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#e8e8ec");
      grad.addColorStop(0.2, "#888892");
      grad.addColorStop(0.4, "#ffffff");
      grad.addColorStop(0.6, "#55555c");
      grad.addColorStop(0.8, "#d0d0d8");
      grad.addColorStop(1, "#9999a4");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Chromatic liquid ripples (Red, Green, Blue chromatic dispersion)
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.globalCompositeOperation = "color-dodge";
        ctx.beginPath();

        const hue = (t * 25 + i * 85) % 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.35)`;

        for (let x = 0; x <= w; x += 20) {
          const y =
            h * 0.5 +
            Math.sin(x * 0.004 + t * 1.5 + i * 1.2) * (h * 0.35) +
            Math.cos(x * 0.007 - t * 0.9) * (h * 0.15);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Metallic specular shine sweep
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sweepX = ((Math.sin(t * 0.8) + 1) * 0.5) * w;
      const sweepGrad = ctx.createRadialGradient(
        sweepX,
        h * 0.5,
        10,
        sweepX,
        h * 0.5,
        w * 0.4
      );
      sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
      sweepGrad.addColorStop(0.5, "rgba(200, 225, 255, 0.2)");
      sweepGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Step 2: Mask with the giant wordmark "KAMRUL ISLAM"
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Scale font size to fit canvas width cleanly
      const fontSize = Math.min(w * 0.12, h * 0.85);
      ctx.font = `400 ${fontSize}px Gambarino, serif`;
      ctx.fillText("KAMRUL ISLAM", w * 0.5, h * 0.52);
      ctx.restore();

      // Step 3: Subtle silver edge stroke
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `400 ${fontSize}px Gambarino, serif`;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = Math.max(1, fontSize * 0.008);
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

  return (
    <footer
      aria-label="Footer"
      className="fixed bottom-0 left-0 right-0 z-[1] w-full h-[450px] md:h-[510px] lg:h-[634px] bg-black text-white flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8 overflow-hidden pointer-events-auto select-none"
    >
      {/* Top Hairline Rule */}
      <div className="w-full">
        <HairlineRule />
      </div>

      {/* Giant Iridescent Chromatic Wordmark in Upper Center */}
      <div className="relative w-full h-[90px] sm:h-[160px] md:h-[240px] flex items-center justify-center mt-2">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Giant Central Navigation Links */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 my-auto">
        <Link
          href="#works"
          className="font-gambarino text-[20px] sm:text-[26px] md:text-[34px] uppercase text-white tracking-wider hover-underline-link transition-opacity hover:opacity-80"
        >
          WORK
        </Link>
        <Link
          href="#about"
          className="font-gambarino text-[20px] sm:text-[26px] md:text-[34px] uppercase text-white tracking-wider hover-underline-link transition-opacity hover:opacity-80"
        >
          ABOUT
        </Link>
        <a
          href={`mailto:${PORTFOLIO_DATA.brand.email}`}
          className="font-gambarino text-[20px] sm:text-[26px] md:text-[34px] uppercase text-white tracking-wider hover-underline-link transition-opacity hover:opacity-80"
        >
          CONTACT US
        </a>
      </div>

      {/* Lower Metadata & Social Links Bar */}
      <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-[12px] text-[#a1a1a1]">
        {/* Social Links Abbreviated (Gambarino 20px) */}
        <div className="flex items-center gap-5 font-gambarino text-[18px] sm:text-[20px] text-white">
          {PORTFOLIO_DATA.brand.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-underline-link hover:text-white transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Location & Copyright */}
        <div className="text-center">
          <span>{PORTFOLIO_DATA.footer.copyright}</span>
        </div>

        {/* Right Status */}
        <div className="text-center sm:text-right">
          <span>{PORTFOLIO_DATA.footer.locationNote}</span>
        </div>
      </div>
    </footer>
  );
}
