"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";
import { extractYouTubeId, extractVimeoId, detectVideoProvider } from "@/lib/video-metadata";
import {
  MODAL_BACKDROP_CLASSES,
  MODAL_VIDEO_SHELL_CLASSES,
  getTruncatedModalTitle,
  getProjectAttribution,
} from "./modal-tokens";

interface VideoPlayerModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function VideoPlayerModal({ project, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("0:00");
  const [durationStr, setDurationStr] = useState<string>("0:00");

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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
    setCurrentTimeStr(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDurationStr(formatTime(videoRef.current.duration));
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current.duration || 1);
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!project) return null;

  const getModalPlayerStageClass = (format?: string) => {
    switch (format) {
      case "9:16":
        return "h-full max-h-full max-w-full aspect-[9/16]";
      case "1:1":
        return "h-full max-h-full max-w-full aspect-square";
      case "4:3":
        return "h-full max-h-full max-w-full aspect-[4/3]";
      case "5:4":
        return "h-full max-h-full max-w-full aspect-[5/4]";
      case "16:9":
      default:
        return "w-full max-w-4xl max-h-full aspect-video";
    }
  };

  const attribution = getProjectAttribution(project);
  const truncatedTitle = getTruncatedModalTitle(project.title, 5);
  const stageAspectClass = getModalPlayerStageClass(project.format);
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={MODAL_VIDEO_SHELL_CLASSES}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Video Player`}
        >
          {/* Top Bar with Project Meta, Format Badge, Truncated Title, Watch Link and Close Button */}
          <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 border-b border-white/10 bg-[#181818]/90 gap-2 shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <span
                className="font-mono-custom text-[11px] uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10 whitespace-nowrap shrink-0 max-w-[140px] truncate"
                title={attribution}
              >
                {attribution}
              </span>

              {project.format && (
                <span
                  className="font-mono-custom text-[10px] text-white/50 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 shrink-0 hidden sm:inline-block"
                  title={`Format: ${project.format}`}
                >
                  {project.format}
                </span>
              )}

              <h3
                className="font-sans font-medium text-xs sm:text-sm text-white truncate max-w-[160px] sm:max-w-[220px] md:max-w-[340px]"
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
                  className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/10 transition-colors flex items-center gap-1 shrink-0"
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

          {/* Video Player Stage with Premiere Pro Rounded Screen Monitor */}
          <div className="relative flex-1 min-h-0 w-full bg-[#0d0d0f] p-2.5 sm:p-4 flex items-center justify-center overflow-hidden">
            <div
              className={`relative ${stageAspectClass} bg-black flex items-center justify-center overflow-hidden group mx-auto rounded-xl sm:rounded-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)]`}
            >
              {embedUrl ? (
                /* YouTube / Vimeo Embedded Player */
                <iframe
                  src={embedUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 rounded-xl sm:rounded-2xl"
                />
              ) : isDirectVideo && url ? (
                /* Direct MP4 / HTML5 Video Player */
                <>
                  <video
                    ref={videoRef}
                    src={url}
                    poster={project.thumbnail}
                    autoPlay
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-full object-contain cursor-pointer rounded-xl sm:rounded-2xl"
                    onClick={togglePlay}
                  />
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto rounded-xl sm:rounded-2xl"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl pl-1 shadow-lg hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>
                  )}
                </>
              ) : isSocialExternal ? (
                /* Social Video Fallback (TikTok / Instagram / Facebook) */
                <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl mb-4">
                    🎬
                  </div>
                  <h4 className="font-sans font-medium text-lg text-white mb-2">
                    External Social Production
                  </h4>
                  <p className="font-mono-custom text-xs text-[#888] leading-relaxed mb-6">
                    This {provider.toUpperCase()} video is hosted on an external social network platform.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
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
          </div>

          {/* Bottom Player Controls for direct video */}
          {isDirectVideo && (
            <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-[#161616] flex flex-col gap-2 shrink-0 border-t border-white/5">
              {/* Scrub Bar */}
              <div className="w-full flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Video seek slider"
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <span className="font-mono-custom text-xs text-[#888] whitespace-nowrap">
                  {currentTimeStr} / {durationStr}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="px-4 py-1.5 rounded-full bg-white text-black font-sans text-xs font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {isPlaying ? "Pause ❚❚" : "Play ▶"}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 hover:text-white font-mono-custom text-xs border border-white/10 transition-colors"
                  >
                    {isMuted ? "Unmute 🔇" : "Mute 🔊"}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Toggle Fullscreen"
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 hover:text-white font-mono-custom text-xs border border-white/10 transition-colors"
                  >
                    Fullscreen ⛶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Description & Tags */}
          <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-[#141414] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            <p className="font-mono-custom text-xs text-[#999] leading-relaxed max-w-2xl line-clamp-2">
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
