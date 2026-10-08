"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA, ServiceItem } from "@/lib/portfolio-data";
import { EditorialListCard } from "@/components/common/EditorialListCard";
import { SectionBadge } from "@/components/common/SectionBadge";

export function ServicesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mouseRelativeX, setMouseRelativeX] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const services = PORTFOLIO_DATA.services;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width; // 0 to 1
    // Map to a smooth subtle parallax offset: -60px to +60px
    setMouseRelativeX((xRatio - 0.5) * 120);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full pt-20 md:pt-28 pb-20 select-none scroll-mt-24"
    >
      <div id="expertise" className="absolute -top-24 pointer-events-none" />
      <HairlineRule className="mb-14 md:mb-20" />

      {/* Header: Patrick Jane Title (Left) + Aurexa Subtitle (Right) */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        {/* Left: Patrick Jane Style Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
        >
          <SectionBadge label="SERVICES" />
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white tracking-tight leading-[1.08] font-normal uppercase">
            Expertise &amp; Services
          </h2>
        </motion.div>

        {/* Right: Aurexa-Style Supporting Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md lg:max-w-lg md:text-right"
        >
          <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
            Crafting high-impact visual narratives, AI-augmented media workflows, modern web platforms, and resilient IT infrastructure.
          </p>
        </motion.div>
      </div>

      {/* Stacked Service Cards in Aurexa/FAQ Unified Pattern */}
      <div
        className="w-full flex flex-col gap-3.5 sm:gap-4"
        onMouseLeave={() => {
          setHoveredId(null);
          setMouseRelativeX(0);
        }}
      >
        {services.map((service) => {
          const isHovered = hoveredId === service.id;
          const isAnyHovered = hoveredId !== null;

          return (
            <EditorialListCard
              key={service.id}
              href={service.href}
              isHovered={isHovered}
              isDimmed={isAnyHovered && !isHovered}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseMove={handleMouseMove}
              ariaLabel={`${service.title} - View details`}
              className="min-h-[100px] sm:min-h-[120px] md:min-h-[130px] flex items-center"
            >
              {/* Idle State: Clean Minimal Editorial Row inside Card */}
              <div className="w-full py-6 sm:py-8 md:py-9 px-5 sm:px-8 flex items-center justify-between text-white group cursor-pointer">
                {/* Left Category Label */}
                <div className="w-[120px] sm:w-[180px] md:w-[220px] flex-shrink-0 text-[#777] font-mono-custom text-xs sm:text-sm tracking-widest uppercase transition-colors group-hover:text-white/80">
                  {service.category}
                </div>

                {/* Center Title */}
                <div className="flex-1 text-center md:text-center px-4">
                  <h3 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-5xl text-white font-normal tracking-tight transition-transform duration-200 group-hover:scale-[1.01]">
                    {service.title}
                  </h3>
                </div>

                {/* Right Index */}
                <div className="w-[40px] sm:w-[60px] text-right flex-shrink-0 text-[#777] font-mono-custom text-sm sm:text-base transition-colors group-hover:text-white">
                  {service.index}
                </div>
              </div>

              {/* Active State: Aurexa-Style Pill Image + Title Sliding Marquee Ribbon */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.94 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.94 }}
                    transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-0 z-20 bg-[#1e1e1e] border border-white/20 rounded-[14px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex items-center pointer-events-auto"
                  >
                    {/* Animated Horizontal Track */}
                    <motion.div
                      animate={{
                        x: ["0%", "-50%"],
                      }}
                      transition={{
                        x: {
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 16,
                          ease: "linear",
                        },
                      }}
                      style={{
                        transform: `translateX(${mouseRelativeX}px)`,
                      }}
                      className="flex items-center gap-6 sm:gap-10 whitespace-nowrap will-change-transform py-2 pl-4"
                    >
                      {/* Repeat Ribbon Units: [Image] Title [Image] Title [Image] Title */}
                      {[0, 1, 2, 3].map((rep) => (
                        <div key={rep} className="flex items-center gap-6 sm:gap-10 flex-shrink-0">
                          {/* Pill / Stadium Shaped Service-Specific Image */}
                          <div className="relative w-[180px] sm:w-[240px] md:w-[280px] h-[64px] sm:h-[80px] md:h-[94px] rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-black/60 shadow-inner">
                            <Image
                              src={service.images[rep % service.images.length] || service.image}
                              alt={`${service.title} visual preview`}
                              fill
                              sizes="(max-width: 768px) 240px, 280px"
                              className="object-cover"
                              priority
                            />
                          </div>

                          {/* Service Title in Ribbon */}
                          <span className="font-sans text-2xl sm:text-3xl md:text-5xl text-white font-normal tracking-tight flex-shrink-0">
                            {service.title}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </EditorialListCard>
          );
        })}
      </div>
    </section>
  );
}
