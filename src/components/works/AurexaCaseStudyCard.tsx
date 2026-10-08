"use client";

import Image from "next/image";
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
      {/* Background Project Mockup Image with subtle zoom on hover */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />

        {/* Ambient Dark Gradients for Crisp Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85 pointer-events-none transition-opacity duration-300 group-hover:opacity-30" />
      </div>

      {/* Default State: Top Header (Title + Category) matching Image 1 */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-white leading-tight">
          {project.title}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#a1a1a1] mt-1 font-normal">
          {project.category || "Brand Identity • Website Design"}
        </p>
      </div>

      {/* Default State: Bottom Metadata (@Year) matching Image 1 */}
      <div className="relative z-10 p-6 sm:p-7 flex items-center justify-between transition-transform duration-300 group-hover:translate-y-1">
        <span className="font-mono-custom text-xs sm:text-sm text-[#888]">
          @{project.year || "2026"}
        </span>
      </div>

      {/* Aurexa Hover Overlay matching Image 2 (media_1791492077706_19af23f0.png) */}
      <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-between p-6 sm:p-7">
        {/* Top spacer to balance layout */}
        <div className="w-full" />

        {/* Center Content: Impact Narrative Statement */}
        <div className="w-full my-auto">
          <p className="font-sans text-[17px] sm:text-[19px] font-normal leading-[1.38] text-white/95 line-clamp-4 sm:line-clamp-5">
            {project.description}
          </p>

          {/* Thin Hairline Divider Rule */}
          <div className="w-full h-px bg-white/15 my-5 sm:my-6" />
        </div>

        {/* Bottom Actions Row: Emblem Icon + Client on Left, Arrow Button on Right */}
        <div className="flex items-center justify-between w-full pt-1">
          {/* Left: 4-bar Equalizer Emblem Icon + Client Name matching Image 2 */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-[3px]" aria-hidden="true">
              <span className="w-1 h-3.5 bg-neutral-400 rounded-full" />
              <span className="w-1 h-5 bg-neutral-200 rounded-full" />
              <span className="w-1 h-4 bg-neutral-300 rounded-full" />
              <span className="w-1 h-2.5 bg-neutral-400 rounded-full" />
            </div>
            <span className="font-sans text-sm font-medium text-neutral-300 tracking-wide">
              {project.client || "Emblem"}
            </span>
          </div>

          {/* Right: Rounded Square Arrow Action Button + Optional GitHub */}
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/10 transition-all flex items-center justify-center shadow-sm"
                aria-label={`View ${project.title} source on GitHub`}
              >
                <span>GH</span>
              </a>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewWeb(project);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center text-sm shadow-sm group-hover:scale-105"
              aria-label={`Preview live website for ${project.title}`}
            >
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
