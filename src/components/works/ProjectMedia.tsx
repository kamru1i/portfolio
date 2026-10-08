"use client";

import Image from "next/image";
import { PortfolioProject } from "@/lib/portfolio-data";

interface ProjectMediaProps {
  project: PortfolioProject;
  isLarge?: boolean;
  onPlayClick?: () => void;
  onLivePreviewClick?: () => void;
}

export function ProjectMedia({
  project,
  isLarge = false,
  onPlayClick,
  onLivePreviewClick,
}: ProjectMediaProps) {
  const isVideo = project.type === "video";
  const isPortraitVideo = isVideo && project.format === "9:16";

  if (isPortraitVideo) {
    return (
      <div
        onClick={onPlayClick}
        className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-b from-[#141414] to-[#080808] border border-white/10 group-hover:border-white/25 transition-all duration-300 flex items-center justify-center p-3 sm:p-5 select-none cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
      >
        {/* Ambient Blurred Background to create atmospheric depth without distortion */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-2xl scale-125"
            aria-hidden="true"
          />
        </div>

        {/* Top Format Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono-custom text-[11px] text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>9:16 Reel</span>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono-custom text-[11px] text-white/70">
          {project.year}
        </div>

        {/* Centered 9:16 Portrait Reel Container */}
        <div className="relative h-full aspect-[9/16] rounded-lg overflow-hidden border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-10 transition-transform duration-500 group-hover:scale-[1.02]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover"
          />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-lg pl-0.5 shadow-2xl transition-transform duration-300 group-hover:scale-110">
              ▶
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 16:9 Video or Web Landscape Media Presentation
  return (
    <div
      onClick={isVideo ? onPlayClick : undefined}
      className={`relative w-full aspect-video overflow-hidden rounded-xl bg-[#0c0c0c] border border-white/10 group-hover:border-white/25 transition-all duration-300 select-none shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
        isVideo ? "cursor-pointer" : ""
      }`}
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes={isLarge ? "(max-width: 768px) 100vw, 800px" : "(max-width: 768px) 100vw, 450px"}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
      />

      {/* Top Metadata Badges */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono-custom text-[11px] text-white/80">
        {project.year}
      </div>

      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono-custom text-[11px] text-white/90">
        {isVideo ? (project.format || "16:9") : "Web"}
      </div>

      {/* Video Hover Overlay */}
      {isVideo && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl pl-1 shadow-2xl transition-transform duration-300 group-hover:scale-110">
            ▶
          </div>
        </div>
      )}

      {/* Web Desktop Hover Action Overlay */}
      {!isVideo && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center gap-3 p-4 z-10 backdrop-blur-[2px]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-full bg-black/75 hover:bg-black text-white font-mono-custom text-xs border border-white/20 transition-all flex items-center gap-1.5 shadow-lg hover:scale-105"
            >
              <span>GitHub / Project</span>
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
