"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ProjectItem } from "@/lib/portfolio-data";

interface WorkCardProps {
  project: ProjectItem;
  className?: string;
  isLarge?: boolean;
}

export function WorkCard({ project, className = "", isLarge = false }: WorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scrubbing within card media container matching Patrick Jane
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Moves the image from -14% to 8% as it travels through viewport
  const y = useTransform(scrollYProgress, [0, 1], ["-16%", "8%"]);

  return (
    <div
      ref={containerRef}
      className={`relative group flex flex-col w-full cursor-pointer select-none ${className}`}
    >
      {/* Square Media Frame matching reference (352x352 small, 704x704 large) */}
      <div className="relative w-full aspect-square overflow-hidden bg-black rounded-none border-0">
        <motion.div
          style={{ y }}
          className="absolute inset-x-0 -top-[20%] h-[140%] w-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes={isLarge ? "(max-width: 768px) 100vw, 704px" : "(max-width: 768px) 100vw, 352px"}
            priority={isLarge}
          />
        </motion.div>
      </div>

      {/* Card Title - Pure Gambarino 22px */}
      <div className="mt-4 sm:mt-5 flex items-baseline justify-between">
        <h3 className="font-gambarino text-[20px] sm:text-[22px] font-normal leading-[1.2] text-white">
          <span className="hover-underline-link">{project.title}</span>
        </h3>
      </div>
    </div>
  );
}
