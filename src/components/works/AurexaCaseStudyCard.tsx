"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";

interface AurexaCaseStudyCardProps {
  project: PortfolioProject;
  onPreviewWeb: (project: PortfolioProject) => void;
}

export function AurexaCaseStudyCard({
  project,
  onPreviewWeb,
}: AurexaCaseStudyCardProps) {
  return (
    <div
      data-project-id={project.id}
      onClick={() => {
        if (project.liveUrl) {
          onPreviewWeb(project);
        }
      }}
      className="relative group w-full h-[500px] sm:h-[530px] rounded-2xl sm:rounded-3xl border border-white/10 hover:border-white/25 bg-[#0e0e0e] overflow-hidden select-none cursor-pointer transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      {/* Background Project Image with Smooth Hover Zoom */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />

        {/* Default Ambient Gradient Overlays for High Contrast Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/20 to-black/90 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
      </div>

      {/* Default State: Top Header (Title + Category) */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col transition-transform duration-300 group-hover:translate-y-[-4px]">
        <h3 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-white leading-tight">
          {project.title}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#a1a1a1] mt-1.5 font-normal">
          {project.category || project.client || "Web Platform"}
        </p>
      </div>

      {/* Default State: Bottom Metadata (Year + Client) */}
      <div className="relative z-10 p-6 sm:p-7 flex items-center justify-between transition-transform duration-300 group-hover:translate-y-[4px]">
        <span className="font-mono-custom text-xs sm:text-sm text-[#8f8f8f]">
          @{project.year}
        </span>
        <span className="font-mono-custom text-xs uppercase tracking-wider text-neutral-400/80">
          {project.client || "Web System"}
        </span>
      </div>

      {/* Aurexa-Inspired Hover Overlay with Backdrop Blur Glass */}
      <div className="absolute inset-0 z-20 bg-[#161616]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-between p-6 sm:p-7">
        {/* Top Header inside Hover */}
        <div className="flex items-center justify-between w-full">
          <span className="font-mono-custom text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
            {project.client || "Web Case Study"}
          </span>
          <span className="font-mono-custom text-xs text-neutral-400">
            @{project.year}
          </span>
        </div>

        {/* Center Content: Impact Narrative Statement */}
        <div className="my-auto py-2">
          <p className="font-sans text-[17px] sm:text-[19px] font-normal leading-[1.38] text-white/95 line-clamp-4">
            {project.description}
          </p>
          <div className="w-full h-px bg-white/15 my-4 sm:my-5" />
          
          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono-custom text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between w-full pt-2">
          <span className="font-mono-custom text-[11px] uppercase tracking-wider text-emerald-400/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Case Study
          </span>

          <div className="flex items-center gap-2">
            {/* GitHub Action — rendered ONLY if githubUrl exists */}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/15 transition-all flex items-center gap-1 shadow-sm"
                aria-label={`View ${project.title} source on GitHub`}
              >
                <span>GitHub</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}

            {/* Live Website Action — rendered ONLY if liveUrl exists */}
            {project.liveUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewWeb(project);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-sans text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
                aria-label={`Preview live website for ${project.title}`}
              >
                <span>Live Site</span>
                <span className="text-[11px]">↗</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
