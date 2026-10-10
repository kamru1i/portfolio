"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";
import { extractYouTubeId, extractVimeoId, detectVideoProvider } from "@/lib/video-metadata";
import {
  MODAL_BACKDROP_CLASSES,
  getTruncatedModalTitle,
  getProjectAttribution,
  computeAspectModalDimensions,
} from "./modal-tokens";

interface VideoPlayerModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function VideoPlayerModal({ project, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Check provider specifics
  let embedUrl: string | null = null;
  if (provider === "youtube") {
    const { videoId } = extractYouTubeId(url);
    if (videoId) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  } else if (provider === "vimeo") {
    const videoId = extractVimeoId(url);
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
  }

  const isDirectVideo = provider === "local" || (!embedUrl && url.match(/\.(mp4|webm|ogg|mov)$/i));
  const isSocialExternal = !isDirectVideo && !embedUrl;

  const attribution = getProjectAttribution(project);
  const isPortrait = project.format === "9:16";
  const truncatedTitle = getTruncatedModalTitle(project.title, isPortrait ? 4 : 5);

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
                  className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/10 transition-colors flex items-center gap-1 shrink-0"
                  title="Watch on original video platform"
                >
                  <span>Watch</span>
                  <span>↗</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close video player"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors shrink-0 ml-0.5"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Full-Bleed Media Viewport matching Web Modal pattern (starts immediately below header, fills available space) */}
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
                poster={project.thumbnail}
                autoPlay
                playsInline
                controls
                className="w-full h-full block object-contain border-0"
              />
            ) : isSocialExternal ? (
              /* Social Video Fallback (TikTok / Instagram / Facebook) */
              <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl mb-3">
                  🎬
                </div>
                <h4 className="font-sans font-medium text-base text-white mb-1.5">
                  External Social Production
                </h4>
                <p className="font-mono-custom text-xs text-[#888] leading-relaxed mb-5">
                  This {provider.toUpperCase()} video is hosted on an external social network platform.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Watch on {provider.toUpperCase()}</span>
                  <span>↗</span>
                </a>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="font-mono-custom text-sm text-[#888]">
                  Video preview asset loading...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
