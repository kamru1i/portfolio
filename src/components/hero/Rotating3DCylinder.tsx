"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function Rotating3DCylinder() {
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startRotation, setStartRotation] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(Date.now());

  const cards = PORTFOLIO_DATA.hero.cards;
  const count = cards.length;
  const angleStep = 360 / count; // 72 deg

  // Continuous auto-rotation loop
  useEffect(() => {
    function animate() {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!isDragging && !isHoveredRef.current) {
        // ~18 degrees per second auto-rotation for smooth visible cinematic motion
        setRotation((prev) => (prev + 16 * dt) % 360);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDragging]);

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartRotation(rotation);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    // Map pixels to degrees
    setRotation(startRotation - deltaX * 0.4);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className="relative w-full py-8 flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: 1100 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* 3D Carousel Cylinder Stage */}
      <div
        className="relative flex items-center justify-center transition-transform duration-75"
        style={{
          width: "320px",
          height: "390px",
          transformStyle: "preserve-3d",
          transform: `rotateX(-7deg) rotateY(${rotation}deg)`,
        }}
      >
        {cards.map((card, i) => {
          const cardAngle = i * angleStep;

          return (
            <div
              key={card.id}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-6 transition-opacity"
              style={{
                width: "300px",
                height: "380px",
                transformStyle: "preserve-3d",
                transform: `rotateY(${cardAngle}deg) translateZ(286px)`,
                backgroundColor: card.color,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* Subtle Ambient Radial Light */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 70% 30%, ${card.accent} 0%, transparent 70%)`,
                }}
              />

              {/* Card Top Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono-custom text-[11px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                  {card.tag}
                </span>
                <span className="font-mono-custom text-[12px] text-white/50">
                  0{i + 1}
                </span>
              </div>

              {/* Center Graphic Silhouette */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mb-2"
                  style={{ borderColor: card.accent }}
                >
                  <div
                    className="w-10 h-10 rounded-full opacity-70"
                    style={{ backgroundColor: card.accent }}
                  />
                </div>
                <div className="h-0.5 w-16 bg-white/20 mt-2" />
              </div>

              {/* Card Bottom Content */}
              <div className="relative z-10">
                <h3 className="font-gambarino text-2xl text-white tracking-wide leading-tight">
                  {card.title}
                </h3>
                <p className="font-mono-custom text-[13px] text-white/60 mt-1">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
