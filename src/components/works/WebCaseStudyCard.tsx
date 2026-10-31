"use client";
/* eslint-disable @next/next/no-img-element -- Uses raw <img> with onError fallback for arbitrary external favicons and screenshots */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GitHubBrandIcon } from "@/components/common/BrandIcons";
import { PortfolioProject } from "@/lib/portfolio-data";
import { getDisplayDomain } from "@/lib/url-utils";

interface WebCaseStudyCardProps {
  project: PortfolioProject;
  onPreviewWeb: (project: PortfolioProject) => void;
}

export function WebCaseStudyCard({
  project,
  onPreviewWeb,
}: WebCaseStudyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLandscapeScreenshot, setIsLandscapeScreenshot] = useState(true);

  const displayDomain = getDisplayDomain(project.liveUrl, "live-deployment.site");
  const previewImage = project.previewImageUrl || project.thumbnail;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${displayDomain}&sz=64`;
  const hasValidScreenshot = Boolean(previewImage) && !imageError;

  return (
    <div
      data-project-id={project.id}
      onClick={() => {
        onPreviewWeb(project);
      }}
      className="relative group w-full aspect-video rounded-2xl border border-white/10 hover:border-white/25 bg-[#0e0e0e] overflow-hidden select-none cursor-pointer transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      {/* Background: Static 16:9 Homepage Screenshot (Zero iframe lag on card grid) */}
      {hasValidScreenshot ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0b0e] rounded-2xl">
          <img
            src={previewImage}
            alt={`${project.title} homepage screenshot`}
            loading="lazy"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setIsLandscapeScreenshot(naturalWidth / naturalHeight >= 1.35);
              }
            }}
            onError={() => setImageError(true)}
            className={`w-full h-full ${
              isLandscapeScreenshot
                ? "object-fill"
                : "object-cover object-top"
            } transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]`}
          />

          {/* Ambient Dark Gradients for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/15 to-black/85 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
        </div>
      ) : (
        /* Static Fallback Canvas when no screenshot image is available */
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0b10] rounded-2xl flex flex-col justify-center items-center p-4 sm:p-5">
          {/* Subtle Ambient Radial Lighting & Grid Pattern */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff15 1px, transparent 1px), radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.12) 0%, transparent 65%)",
              backgroundSize: "20px 20px, 100% 100%",
            }}
          />

          {/* Clean Browser-Style Frame Centerpiece */}
          <div className="relative z-10 w-full max-w-xs rounded-xl bg-black/75 border border-white/15 p-3.5 shadow-2xl backdrop-blur-md flex flex-col items-center text-center transition-transform duration-500 group-hover:scale-105">
            {/* Top Mini Browser Controls */}
            <div className="w-full flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-[#ff5f56]/70" />
                <span className="w-2 h-2 rounded-full bg-[#ffbd2e]/70" />
                <span className="w-2 h-2 rounded-full bg-[#27c93f]/70" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 max-w-[170px]">
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-3 h-3 rounded-xs object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="font-mono-custom text-[10px] text-white/70 truncate">
                  {displayDomain}
                </span>
              </div>
            </div>

            <p className="font-sans font-medium text-sm text-white tracking-tight truncate max-w-full">
              {project.title}
            </p>
          </div>

          {/* Ambient Bottom Fade */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />
        </div>
      )}

      {/* Default State: Top Header (Title + Category + Live Indicator) */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono-custom text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
            Live Production
          </span>
          <span className="text-white/30 text-xs">•</span>
          <span className="font-mono-custom text-[10px] sm:text-[11px] text-white/60 truncate max-w-[160px]">
            {displayDomain}
          </span>
        </div>

        <h3 className="font-sans text-base sm:text-lg font-medium tracking-tight text-white leading-snug truncate">
          {project.title}
        </h3>
        <p className="font-sans text-[11px] sm:text-xs text-[#b5b5b5] mt-0.5 font-normal truncate">
          {project.category || "Brand Identity • Website Design"}
        </p>
      </div>

      {/* Default State: Bottom Metadata (@Year + Case Study Link + Preview Pill) */}
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-2 transition-transform duration-300 group-hover:translate-y-0.5">
        <span className="font-mono-custom text-xs text-[#999]">
          {project.year ? `@${project.year}` : ""}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/projects/web/${project.slug || project.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-mono-custom text-[11px] text-white/85 hover:text-white border border-white/15 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-sm transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
          <span className="font-mono-custom text-[11px] text-white/65 border border-white/10 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs">
            Live Preview
          </span>
        </div>
      </div>

      {/* Interactive Card Hover Overlay */}
      <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 ease-out flex flex-col justify-between p-4 sm:p-5">
        {/* Top Title Reminder in Hover State */}
        <div className="w-full flex items-center justify-between gap-2">
          <span className="font-sans text-sm font-medium text-white truncate">
            {project.title}
          </span>
          <span className="font-mono-custom text-[10px] text-emerald-400 uppercase tracking-wider shrink-0">
            16:9 Preview
          </span>
        </div>

        {/* Center Content: Impact Narrative Statement */}
        <div className="w-full my-auto py-1">
          <p className="font-sans text-xs sm:text-sm font-normal leading-relaxed text-white/95 line-clamp-3">
            {project.description}
          </p>

          {/* Thin Hairline Divider Rule */}
          <div className="w-full h-px bg-white/15 my-2.5 sm:my-3" />
        </div>

        {/* Bottom Actions Row: Emblem Icon + Client on Left, Arrow Button on Right */}
        <div className="flex items-center justify-between w-full">
          {/* Left: 4-bar Equalizer Emblem Icon + Client Name */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-[3px] shrink-0" aria-hidden="true">
              <span className="w-1 h-3 bg-neutral-400 rounded-full" />
              <span className="w-1 h-4 bg-neutral-200 rounded-full" />
              <span className="w-1 h-3.5 bg-neutral-300 rounded-full" />
              <span className="w-1 h-2 bg-neutral-400 rounded-full" />
            </div>
            <span className="font-sans text-xs font-medium text-neutral-300 tracking-wide truncate max-w-[130px] sm:max-w-[170px]">
              {project.client || "Emblem"}
            </span>
          </div>

          {/* Right: Case Study Link + Optional GitHub + Preview Arrow Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href={`/projects/web/${project.slug || project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-[11px] uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center shadow-sm"
            >
              Details
            </Link>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/10 transition-all flex items-center justify-center shadow-sm"
                aria-label={`View ${project.title} source on GitHub`}
              >
                <GitHubBrandIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewWeb(project);
              }}
              className="w-8 h-8 sm:px-3 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center text-sm shadow-sm group-hover:scale-105 cursor-pointer"
              aria-label={`Preview live website for ${project.title}`}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
