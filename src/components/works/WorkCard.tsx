"use client";

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

  return (
    <div
      className={`group relative flex flex-col w-full select-none ${className}`}
    >
      {/* Media Container with 16:9 Landscape / 9:16 Portrait Reel Dynamic Support */}
      <ProjectMedia
        project={normalizedProject}
        isLarge={isLarge}
        onPlayClick={() => onPlayVideo?.(normalizedProject)}
        onLivePreviewClick={() => onPreviewWeb?.(normalizedProject)}
      />

      {/* Project Meta Information */}
      <div className="mt-5 sm:mt-6 flex flex-col gap-2">
        {/* Client & Year Row */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono-custom text-xs uppercase tracking-wider text-[#888] group-hover:text-emerald-400 transition-colors">
            {normalizedProject.client || (isVideo ? "Video Production" : "Web Platform")}
          </span>
          <span className="font-mono-custom text-xs text-[#666]">
            {normalizedProject.year}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => {
            if (isVideo) onPlayVideo?.(normalizedProject);
            else if (normalizedProject.liveUrl) onPreviewWeb?.(normalizedProject);
          }}
          className="font-gambarino text-2xl sm:text-[26px] md:text-[28px] font-normal leading-[1.2] text-white cursor-pointer"
        >
          <span className="hover-underline-link">{normalizedProject.title}</span>
        </h3>

        {/* Description: Natural text wrapping without hard breaks */}
        <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed mt-1">
          {normalizedProject.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {normalizedProject.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="font-mono-custom text-[11px] text-[#777] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Row */}
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          {isVideo ? (
            <button
              type="button"
              onClick={() => onPlayVideo?.(normalizedProject)}
              className="font-mono-custom text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group-hover:text-emerald-400"
            >
              <span>Play Video</span>
              <span>↗</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              {normalizedProject.githubUrl && (
                <a
                  href={normalizedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-custom text-xs text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}
              {normalizedProject.liveUrl && (
                <button
                  type="button"
                  onClick={() => onPreviewWeb?.(normalizedProject)}
                  className="font-mono-custom text-xs text-white/90 hover:text-white flex items-center gap-1 transition-colors cursor-pointer group-hover:text-emerald-400"
                >
                  <span>Live Website</span>
                  <span>↗</span>
                </button>
              )}
            </div>
          )}

          <span className="font-mono-custom text-[11px] text-[#555] uppercase tracking-wider">
            {isVideo ? (normalizedProject.format === "9:16" ? "9:16 Reel" : "16:9 Cinema") : "Interactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
