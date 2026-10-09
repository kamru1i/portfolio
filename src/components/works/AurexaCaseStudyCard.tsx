"use client";

import { PortfolioProject } from "@/lib/portfolio-data";

interface AurexaCaseStudyCardProps {
  project: PortfolioProject;
  onPreviewWeb: (project: PortfolioProject) => void;
}

function getDisplayDomain(url?: string): string {
  if (!url) return "live-deployment.site";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || "live-deployment.site";
  }
}

export function AurexaCaseStudyCard({
  project,
  onPreviewWeb,
}: AurexaCaseStudyCardProps) {
  const isEmbeddable = (project.previewMode ? project.previewMode === "iframe" : project.canEmbed !== false) && Boolean(project.liveUrl);
  const displayDomain = getDisplayDomain(project.liveUrl);
  const previewImage = project.previewImageUrl || project.thumbnail;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${displayDomain}&sz=64`;

  return (
    <div
      data-project-id={project.id}
      onClick={() => {
        if (project.liveUrl) {
          onPreviewWeb(project);
        }
      }}
      className="relative group w-full h-[460px] sm:h-[480px] lg:h-[480px] xl:h-[510px] rounded-2xl sm:rounded-3xl border border-white/10 hover:border-white/25 bg-[#0e0e0e] overflow-hidden select-none cursor-pointer transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      {/* Background: Live Homepage Preview (Iframe) or Intentional Browser Canvas (Security-Shielded) */}
      {isEmbeddable && project.liveUrl ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0d0e12] rounded-2xl sm:rounded-3xl">
          {/* Miniature Scaled Desktop Viewport (1280px rendered at scaled factor) */}
          <div className="absolute top-0 left-0 w-[1280px] h-[1600px] origin-top-left scale-[0.27] sm:scale-[0.30] lg:scale-[0.28] xl:scale-[0.32] pointer-events-none select-none transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.29] sm:group-hover:scale-[0.32] lg:group-hover:scale-[0.30] xl:group-hover:scale-[0.34]">
            <iframe
              src={project.liveUrl}
              title={`${project.title} live homepage`}
              loading="lazy"
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0 bg-white"
            />
          </div>

          {/* Ambient Dark Gradients for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 to-black/90 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
        </div>
      ) : (
        /* Intentional Polished Live Web Preview Canvas for Security-Shielded Sites */
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0b10] rounded-2xl sm:rounded-3xl flex flex-col justify-center items-center p-6 sm:p-8">
          {/* Ambient Screenshot Layer if available */}
          {previewImage && (
            <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-40 transition-opacity duration-700">
              <img
                src={previewImage}
                alt=""
                className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
            </div>
          )}

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
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-black/75 border border-white/15 p-5 shadow-2xl backdrop-blur-md flex flex-col items-center text-center transition-transform duration-500 group-hover:scale-105">
            {/* Top Mini Browser Controls */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 max-w-[190px]">
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-3 h-3 rounded-xs object-contain flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="font-mono-custom text-[11px] text-white/70 truncate">
                  {displayDomain}
                </span>
              </div>
            </div>

            {/* Favicon / Emblem centerpiece */}
            <div className="w-13 h-13 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mb-3 shadow-inner p-2.5">
              <img
                src={faviconUrl}
                alt=""
                className="w-7 h-7 rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <p className="font-sans font-medium text-base text-white tracking-tight">
              {project.title}
            </p>

            <span className="mt-1 font-mono-custom text-[11px] text-amber-300/80 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/30">
              Security-Shielded Deployment
            </span>

            {/* Direct Open Action */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-sans text-xs font-medium hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
              >
                <span>Open Live Site</span>
                <span>↗</span>
              </a>
            )}
          </div>

          {/* Ambient Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />
        </div>
      )}

      {/* Default State: Top Header (Title + Category + Live Indicator) */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-6 xl:p-7 flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono-custom text-[11px] uppercase tracking-wider text-emerald-400 font-medium">
            {isEmbeddable ? "Live Preview" : "Live Production"}
          </span>
          <span className="text-white/30 text-xs">•</span>
          <span className="font-mono-custom text-[11px] text-white/50 truncate max-w-[160px]">
            {displayDomain}
          </span>
        </div>

        <h3 className="font-sans text-xl sm:text-2xl lg:text-xl xl:text-2xl font-medium tracking-tight text-white leading-tight">
          {project.title}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#a1a1a1] mt-1 font-normal">
          {project.category || "Brand Identity • Website Design"}
        </p>
      </div>

      {/* Default State: Bottom Metadata (@Year + Status) */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-6 xl:p-7 flex items-center justify-between transition-transform duration-300 group-hover:translate-y-1">
        <span className="font-mono-custom text-xs sm:text-sm text-[#888]">
          @{project.year || "2026"}
        </span>

        <span className="font-mono-custom text-[11px] text-white/40 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
          {isEmbeddable ? "Interactive Iframe" : "Shielded Link"}
        </span>
      </div>

      {/* Aurexa Hover Overlay matching approved reference */}
      <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex flex-col justify-between p-5 sm:p-6 lg:p-6 xl:p-7">
        {/* Top spacer to balance layout */}
        <div className="w-full" />

        {/* Center Content: Impact Narrative Statement */}
        <div className="w-full my-auto">
          <p className="font-sans text-[15px] sm:text-[17px] lg:text-[15px] xl:text-[16px] font-normal leading-[1.4] text-white/95 line-clamp-4 sm:line-clamp-5">
            {project.description}
          </p>

          {/* Thin Hairline Divider Rule */}
          <div className="w-full h-px bg-white/15 my-4 sm:my-5" />
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
            <span className="font-sans text-xs sm:text-sm font-medium text-neutral-300 tracking-wide truncate max-w-[120px] sm:max-w-none">
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/10 transition-all flex items-center justify-center shadow-sm"
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
              className="w-8 h-8 sm:w-9 sm:h-10 sm:px-3 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center text-sm shadow-sm group-hover:scale-105"
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
