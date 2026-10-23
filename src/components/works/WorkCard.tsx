"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { PortfolioProject, ProjectItem } from "@/lib/portfolio-data";
import { ProjectMedia } from "./ProjectMedia";

interface WorkCardProps {
  project: PortfolioProject | ProjectItem;
  className?: string;
  isLarge?: boolean;
  onPlayVideo?: (project: PortfolioProject) => void;
  onPreviewWeb?: (project: PortfolioProject) => void;
}

export function WorkCard({
  project,
  className = "",
  isLarge = false,
  onPlayVideo,
  onPreviewWeb,
}: WorkCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scrubbing within card media container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Moves the image from -14% to 8% as it travels through viewport
  const y = useTransform(scrollYProgress, [0, 1], ["-16%", "8%"]);

  const normalizedProject: PortfolioProject =
    "type" in project
      ? project
      : {
          id: project.id,
          type: project.discipline === "web" ? "web" : "video",
          title: project.title,
          client: project.client,
          year: project.year,
          description: project.summary,
          thumbnail: project.image,
          format: project.id === "bf-cars" ? "9:16" : "16:9",
          tags: project.tags,
          published: true,
          order: 1,
        };

  const isVideo = normalizedProject.type === "video";
  const isPortraitLarge = normalizedProject.format === "9:16" && isLarge;
  const projectSlug = normalizedProject.slug || normalizedProject.id;
  const detailHref = isVideo
    ? `/projects/video/${projectSlug}`
    : `/projects/web/${projectSlug}`;

  return (
    <div
      ref={containerRef}
      data-project-id={normalizedProject.id}
      className={`relative group flex flex-col w-full ${isPortraitLarge ? "max-w-[380px] sm:max-w-[420px] mx-auto" : ""} cursor-pointer select-none ${className}`}
      onClick={() => {
        if (isVideo) onPlayVideo?.(normalizedProject);
        else if (normalizedProject.liveUrl) onPreviewWeb?.(normalizedProject);
      }}
    >
      {/* Square Media Frame (352x352 small, 704x704 large) */}
      <ProjectMedia
        project={normalizedProject}
        isLarge={isLarge}
        parallaxY={y}
        onPlayClick={() => onPlayVideo?.(normalizedProject)}
        onLivePreviewClick={() => onPreviewWeb?.(normalizedProject)}
      />

      {/* Card Title - Pure Gambarino 22px + Case Study Link */}
      <div className="mt-4 sm:mt-5 flex items-baseline justify-between gap-3">
        <h3 className="font-gambarino text-[20px] sm:text-[22px] font-normal leading-[1.2] text-white">
          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            className="hover-underline-link"
          >
            {normalizedProject.title}
          </Link>
        </h3>

        <Link
          href={detailHref}
          onClick={(e) => e.stopPropagation()}
          className="font-mono-custom text-[11px] uppercase tracking-wider text-white/55 hover:text-white shrink-0 transition-colors"
        >
          Case Study →
        </Link>
      </div>
    </div>
  );
}
