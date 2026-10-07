"use client";

import { motion } from "framer-motion";

interface HairlineRuleProps {
  className?: string;
  delay?: number;
}

export function HairlineRule({ className = "", delay = 0 }: HairlineRuleProps) {
  return (
    <div className={`relative w-full overflow-hidden py-1 ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{
          duration: 1.1,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
        style={{ originX: 0 }}
        className="h-[1px] w-full bg-white/15"
      />
    </div>
  );
}
