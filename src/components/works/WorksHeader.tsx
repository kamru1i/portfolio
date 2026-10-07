"use client";

import { motion } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function WorksHeader() {
  return (
    <div id="works" className="w-full pt-16 md:pt-24 mb-12 md:mb-16">
      <HairlineRule className="mb-10 md:mb-14" />

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-6"
        >
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
            {PORTFOLIO_DATA.worksHeader.title}
          </h2>
        </motion.div>

        {/* Narrative Description */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-6"
        >
          <p
            className="font-mono-custom text-[15px] sm:text-[16px] leading-[1.6] text-[#a1a1a1] [&_strong]:text-white [&_strong]:font-medium"
            dangerouslySetInnerHTML={{
              __html: PORTFOLIO_DATA.worksHeader.statementHtml,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
