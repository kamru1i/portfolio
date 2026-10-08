"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { EditorialListCard } from "@/components/common/EditorialListCard";
import { OdometerCounters } from "./OdometerCounters";

export function AwardsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const milestones = PORTFOLIO_DATA.milestones;
  const counters = PORTFOLIO_DATA.counters;

  return (
    <section id="recognitions" className="w-full pt-20 md:pt-28 pb-32 md:pb-48 select-none">
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
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white tracking-tight leading-[1.08] font-normal uppercase">
            Milestones &amp; Recognitions
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
            Career progression, academic milestones, and operational achievements across enterprise IT, web systems, and digital production.
          </p>
        </motion.div>
      </div>

      {/* Stacked Milestone Cards in Aurexa/FAQ Unified Pattern */}
      <div
        className="w-full flex flex-col gap-3.5 sm:gap-4"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {milestones.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;

          return (
            <EditorialListCard
              key={idx}
              isHovered={isHovered}
              isDimmed={isAnyHovered && !isHovered}
              onMouseEnter={() => setHoveredIdx(idx)}
              className="py-6 sm:py-7 md:py-8 px-5 sm:px-8"
            >
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                {/* Left Column: Year & Period */}
                <div className="w-[120px] sm:w-[150px] md:w-[180px] flex-shrink-0 flex items-center gap-3">
                  <span className="font-mono-custom text-sm sm:text-base text-white/90 font-medium tracking-wider">
                    {item.year}
                  </span>
                  <span className="h-px w-6 bg-white/20 hidden sm:inline-block" />
                </div>

                {/* Center / Main Column: Organization & Role Hierarchy */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-custom text-xs uppercase tracking-widest text-[#888] group-hover:text-emerald-400/90 transition-colors">
                      {item.organization}
                    </span>
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl md:text-3xl text-white font-normal tracking-tight transition-colors">
                    {item.role}
                  </h3>
                  <p className="font-mono-custom text-xs sm:text-sm text-[#777] mt-1.5 leading-relaxed group-hover:text-[#aaa] transition-colors">
                    {item.highlight}
                  </p>
                </div>

                {/* Right Column: Index Numbering */}
                <div className="w-[40px] sm:w-[60px] text-right flex-shrink-0 font-mono-custom text-sm sm:text-base text-[#666] group-hover:text-white transition-colors">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>
            </EditorialListCard>
          );
        })}
      </div>

      {/* Hairline Divider Before 3 Large Counters */}
      <HairlineRule className="mt-20 md:mt-28 mb-16 md:mb-20" />

      {/* 3 Large Milestone Digit Counters Below */}
      <OdometerCounters stats={counters} />
    </section>
  );
}
