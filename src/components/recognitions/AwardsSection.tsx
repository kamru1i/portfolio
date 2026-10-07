"use client";

import { motion } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { OdometerCounters } from "./OdometerCounters";

export function AwardsSection() {
  const milestones = PORTFOLIO_DATA.milestones;
  const counters = PORTFOLIO_DATA.counters;

  return (
    <section className="w-full pt-20 md:pt-28 pb-32 md:pb-48">
      <HairlineRule className="mb-14 md:mb-20" />

      {/* Split Section: Title (Left) + Table (Right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-start">
        {/* Title (Gambarino 60px) */}
        <div className="md:col-span-5">
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-[60px] text-white leading-[1.05] tracking-tight">
            Milestones &amp;
            <br />
            Recognitions
          </h2>
        </div>

        {/* Career Progression Table */}
        <div className="md:col-span-7 flex flex-col w-full">
          {/* Table Column Headers in Gambarino 20px */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/15 font-gambarino text-[18px] sm:text-[20px] text-white uppercase tracking-wider">
            <span className="col-span-3">YEAR</span>
            <span className="col-span-4">ORGANIZATION</span>
            <span className="col-span-5">ROLE / ACHIEVEMENT</span>
          </div>

          {/* Table Data Rows */}
          <div className="flex flex-col divide-y divide-white/10">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-4 py-4 sm:py-5 font-mono-custom text-[14px] sm:text-[15px] leading-relaxed group transition-colors"
              >
                <span className="col-span-3 text-[#a1a1a1] group-hover:text-white transition-colors">
                  {item.year}
                </span>
                <span className="col-span-4 text-[#a1a1a1] group-hover:text-white transition-colors">
                  {item.organization}
                </span>
                <div className="col-span-5 flex flex-col">
                  <span className="text-[#a1a1a1] group-hover:text-white transition-colors">
                    {item.role}
                  </span>
                  <span className="text-[12px] text-[#666666] group-hover:text-[#999999] mt-0.5 transition-colors">
                    {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hairline Divider Before 3 Large Counters */}
      <HairlineRule className="mt-20 md:mt-28 mb-16 md:mb-20" />

      {/* 3 Large Milestone Digit Counters Below */}
      <OdometerCounters stats={counters} />
    </section>
  );
}
