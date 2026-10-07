"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ProjectItem } from "@/lib/portfolio-data";

interface WorkCardProps {
  project: ProjectItem;
  className?: string;
}

export function WorkCard({ project, className = "" }: WorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scrubbing within card matching Patrick Jane
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Moves the image from -12% to 12% as it travels through viewport
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      className={`group flex flex-col w-full ${className}`}
    >
      {/* Media Frame with square 0px corners and parallax scrub */}
      <div className="relative w-full overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-none">
        <div
          className={`relative w-full overflow-hidden ${
            project.aspect === "large"
              ? "aspect-[16/10] sm:aspect-[16/11]"
              : "aspect-[4/5] sm:aspect-[1/1]"
          }`}
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 -top-[15%] h-[130%] w-full transition-transform duration-700 ease-out group-hover:scale-105"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
            />
          </motion.div>
        </div>
      </div>

      {/* Card Metadata & Title */}
      <div className="mt-4 flex flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-gambarino text-xl sm:text-[23px] text-white tracking-normal font-normal">
            <span className="hover-underline-link">{project.title}</span>
          </h3>
          <span className="font-mono-custom text-[12px] sm:text-[13px] text-[#a1a1a1]">
            {project.year}
          </span>
        </div>

        <p className="font-mono-custom text-[13px] sm:text-[14px] text-[#a1a1a1] mt-1.5 leading-relaxed">
          {project.summary}
        </p>

        {/* Tags & Action Links */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono-custom text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10"
            >
              {tag}
            </span>
          ))}

          {project.links && project.links.length > 0 && (
            <div className="ml-auto flex items-center gap-3 pt-1">
              {project.links.map((link, idx) => (
                <span
                  key={idx}
                  className="font-mono-custom text-[12px] text-white hover-underline-link cursor-pointer"
                >
                  ▶ {link.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
