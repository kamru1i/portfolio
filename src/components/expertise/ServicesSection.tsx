"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA, ServiceItem } from "@/lib/portfolio-data";

export function ServicesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const services = PORTFOLIO_DATA.services;

  return (
    <section id="expertise" className="w-full pt-20 md:pt-28 pb-16">
      <HairlineRule className="mb-14 md:mb-20" />

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Section Heading (Left) */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-5"
        >
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[1.1] tracking-tight">
            EXPERTISE &amp;
            <br />
            SERVICES
          </h2>
        </motion.div>

        {/* Interactive Services Rows (Right) */}
        <div className="md:col-span-7 flex flex-col w-full">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              isHovered={hoveredId === service.id}
              onHover={() => setHoveredId(service.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  service: ServiceItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative w-full border-b border-white/15 py-5 sm:py-6 cursor-pointer group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-between font-mono-custom text-[15px] sm:text-[16px]">
        {/* Title */}
        <span
          className={`tracking-wider uppercase transition-colors duration-300 ${
            isHovered ? "text-white" : "text-[#a1a1a1] group-hover:text-white"
          }`}
        >
          {service.title}
        </span>

        {/* Floating Center Preview Image on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -2 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 -top-12 z-20 pointer-events-none w-52 h-32 rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-[#141414]"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Index Number */}
        <span className="text-white font-medium pl-4">{service.index}</span>
      </div>

      {/* Description preview that gently expands on mobile or hover */}
      <div className="mt-2 text-[#888888] font-mono-custom text-[13px] leading-relaxed max-w-xl">
        {service.description}
      </div>
    </motion.div>
  );
}
