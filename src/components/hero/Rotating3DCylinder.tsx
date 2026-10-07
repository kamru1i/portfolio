"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Rotating3DCylinderProps {
  imageWidth?: number;
  imageHeight?: number;
  tilt?: number;
  perspective?: number;
  cornerRadius?: number;
  speed?: number;
  sensitivity?: number;
  innerDim?: number;
}

export function Rotating3DCylinder({
  imageWidth = 320,
  imageHeight = 390,
  tilt = -7,
  perspective = 3000,
  cornerRadius = 16,
  speed = 2,
  sensitivity = 5,
  innerDim = 5.5,
}: Rotating3DCylinderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // High-performance physics refs (avoiding React re-renders during RAF and drag)
  // Initial angle 178deg matches exact reference screenshot with blue collage card and floral silhouette in front view
  const rotRef = useRef<number>(178);
  const velocityRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragStateRef = useRef<{ active: boolean; x: number }>({ active: false, x: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Responsive spacing: 2 on desktop/tablet, 1 on mobile
  const [spacing, setSpacing] = useState<number>(2);

  useEffect(() => {
    const handleResize = () => {
      setSpacing(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards = [
    {
      id: 1,
      src: "/images/hero-card-1.png",
      alt: "Architectural Editorial Portrait",
    },
    {
      id: 2,
      src: "/images/hero-card-2.png", // Vibrant Cobalt Blue with collage cutout
      alt: "Vibrant Cobalt Blue Collage Cutout",
    },
    {
      id: 3,
      src: "/images/hero-card-3.png",
      alt: "Cinematic Film Narrative",
    },
    {
      id: 4,
      src: "/images/hero-card-4.png", // Warm orange figure
      alt: "Atmospheric Amber Motion",
    },
    {
      id: 5,
      src: "/images/hero-card-5.png", // Grain monochrome floral portrait
      alt: "Grain Monochrome Floral Portrait",
    },
  ];

  const count = cards.length;
  const angleStep = 360 / count; // 72 deg
  // Exact radius formula from reference:
  // k = imageWidth * (1 + spacing * 0.15) / (2 * Math.tan(Math.PI / count))
  const radius = (imageWidth * (1 + spacing * 0.15)) / (2 * Math.tan(Math.PI / count));
  const autoRotateSpeed = speed * 6; // 12 deg/sec clockwise

  // Main RAF Physics & Render Loop matching exact reference implementation
  useEffect(() => {
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    const updateTransform = () => {
      if (!cylinder) return;
      cylinder.style.transform = `translateZ(${-radius}px) rotateY(${rotRef.current}deg)`;
    };

    updateTransform();

    const loop = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.1) : 0;
      lastTimeRef.current = time;

      if (!dragStateRef.current.active) {
        if (Math.abs(velocityRef.current) > 0.01) {
          // Physics momentum damping (exact 0.94 decay factor per frame)
          rotRef.current += velocityRef.current * dt;
          velocityRef.current *= 0.94;
        } else {
          // Continuous smooth auto-rotation
          rotRef.current += autoRotateSpeed * dt;
        }
      }

      updateTransform();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [radius, autoRotateSpeed]);

  // Pointer Event Handlers matching exact reference implementation
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    dragStateRef.current = { active: true, x: e.clientX };
    velocityRef.current = 0;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStateRef.current.active) return;
      e.preventDefault();

      const deltaX = e.clientX - dragStateRef.current.x;
      dragStateRef.current.x = e.clientX;
      const rate = 0.3 * sensitivity; // 1.5 deg/pixel

      rotRef.current += deltaX * rate;
      velocityRef.current = deltaX * rate * 60; // Instant throw velocity scaled to 60fps
    },
    [sensitivity]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
    dragStateRef.current.active = false;
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-3d-cylinder"
      data-testid="hero-3d-cylinder"
      data-lenis-prevent
      className={`relative w-full h-[390px] flex items-center justify-center overflow-hidden select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        perspective: `${perspective}px`,
        touchAction: "none",
        background: "rgba(0, 0, 0, 0)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Ambient Lighting Glow for atmospheric depth */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <div
          className="w-[440px] h-[440px] rounded-full blur-[100px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(30, 80, 200, 0.4) 0%, rgba(200, 90, 20, 0.15) 50%, transparent 75%)",
          }}
        />
      </div>

      {/* 3D Tilt Wrapper (-7deg tilt along X-axis matching reference) */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        {/* Stage Center Cylinder */}
        <div
          ref={cylinderRef}
          style={{
            position: "relative",
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {cards.map((card, idx) => {
            const angle = idx * angleStep;
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
                {/* Front Face: High-fidelity image, 16px corner radius, soft depth shadow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: `${cornerRadius}px`,
                    overflow: "hidden",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "transparent",
                    backgroundImage: `url(${card.src})`,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
                  }}
                />

                {/* Back Face: Mirrored interior facing cylinder center, dimmed brightness */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: `${cornerRadius}px`,
                    overflow: "hidden",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: "rotateY(180deg)",
                    backgroundColor: "transparent",
                    backgroundImage: `url(${card.src})`,
                    filter: `brightness(${innerDim / 10})`,
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
