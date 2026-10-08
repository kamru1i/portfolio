"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Reset state whenever active project changes
  useEffect(() => {
    if (project) {
      setIframeLoaded(false);
      setHasError(!project.canEmbed);
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
          className="relative w-full max-w-6xl h-[85vh] max-h-[850px] rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Preview`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#181818]/90">
            {/* Left: Window Controls Mockup + Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono-custom text-xs uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {project.client || "Web System"}
                </span>
                <h3 className="font-sans font-medium text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                  {project.title}
                </h3>
              </div>
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

          {/* Main Preview Area */}
          <div className="relative flex-1 w-full bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
            {project.canEmbed && project.liveUrl && !hasError ? (
              <>
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
                  onError={() => setHasError(true)}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="w-full h-full border-0"
                />
              </>
            ) : (
              /* Fallback UI for sites that restrict framing */
              <div className="flex flex-col items-center justify-center text-center p-6 sm:p-12 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl mb-5 shadow-inner">
                  🌐
                </div>
                <h4 className="font-sans font-medium text-xl sm:text-2xl text-white mb-3">
                  External Production Environment
                </h4>
                <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed mb-6">
                  This production web application enforces strict browser security headers
                  (X-Frame-Options / CSP) that prevent direct inline embedding. You can explore the
                  live implementation directly in a dedicated window.
                </p>

                <div className="flex items-center gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 transition-all shadow-md flex items-center gap-2 group"
                    >
                      <span>Open Live Site</span>
                      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full bg-white/10 text-white font-mono-custom text-xs border border-white/15 hover:bg-white/20 transition-colors flex items-center gap-1.5"
                    >
                      <span>View Code</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Info Bar */}
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
