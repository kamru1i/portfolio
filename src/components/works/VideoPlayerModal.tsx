"use client";
/* eslint-disable @next/next/no-img-element -- Uses raw <img> for full-bleed thumbnail fallback */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Play, X } from "lucide-react";
import {
  YouTubeBrandIcon,
  TikTokBrandIcon,
  VimeoBrandIcon,
  InstagramBrandIcon,
  FacebookBrandIcon,
} from "@/components/common/BrandIcons";
import { PortfolioProject } from "@/lib/portfolio-data";
import { detectVideoProvider, resolvePlayableEmbedUrl } from "@/lib/video-metadata";
import {
  MODAL_BACKDROP_CLASSES,
  getTruncatedModalTitle,
  getProjectAttribution,
  computeAspectModalDimensions,
} from "./modal-tokens";

function renderPlatformIcon(provider: string) {
  switch (provider) {
    case "youtube":
      return <YouTubeBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    case "tiktok":
      return <TikTokBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    case "vimeo":
      return <VimeoBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    case "instagram":
      return <InstagramBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    case "facebook":
      return <FacebookBrandIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    default:
      return <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />;
  }
}

interface VideoPlayerModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function VideoPlayerModal({ project, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Track viewport dimensions responsively
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const url = project.videoUrl || "";
  const provider = detectVideoProvider(url);
  const embedUrl = resolvePlayableEmbedUrl(url, {
    autoplay: true,
    privacyEnhanced: true,
  });

  const isDirectVideo =
    (provider === "local" || (!embedUrl && Boolean(url.match(/\.(mp4|webm|ogg|mov)$/i)))) &&
    failedVideoId !== project.id;
  const fallbackThumbnail = project.previewImageUrl || project.thumbnail;

  const attribution = getProjectAttribution(project);
  const isPortrait = project.format === "9:16";
  const truncatedTitle = getTruncatedModalTitle(project.title, isPortrait ? 4 : 5);
  const platformLabel =
    provider && provider !== "other" && provider !== "local"
      ? provider.charAt(0).toUpperCase() + provider.slice(1)
      : "Original Platform";

  const dimensions = computeAspectModalDimensions(
    project.format,
    viewportSize.width,
    viewportSize.height
  );

  return (
    <AnimatePresence>
      <motion.div
        key="video-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={MODAL_BACKDROP_CLASSES}
        onClick={onClose}
      >
        <motion.div
          key="video-modal-dialog"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: `${dimensions.modalWidth}px`,
            height: `${dimensions.modalHeight}px`,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "720px",
          }}
          className="relative rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Video Player`}
        >
          {/* Top Bar with Project Meta, Format Badge, Truncated Title, Watch Link and Close Button */}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#181818]/90 gap-2 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <span
                className="font-mono-custom text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10 whitespace-nowrap shrink-0 max-w-[110px] sm:max-w-[140px] truncate"
                title={attribution}
              >
                {attribution}
              </span>

              {project.format && (
                <span
                  className="font-mono-custom text-[10px] text-white/50 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 shrink-0 hidden sm:inline-block"
                  title={`Format: ${project.format}`}
                >
                  {project.format}
                </span>
              )}

              <h3
                className="font-sans font-medium text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[340px]"
                title={project.title}
                aria-label={project.title}
              >
                {truncatedTitle}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title={`Watch on ${platformLabel}`}
                  aria-label={`Watch on ${platformLabel}`}
                >
                  {renderPlatformIcon(provider)}
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                title="Close Preview"
                aria-label="Close video player"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors shrink-0 ml-0.5 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Full-Bleed Media Viewport matching modal aspect ratio with zero empty space */}
          <div className="relative flex-1 min-w-0 min-h-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
            {embedUrl ? (
              /* YouTube / Vimeo Embedded Player — fills 100% of media viewport full-bleed */
              <iframe
                src={embedUrl}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full block border-0"
              />
            ) : isDirectVideo && url ? (
              /* Direct MP4 / HTML5 Video Player — fills 100% of media viewport full-bleed */
              <video
                ref={videoRef}
                src={url}
                poster={fallbackThumbnail}
                autoPlay
                playsInline
                controls
                onError={() => setFailedVideoId(project.id)}
                className="w-full h-full block object-cover border-0"
              />
            ) : fallbackThumbnail ? (
              /* Full-Bleed Thumbnail Fallback when video cannot be embedded/played in modal */
              <a
                href={url || undefined}
                target={url ? "_blank" : undefined}
                rel={url ? "noopener noreferrer" : undefined}
                title={url ? `Watch on ${platformLabel}` : project.title}
                className="relative group w-full h-full block overflow-hidden"
              >
                <img
                  src={fallbackThumbnail}
                  alt={project.title}
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center text-white/80 mb-3">
                  <Film className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-medium text-base text-white">
                  {project.title}
                </h4>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
