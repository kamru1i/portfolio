"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function Rotating3DCylinder() {
  const [rotation, setRotation] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cards = [
    { id: 1, image: "/images/hero-card-1.png", title: "AI Visual Storytelling" },
    { id: 2, image: "/images/hero-card-2.png", title: "Automotive Cinema" },
    { id: 3, image: "/images/hero-card-3.png", title: "Full-Stack Web Systems" },
    { id: 4, image: "/images/hero-card-4.png", title: "Digital Infrastructure" },
    { id: 5, image: "/images/hero-card-5.png", title: "Social Campaign Edits" },
  ];

  const count = cards.length;
  const angleStep = 360 / count; // 72 deg
  const radius = 286.287; // exact radius from reference

  // Continuous physics animation loop with momentum and gentle auto-rotation
  useEffect(() => {
    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.05) {
          // Apply friction damping to throw velocity
          setRotation((prev) => (prev + velocityRef.current * dt * 60) % 360);
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else if (!isHoveredRef.current) {
          // Gentle cinematic auto-rotation (~2.4 deg per second)
          setRotation((prev) => (prev + 2.4 * dt) % 360);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    startRotationRef.current = rotation;
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const instantDelta = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    // Track instant velocity for flick
    velocityRef.current = -instantDelta * 0.25;

    // Update rotation
    setRotation(startRotationRef.current - deltaX * 0.35);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full py-4 flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
      style={{
        perspective: "3000px",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* 3D Tilt Wrapper (-7deg X tilt) with responsive mobile scaling */}
      <div
        className="transform scale-[0.84] sm:scale-95 md:scale-100 origin-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-7deg)",
        }}
      >
        {/* Stage Container */}
        <div
          style={{
            position: "relative",
            width: "320px",
            height: "390px",
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
            willChange: "transform",
          }}
        >
          {cards.map((card, i) => {
            const angle = i * angleStep;

            return (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front Side: Rich full bleed image with rounded corners and shadow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "16px",
                    overflow: "hidden",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "transparent",
                    backgroundImage: `url(${card.image})`,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                  }}
                />

                {/* Back Side: Mirrored dark interior facing cylinder center */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "16px",
                    overflow: "hidden",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: "rotateY(180deg)",
                    backgroundColor: "transparent",
                    backgroundImage: `url(${card.image})`,
                    filter: "brightness(0.4) contrast(1.1)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
