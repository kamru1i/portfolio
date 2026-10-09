"use client";

import { motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { PortfolioProject } from "@/lib/portfolio-data";

interface ProjectMediaProps {
  project: PortfolioProject;
  isLarge?: boolean;
  parallaxY?: MotionValue<string>;
  onPlayClick?: () => void;
  onLivePreviewClick?: () => void;
}

export function getProjectAspectClass(format?: string, isLarge = false): string {
  switch (format) {
    case "16:9":
      return "aspect-[16/9]";
    case "9:16":
      return isLarge ? "aspect-[9/16] max-w-[380px] sm:max-w-[420px] mx-auto" : "aspect-[9/16]";
    case "1:1":
      return "aspect-square";
    case "4:3":
      return "aspect-[4/3]";
    case "5:4":
      return "aspect-[5/4]";
    default:
      return "aspect-[16/9]";
  }
}

export function ProjectMedia({
  project,
  isLarge = false,
  parallaxY,
  onPlayClick,
  onLivePreviewClick,
}: ProjectMediaProps) {
  const isVideo = project.type === "video";
  const aspectClass = getProjectAspectClass(project.format, isLarge);

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-black rounded-xl sm:rounded-2xl border border-white/10 select-none shadow-[0_12px_35px_rgba(0,0,0,0.5)]`}>
      {/* Parallax Image Frame matching Patrick Jane exact motion */}
      <motion.div
        style={parallaxY ? { y: parallaxY } : undefined}
        className="absolute inset-x-0 -top-[15%] h-[130%] w-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          sizes={isLarge ? "(max-width: 768px) 100vw, 704px" : "(max-width: 768px) 100vw, 352px"}
          priority={isLarge}
        />
      </motion.div>

      {/* Video Hover Overlay with Sleek Play Button */}
      {isVideo && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center text-xl sm:text-2xl pl-1 shadow-2xl transition-transform duration-300 group-hover:scale-110">
            ▶
          </div>
        </div>
      )}

      {/* Web Desktop Hover Action Overlay matching Patrick Jane minimalism */}
      {!isVideo && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 z-10">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white font-mono-custom text-xs border border-white/20 transition-all flex items-center gap-1.5 shadow-lg hover:scale-105"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          )}

          {project.liveUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLivePreviewClick?.();
              }}
              className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black font-sans text-xs font-medium transition-all flex items-center gap-1.5 shadow-lg hover:scale-105"
            >
              <span>Live Website</span>
              <span>↗</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
