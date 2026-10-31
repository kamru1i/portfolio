"use client";
/* eslint-disable @next/next/no-img-element -- Uses raw <img> with onError fallback for arbitrary external favicons and screenshots */

import { useState } from "react";
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

          {/* Subtle Ambient Vignette so the screenshot stays crisp & visible both normally and on hover */}
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/55 pointer-events-none transition-opacity duration-300 group-hover:opacity-20" />
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

      {/* Top-Left: Liquid Glass Effect Card (Project Name -> URL) */}
      <div className="relative z-10 p-3.5 sm:p-4 flex items-start justify-between pointer-events-none">
        <div className="max-w-[85%] rounded-2xl px-3.5 py-2 bg-black/35 bg-linear-to-br from-white/18 via-white/8 to-white/4 backdrop-blur-md border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300 group-hover:border-white/35 group-hover:bg-black/45">
          <h3 className="font-sans text-sm sm:text-base font-medium tracking-tight text-white leading-snug truncate">
            {project.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-mono-custom text-[10px] sm:text-[11px] text-white/85 truncate">
              {displayDomain}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom-Left: Year Metadata Only */}
      <div className="relative z-10 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between pointer-events-none">
        {project.year ? (
          <span className="font-mono-custom text-xs text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            @{project.year}
          </span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
