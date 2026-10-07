"use client";

import { motion } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { OdometerCounters } from "./OdometerCounters";

export function AwardsSection() {
  const milestones = PORTFOLIO_DATA.milestones;
  const counters = PORTFOLIO_DATA.counters;

  return (
    <section className="w-full pt-20 md:pt-28 pb-48 md:pb-64">
      <HairlineRule className="mb-14 md:mb-20" />

      {/* Split Section: Title (Left) + Table (Right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-5"
        >
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight">
            Milestones &amp;
            <br />
            Recognitions
          </h2>
        </motion.div>

        {/* Career Progression Table */}
        <div className="md:col-span-7 flex flex-col w-full">
          {/* Table Column Headers */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/15 font-gambarino text-[18px] sm:text-[20px] text-white uppercase tracking-wider">
            <span className="col-span-2">YEAR</span>
            <span className="col-span-4">PROJECT</span>
            <span className="col-span-6">AWARD / ROLE</span>
          </div>

          {/* Table Data Rows */}
          <div className="flex flex-col divide-y divide-white/10">
            {milestones.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="grid grid-cols-12 gap-4 py-5 font-mono-custom text-[14px] sm:text-[15px] leading-relaxed group transition-colors hover:text-white"
              >
                <span className="col-span-2 text-[#a1a1a1] group-hover:text-white transition-colors">
                  {item.year}
                </span>
                <span className="col-span-4 text-[#a1a1a1] group-hover:text-white font-medium transition-colors">
                  {item.organization}
                </span>
                <div className="col-span-6 flex flex-col">
                  <span className="text-[#a1a1a1] group-hover:text-white transition-colors">
                    {item.role}
                  </span>
                  <span className="text-[12px] text-[#666666] group-hover:text-[#999999] mt-0.5 transition-colors">
                    {item.highlight}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Large Milestone Digit Counters Below */}
      <OdometerCounters stats={counters} />
    </section>
  );
}
