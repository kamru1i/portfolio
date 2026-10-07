"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA, ServiceItem } from "@/lib/portfolio-data";

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const services = PORTFOLIO_DATA.services;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="expertise"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full pt-20 md:pt-28 pb-20 select-none"
    >
      <HairlineRule className="mb-14 md:mb-20" />

      {/* Split Section: Title (Left) + 5 Rows (Right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
        {/* Section Heading (Left, Gambarino 60px) */}
        <div className="md:col-span-5">
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-[60px] text-white uppercase leading-[1.05] tracking-tight">
            EXPERTISE &amp;
            <br />
            SERVICES
          </h2>
        </div>

        {/* 5 Sleek Service Rows (Right) */}
        <div className="md:col-span-7 flex flex-col w-full divide-y divide-white/15 border-t border-white/15">
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative w-full h-[52px] sm:h-[58px] flex items-center justify-between font-mono-custom text-[15px] sm:text-[16px] cursor-pointer transition-colors"
              >
                {/* Title */}
                <span
                  className={`tracking-wider uppercase transition-colors duration-200 ${
                    isHovered ? "text-white" : "text-[#a1a1a1] group-hover:text-white"
                  }`}
                >
                  {service.title}
                </span>

                {/* Index Number */}
                <span
                  className={`font-medium transition-colors duration-200 pl-4 ${
                    isHovered ? "text-white" : "text-[#a1a1a1] group-hover:text-white"
                  }`}
                >
                  {service.index}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Image Cursor Follower on Hover */}
      <AnimatePresence>
        {hoveredIndex !== null && services[hoveredIndex] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePos.x - 140,
              y: mousePos.y - 95,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 280,
              mass: 0.3,
            }}
            className="pointer-events-none absolute z-30 hidden md:block w-[280px] h-[190px] rounded-[10px] overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#111111]"
          >
            <Image
              src={services[hoveredIndex].image}
              alt={services[hoveredIndex].title}
              fill
              className="object-cover"
              sizes="280px"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
