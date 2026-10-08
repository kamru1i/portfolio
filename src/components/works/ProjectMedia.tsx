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

export function ProjectMedia({
  project,
  isLarge = false,
  parallaxY,
  onPlayClick,
  onLivePreviewClick,
}: ProjectMediaProps) {
  const isVideo = project.type === "video";
  const isPortraitVideo = isVideo && project.format === "9:16";

  // 9:16 Vertical Reel Video presentation inside Patrick Jane square card frame
  if (isPortraitVideo) {
    return (
      <div className="relative w-full aspect-square overflow-hidden bg-[#090909] rounded-none border-0 flex items-center justify-center p-3 sm:p-5 select-none">
        {/* Subtle Ambient Blurred Backdrop preserving atmospheric depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-2xl scale-125"
            aria-hidden="true"
          />
        </div>

        {/* Centered 9:16 Portrait Reel Container with True Vertical Aspect Ratio */}
        <div className="relative h-[92%] aspect-[9/16] rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 border border-white/10">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes={isLarge ? "(max-width: 768px) 100vw, 420px" : "(max-width: 768px) 100vw, 240px"}
            className="object-cover"
          />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center text-xl pl-1 shadow-2xl transition-transform duration-300 group-hover:scale-110">
              ▶
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 16:9 Video or Web Landscape Media Presentation inside Patrick Jane square card frame
  return (
    <div className="relative w-full aspect-square overflow-hidden bg-black rounded-none border-0 select-none">
      {/* Parallax Image Frame matching Patrick Jane exact motion */}
      <motion.div
        style={parallaxY ? { y: parallaxY } : undefined}
        className="absolute inset-x-0 -top-[20%] h-[140%] w-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
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
