"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

type ViewportMode = "desktop" | "tablet" | "mobile";
type ModalPreviewMode = "iframe" | "fallback";

function getDisplayDomain(url?: string): string {
  if (!url) return "production-live.app";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || "production-live.app";
  }
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [activeMode, setActiveMode] = useState<ModalPreviewMode>("iframe");

  // Reset state whenever active project changes
  useEffect(() => {
    if (project) {
      const isFallback = project.previewMode === "fallback" || project.canEmbed === false;
      setActiveMode(isFallback ? "fallback" : "iframe");
      setIframeLoaded(false);
      setHasError(false);
      setViewportMode("desktop");
    }
  }, [project]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  // Lock body scroll non-destructively
  useEffect(() => {
    if (project) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [project]);

  if (!project) return null;

  const displayDomain = getDisplayDomain(project.liveUrl);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${displayDomain}&sz=64`;
  const previewImage = project.previewImageUrl || project.thumbnail;

  const viewportWidthClass =
    viewportMode === "mobile"
      ? "w-[375px] max-w-full"
      : viewportMode === "tablet"
      ? "w-[768px] max-w-full"
      : "w-full";

  return (
    <AnimatePresence>
      <motion.div
        key="project-preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          key="project-preview-dialog"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-6xl h-[90vh] max-h-[900px] rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Preview`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#181818]/90">
            {/* Left: Window Controls Mockup + Title */}
            <div className="flex items-center gap-4">
              <div className="items-center gap-1.5 hidden sm:flex" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono-custom text-xs uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {project.client || "Web System"}
                </span>
                <h3 className="font-sans font-medium text-sm sm:text-base text-white truncate max-w-xs sm:max-w-sm">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Center Controls: Viewport or Mode Switcher */}
            <div className="hidden md:flex items-center gap-2">
              {/* Preview Mode Switcher (Iframe vs Fallback) */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("iframe");
                    setHasError(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono-custom text-[11px] uppercase transition-colors flex items-center gap-1.5 ${
                    activeMode === "iframe"
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Render interactive iframe preview"
                >
                  <span>🖥️</span>
                  <span>Live Iframe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("fallback")}
                  className={`px-2.5 py-1 rounded-lg font-mono-custom text-[11px] uppercase transition-colors flex items-center gap-1.5 ${
                    activeMode === "fallback"
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/50 hover:text-white"
                  }`}
                  title="Render security-shielded fallback showcase"
                >
                  <span>🛡️</span>
                  <span>Fallback View</span>
                </button>
              </div>

              {/* Viewport switcher when in live iframe mode */}
              {activeMode === "iframe" && !hasError && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewportMode("desktop")}
                    className={`px-2.5 py-1 rounded-lg font-mono-custom text-[11px] uppercase transition-colors ${
                      viewportMode === "desktop"
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode("tablet")}
                    className={`px-2.5 py-1 rounded-lg font-mono-custom text-[11px] uppercase transition-colors ${
                      viewportMode === "tablet"
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode("mobile")}
                    className={`px-2.5 py-1 rounded-lg font-mono-custom text-[11px] uppercase transition-colors ${
                      viewportMode === "mobile"
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 font-mono-custom text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 font-sans text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open Live Site</span>
                  <span>↗</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project preview"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative flex-1 w-full bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
            {activeMode === "iframe" && project.liveUrl && !hasError ? (
              /* LIVE IFRAME VIEW */
              <div className={`relative h-full transition-all duration-300 mx-auto ${viewportWidthClass} flex flex-col items-center justify-center`}>
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0d0d] z-10">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <p className="font-mono-custom text-xs text-[#888]">
                      Connecting to live preview...
                    </p>
                  </div>
                )}
                <iframe
                  src={project.liveUrl}
                  title={project.title}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => {
                    setHasError(true);
                    setActiveMode("fallback");
                  }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="w-full h-full border-0 bg-white"
                />

                {/* Floating notice for verification prompt fallback */}
                <div className="absolute bottom-3 right-3 z-20">
                  <button
                    type="button"
                    onClick={() => setActiveMode("fallback")}
                    className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white/80 hover:text-white font-mono-custom text-[11px] border border-white/20 shadow-lg backdrop-blur-sm transition-all"
                  >
                    Seeing challenge/verification? Switch to Fallback ↗
                  </button>
                </div>
              </div>
            ) : (
              /* POLISHED PROJECT-SPECIFIC FALLBACK SHOWCASE */
              <div className="relative w-full h-full overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start sm:justify-center">
                {/* Ambient Radial Backlighting */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff15 1px, transparent 1px), radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    backgroundSize: "24px 24px, 100% 100%",
                  }}
                />

                {/* Browser Mockup Showcase Card */}
                <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-[#14151a] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto">
                  {/* Browser Window Chrome */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1c1d24] border-b border-white/10 gap-3">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                      <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                      <span className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex-1 max-w-xl mx-auto flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-center">
                      {/* Real Favicon */}
                      <img
                        src={faviconUrl}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm object-contain flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="font-mono-custom text-xs text-white/80 truncate">
                        https://{displayDomain}
                      </span>
                      <span className="font-mono-custom text-[10px] text-amber-300/90 px-1.5 py-0.2 rounded bg-amber-950/50 border border-amber-800/40 hidden sm:inline-block">
                        🔒 Shielded
                      </span>
                    </div>

                    {/* Direct Quick Link */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-custom text-[11px] text-white/70 hover:text-white px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <span>Open</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>

                  {/* Browser Window Body */}
                  <div className="relative min-h-[260px] sm:min-h-[360px] max-h-[500px] overflow-hidden bg-[#0c0d12] flex items-center justify-center">
                    {previewImage ? (
                      /* Display valid project artwork / screenshot */
                      <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[420px] overflow-hidden group">
                        <img
                          src={previewImage}
                          alt={`${project.title} homepage preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      /* Branded Layout when no screenshot image is uploaded */
                      <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center mb-4 shadow-xl">
                          <img
                            src={faviconUrl}
                            alt=""
                            className="w-8 h-8 rounded-lg object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <h4 className="font-sans font-medium text-xl sm:text-2xl text-white mb-2">
                          {project.title}
                        </h4>
                        <p className="font-mono-custom text-xs text-[#999] leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    )}

                    {/* Informative Security Overlay / Banner at bottom of preview */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                      <div className="flex items-center gap-3 min-w-0 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                          🛡️
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="font-sans font-medium text-xs sm:text-sm text-white">
                              Cloudflare & Browser Security Protected
                            </span>
                            <span className="font-mono-custom text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                              Active
                            </span>
                          </div>
                          <p className="font-mono-custom text-[11px] text-[#999] truncate max-w-md mt-0.5">
                            Cross-origin nesting protected. Inspect the live application in a standalone tab.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMode("iframe");
                            setHasError(false);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/15 transition-all"
                        >
                          Try Live Iframe
                        </button>

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
                          >
                            <span>Open Live Site</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Meta Bar */}
          <div className="px-5 py-3 border-t border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="font-mono-custom text-xs text-[#888] truncate max-w-xl">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 flex-shrink-0">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-custom text-[11px] text-[#777] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
