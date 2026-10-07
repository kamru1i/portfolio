"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function CurtainFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle ambient glowing wave shader on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle luminous wave ribbons
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - i * 0.02})`;

        for (let x = 0; x < width; x += 15) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.005 + t + i * 1.2) * 45 +
            Math.cos(x * 0.003 - t * 0.8) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

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
      className="fixed bottom-0 left-0 right-0 z-[1] w-full h-[580px] sm:h-[620px] md:h-[634px] bg-black text-white flex flex-col justify-between px-4 sm:px-8 md:px-12 py-10 overflow-hidden pointer-events-auto select-none"
    >
      {/* Top Hairline Rule */}
      <div className="w-full">
        <HairlineRule />
      </div>

      {/* Ambient Shader Canvas in Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Giant Central Navigation Links */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-4 md:space-y-6">
        {PORTFOLIO_DATA.footer.navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-gambarino text-3xl sm:text-4xl md:text-5xl lg:text-[44px] uppercase text-white tracking-wider hover-underline-link transition-opacity hover:opacity-80"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Lower Metadata & Social Links Bar */}
      <div className="relative z-10 w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-[12px] text-[#a1a1a1]">
        {/* Social Links Abbreviated */}
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

        {/* Location & Status */}
        <div className="text-center sm:text-right">
          <span>{PORTFOLIO_DATA.footer.locationNote}</span>
        </div>

        {/* Copyright */}
        <div>
          <span>{PORTFOLIO_DATA.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
