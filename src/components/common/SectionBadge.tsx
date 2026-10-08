"use client";

import { motion } from "framer-motion";

interface SectionBadgeProps {
  label: string;
  className?: string;
  showIndicator?: boolean;
}

export function SectionBadge({
  label,
  className = "",
  showIndicator = true,
}: SectionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/85 font-mono-custom text-xs uppercase tracking-widest mb-6 w-fit backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)] ${className}`}
    >
      {showIndicator && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </motion.div>
  );
}
