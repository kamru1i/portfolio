"use client";
/* eslint-disable @next/next/no-img-element -- Uses raw <img> with onError fallback for arbitrary external favicons and screenshots */

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Globe, X } from "lucide-react";
import { GitHubBrandIcon } from "@/components/common/BrandIcons";
import { PortfolioProject } from "@/lib/portfolio-data";
import { getDisplayDomain } from "@/lib/url-utils";
import {
  MODAL_BACKDROP_CLASSES,
  MODAL_OUTER_SHELL_CLASSES,
  getProjectAttribution,
} from "./modal-tokens";

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  if (!project) return null;
  return (
    <ProjectPreviewModalContent
      key={project.id}
      project={project}
      onClose={onClose}
    />
  );
}

function ProjectPreviewModalContent({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll non-destructively
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const displayDomain = getDisplayDomain(project.liveUrl);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${displayDomain}&sz=64`;
  const previewImage = project.previewImageUrl || project.thumbnail;

  return (
    <AnimatePresence>
      <motion.div
        key="project-preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={MODAL_BACKDROP_CLASSES}
        onClick={onClose}
      >
        <motion.div
          key="project-preview-dialog"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={MODAL_OUTER_SHELL_CLASSES}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Preview`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#181818]/90 gap-3 shrink-0">
            {/* Left: Window Controls + Attribution + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="items-center gap-1.5 hidden sm:flex shrink-0"
                aria-hidden="true"
              >
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="font-mono-custom text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 whitespace-nowrap shrink-0 max-w-[130px] truncate"
                  title={getProjectAttribution(project)}
                >
                  {getProjectAttribution(project)}
                </span>
                <h3
                  className="font-sans font-medium text-xs sm:text-sm text-white truncate max-w-[140px] sm:max-w-[220px] md:max-w-[300px]"
                  title={project.title}
                >
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Center: Domain Address Bar */}
            {project.liveUrl && (
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/10 max-w-xs">
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-3.5 h-3.5 rounded-xs object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="font-mono-custom text-xs text-white/75 truncate">
                  https://{displayDomain}
                </span>
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={`/projects/web/${project.slug || project.id}`}
                onClick={onClose}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 font-mono-custom text-xs border border-white/10 transition-colors items-center gap-1.5"
              >
                <span>Case Study</span>
                <ArrowRight className="h-3 w-3" />
              </Link>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 font-mono-custom text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <GitHubBrandIcon className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 font-sans text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Visit Live Site</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project preview"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors ml-0.5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Hero Screenshot Showcase Area (Zero Iframe Lag) */}
          <div className="relative flex-1 w-full bg-[#0a0b0e] flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <div className="relative w-full h-full overflow-hidden group">
                <img
                  src={previewImage}
                  alt={`${project.title} hero section screenshot`}
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle Bottom Gradient & Floating Live Action Bar */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {project.liveUrl && (
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs transition-all flex items-center gap-1.5 shadow-xl"
                    >
                      <span>Open Live Website</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-white/6 border border-white/15 flex items-center justify-center mb-4 text-white/80">
                  <Globe className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-medium text-xl text-white mb-2">
                  {project.title}
                </h4>
                <p className="font-mono-custom text-xs text-[#999] leading-relaxed mb-5">
                  {project.description}
                </p>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5"
                  >
                    <span>Open Live Website</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer Meta Bar */}
          <div className="px-5 py-3 border-t border-white/10 bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <p className="font-mono-custom text-xs text-[#888] truncate max-w-xl">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-custom text-[11px] text-[#777] bg-white/4 px-2 py-0.5 rounded border border-white/6"
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
