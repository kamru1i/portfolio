"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";
import { extractYouTubeId, extractVimeoId, detectVideoProvider } from "@/lib/video-metadata";

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

  const isPortrait = project.format === "9:16";
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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          key="video-modal-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative w-full ${
            isPortrait ? "max-w-md" : "max-w-5xl"
          } rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} Video Player`}
        >
          {/* Top Bar with Project Meta and Close Button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#181818]/80">
            <div className="flex items-center gap-3">
              <span className="font-mono-custom text-xs uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                {isPortrait ? "9:16 Reel" : project.client || "Video Production"}
              </span>
              <h3 className="font-sans font-medium text-base sm:text-lg text-white truncate max-w-md">
                {project.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Video Player Container */}
          <div
            className={`relative w-full ${
              isPortrait ? "aspect-[9/16] max-h-[70vh]" : "aspect-video"
            } bg-black flex items-center justify-center overflow-hidden group mx-auto`}
          >
            {embedUrl ? (
              /* YouTube / Vimeo Embedded Player */
              <iframe
                src={embedUrl}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
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
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={togglePlay}
                />
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
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

          {/* Bottom Player Controls for direct video */}
          {isDirectVideo && (
            <div className="p-4 sm:p-5 bg-[#161616] flex flex-col gap-3">
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
          <div className="p-4 sm:p-5 bg-[#141414] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="font-mono-custom text-xs text-[#999] leading-relaxed max-w-2xl">
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
