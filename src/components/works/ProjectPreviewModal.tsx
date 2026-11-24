"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "motion/react";
import { FileText, Globe, X } from "lucide-react";
import { GitHubBrandIcon } from "@/components/common/BrandIcons";
import type { PortfolioProject } from "@/lib/portfolio-data";
import {
  getDisplayDomain,
  isNextImageOptimizedUrl,
  toSafeExternalUrl,
} from "@/lib/url-utils";
import {
  MODAL_BACKDROP_CLASSES,
  getProjectAttribution,
} from "./modal-tokens";

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <ProjectPreviewModalContent
          key={project.id}
          project={project}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

function ProjectPreviewModalContent({
  project,
  onClose,
}: {
  project: PortfolioProject;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });
  // Default to 16:9 widescreen ratio; refine to exact screenshot ratio on load so zero pixels are ever cropped
  const [imageRatio, setImageRatio] = useState<number>(16 / 9);

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus trap, ESC dismiss, and Lenis + body scroll lock while active
  useEffect(() => {
    const prevFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
    lenis?.stop?.();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === dialogRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      lenis?.start?.();
      prevFocus?.focus();
    };
  }, [onClose]);

  const displayDomain = getDisplayDomain(project.liveUrl);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(displayDomain)}&sz=64`;
  const previewImage = project.previewImageUrl || project.thumbnail;
  const safeGithubUrl = toSafeExternalUrl(project.githubUrl);
  const safeLiveUrl = toSafeExternalUrl(project.liveUrl);

  // Compute exact stage dimensions so the full 16:9 screenshot fits 100% edge-to-edge without cropping
  const paddingX = viewportSize.width < 640 ? 20 : 40;
  const maxModalW = Math.min(1152, Math.max(280, viewportSize.width - paddingX));
  const chromeHeight = 52; // Top Header Bar only
  const maxMediaH = Math.max(
    180,
    Math.min(700, Math.round(viewportSize.height * 0.84) - chromeHeight)
  );
  const effectiveRatio = imageRatio >= 1.2 ? imageRatio : 16 / 9;
  const mediaHeight = Math.round(Math.min(maxMediaH, maxModalW / effectiveRatio));
  const mediaWidth = Math.round(mediaHeight * effectiveRatio);
  const modalWidth = Math.max(Math.min(maxModalW, 380), mediaWidth);

  return (
    <m.div
      key="project-preview-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={MODAL_BACKDROP_CLASSES}
      onClick={onClose}
    >
      <m.div
        ref={dialogRef}
        tabIndex={-1}
        key="project-preview-dialog"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: `${modalWidth}px`,
          maxWidth: "calc(100vw - 20px)",
        }}
        className="relative rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto outline-none"
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
          {safeLiveUrl && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/10 max-w-xs">
              <Image
                src={faviconUrl}
                alt=""
                width={14}
                height={14}
                unoptimized
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

          {/* Right: Icon Actions (Case Study, GitHub, Live Website, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href={`/projects/web/${project.slug || project.id}`}
              onClick={onClose}
              title="View Case Study"
              aria-label="View Case Study"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>

            {safeGithubUrl && (
              <a
                href={safeGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                aria-label="GitHub Repository"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
              >
                <GitHubBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            )}

            {safeLiveUrl && (
              <a
                href={safeLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Live Site"
                aria-label="Visit Live Site"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Close Preview"
              aria-label="Close project preview"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors ml-0.5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main 16:9 Hero Screenshot Showcase Area (Zero Cropping, Zero Iframe Lag) */}
        <div
          style={{
            height: previewImage ? `${mediaHeight}px` : undefined,
            minHeight: previewImage ? undefined : "320px",
          }}
          className="relative w-full bg-[#0a0b0e] flex items-center justify-center overflow-hidden"
        >
          {previewImage ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              <Image
                src={previewImage}
                alt={`${project.title} hero section screenshot`}
                fill
                unoptimized={!isNextImageOptimizedUrl(previewImage)}
                sizes="(max-width: 640px) 100vw, 1152px"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth > 0 && naturalHeight > 0) {
                    setImageRatio(naturalWidth / naturalHeight);
                  }
                }}
                className="object-contain block"
              />
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-white/6 border border-white/15 flex items-center justify-center mb-4 text-white/80">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="font-sans font-medium text-xl text-white mb-2">
                {project.title}
              </h4>
              <p className="font-mono-custom text-xs text-[#999] leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
        </div>
      </m.div>
    </m.div>
  );
}
