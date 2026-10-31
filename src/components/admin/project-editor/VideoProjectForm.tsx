"use client";

import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";
import { AspectRatio, ProjectRecord, VideoProvider } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectFormHeader } from "./ProjectFormHeader";
import { ProjectThumbnailDropzone } from "./ProjectThumbnailDropzone";
import { ProjectSharedDetailsSection } from "./ProjectSharedDetailsSection";
import { useProjectSharedForm } from "./useProjectSharedForm";

interface VideoProjectFormProps {
  mode: "create" | "edit";
  initialProject?: ProjectRecord;
}

export function VideoProjectForm({ mode, initialProject }: VideoProjectFormProps) {
  const shared = useProjectSharedForm({
    mode,
    discipline: "video",
    initialProject,
  });

  const [videoUrl, setVideoUrl] = useState(initialProject?.video_url ?? "");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialProject?.aspect_ratio ?? "16:9"
  );
  const [videoProvider, setVideoProvider] = useState<VideoProvider | null>(
    initialProject?.video_provider ?? null
  );
  const [videoId, setVideoId] = useState<string | null>(
    initialProject?.video_id ?? null
  );

  const initialVideoPreview =
    initialProject?.type === "video" ? initialProject.preview_image_url ?? "" : "";
  const isInitialSvgFallback = initialVideoPreview.startsWith("data:image/svg+xml");

  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string>(
    isInitialSvgFallback ? "" : initialVideoPreview
  );
  const [autoDetectedThumbnail, setAutoDetectedThumbnail] = useState<string | null>(
    () => {
      if (initialProject?.type !== "video") return null;
      if (
        initialVideoPreview &&
        !isInitialSvgFallback &&
        (initialVideoPreview.includes("ytimg.com") ||
          initialVideoPreview.includes("vimeocdn.com") ||
          initialVideoPreview.includes("tiktokcdn"))
      ) {
        return initialVideoPreview;
      }
      if (initialProject.video_provider === "youtube" && initialProject.video_id) {
        return `https://i.ytimg.com/vi/${initialProject.video_id}/hqdefault.jpg`;
      }
      return null;
    }
  );
  const [fallbackSvgThumbnail, setFallbackSvgThumbnail] = useState<string | null>(
    isInitialSvgFallback ? initialVideoPreview : null
  );
  const [isCustomVideoThumbnail, setIsCustomVideoThumbnail] = useState<boolean>(
    () => {
      if (!initialVideoPreview || isInitialSvgFallback) return false;
      if (
        initialVideoPreview.includes("ytimg.com") ||
        initialVideoPreview.includes("vimeocdn.com") ||
        initialVideoPreview.includes("tiktokcdn")
      ) {
        return false;
      }
      return true;
    }
  );
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleResolveVideo = async (urlToResolve = videoUrl) => {
    if (!urlToResolve.trim()) return;
    setResolvingVideo(true);
    setResolveError(null);

    try {
      const res = await fetch("/api/admin/resolve-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlToResolve.trim(),
          title: shared.title.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resolve video details");
      }

      const meta = data.meta;
      setVideoProvider(meta.provider);
      setVideoId(meta.videoId);

      const isRealThumbnail =
        meta.status === "available" &&
        typeof meta.thumbnailUrl === "string" &&
        !meta.thumbnailUrl.startsWith("data:image/svg+xml");

      if (isRealThumbnail) {
        setAutoDetectedThumbnail(meta.thumbnailUrl);
        if (!isCustomVideoThumbnail || !videoThumbnailUrl.trim()) {
          setVideoThumbnailUrl(meta.thumbnailUrl);
          setIsCustomVideoThumbnail(false);
        }
      } else if (typeof meta.thumbnailUrl === "string") {
        setFallbackSvgThumbnail(meta.thumbnailUrl);
      }

      if (meta.aspectRatio) {
        setAspectRatio(meta.aspectRatio);
      }
      if (!shared.isEdit && meta.title && !shared.title) {
        shared.handleTitleChange(meta.title);
      }
    } catch (err: unknown) {
      setResolveError(
        err instanceof Error ? err.message : "Error resolving metadata"
      );
    } finally {
      setResolvingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      shared.setErrorMessage("Video URL is required for Video projects.");
      return;
    }

    const effectiveVideoThumbnail =
      videoThumbnailUrl.trim() ||
      autoDetectedThumbnail ||
      fallbackSvgThumbnail ||
      null;

    await shared.submitProject({
      video_url: videoUrl.trim(),
      video_provider: videoProvider || "other",
      video_id: videoId || null,
      aspect_ratio: aspectRatio,
      preview_image_url: effectiveVideoThumbnail,
    });
  };

  return (
    <div className="w-full space-y-4 select-none">
      <ProjectFormHeader
        discipline="video"
        isEdit={shared.isEdit}
        projectId={initialProject?.id}
      />

      {shared.errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {shared.errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyDown={shared.handleFormKeyDown}
        className="space-y-4"
      >
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-sky-400">
              Video Source, Aspect Ratio &amp; Thumbnail
            </h3>
            <span className="font-mono-custom text-[11px] text-[#666]">
              Active Ratio: <strong className="text-white">{aspectRatio}</strong>
            </span>
          </div>

          {/* Single Line: Video URL + Detect + Aspect Ratio + Video Thumbnail (Drop / Paste / Upload) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-end">
            {/* 1. Video URL + Detect Button */}
            <div className="xl:col-span-5 min-w-0">
              <Label htmlFor="project-video-url" className="mb-1.5">
                Video URL (YouTube, Vimeo, TikTok, MP4, etc.) *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="project-video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={() => {
                    if (!shared.isEdit) void handleResolveVideo();
                  }}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 h-11 py-2"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleResolveVideo()}
                  disabled={resolvingVideo || !videoUrl.trim()}
                  className="h-11 px-3.5 py-2 shrink-0 text-xs"
                >
                  {resolvingVideo ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                      <span>Detect</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 2. Compact Aspect Ratio Selector */}
            <div className="xl:col-span-3 shrink-0">
              <Label className="mb-1.5">Aspect Ratio *</Label>
              <div className="h-11 flex items-center justify-between gap-1 bg-black/30 px-2 py-1 rounded-xl border border-white/10">
                {(
                  [
                    { id: "16:9", label: "16:9", box: "w-5 h-3" },
                    { id: "9:16", label: "9:16", box: "w-2.5 h-4" },
                    { id: "1:1", label: "1:1", box: "w-3.5 h-3.5" },
                    { id: "4:3", label: "4:3", box: "w-4.5 h-3" },
                    { id: "5:4", label: "5:4", box: "w-4 h-3" },
                  ] as const
                ).map((opt) => {
                  const isSelected = aspectRatio === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAspectRatio(opt.id as AspectRatio)}
                      className={`flex-1 h-full px-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                        isSelected
                          ? "bg-white/15 text-white shadow-xs"
                          : "text-[#777] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-mono-custom text-[10px] font-semibold leading-none">
                        {opt.label}
                      </span>
                      <div className="h-4 flex items-center justify-center">
                        <div
                          className={`${opt.box} border ${
                            isSelected
                              ? "border-sky-400 bg-sky-400/25"
                              : "border-white/30 bg-white/5"
                          } rounded-[2px]`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Reusable Thumbnail Dropzone on the Same Line */}
            <div className="xl:col-span-4 min-w-0">
              <ProjectThumbnailDropzone
                targetType="video"
                label="Video Thumbnail"
                imageUrl={videoThumbnailUrl}
                fallbackPreviewUrl={fallbackSvgThumbnail}
                autoDetectedUrl={autoDetectedThumbnail}
                isCustomOverride={isCustomVideoThumbnail}
                onImageUploaded={(url) => {
                  setVideoThumbnailUrl(url);
                  setIsCustomVideoThumbnail(true);
                }}
                onRemoveImage={() => {
                  setVideoThumbnailUrl("");
                  setIsCustomVideoThumbnail(false);
                }}
                onRestoreAutoImage={
                  autoDetectedThumbnail
                    ? () => {
                        setVideoThumbnailUrl(autoDetectedThumbnail);
                        setIsCustomVideoThumbnail(false);
                      }
                    : undefined
                }
                onUploadError={setUploadError}
              />
            </div>
          </div>

          {resolveError && (
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom">
              {resolveError} — Upload, drag &amp; drop, or paste (`Ctrl+V`) a custom thumbnail.
            </div>
          )}

          {uploadError && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
              {uploadError}
            </div>
          )}
        </Card>

        <ProjectSharedDetailsSection
          discipline="video"
          projectId={initialProject?.id}
          shared={shared}
        />
      </form>
    </div>
  );
}
