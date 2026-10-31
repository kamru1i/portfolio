"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Globe,
  Upload,
  Monitor,
  ShieldAlert,
  Check,
  Loader2,
  Trash2,
  Sparkles,
  ClipboardPaste,
  RotateCcw,
  ImagePlus,
} from "lucide-react";
import {
  AspectRatio,
  ProjectRecord,
  ProjectType,
  VideoProvider,
  WebPreviewMode,
} from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectEditorFormProps {
  mode: "create" | "edit";
  initialProject?: ProjectRecord;
}

const SLUG_PATTERN = /^[A-Za-z0-9-]+$/;

function toUrlSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProjectEditorForm({ mode, initialProject }: ProjectEditorFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && Boolean(initialProject);

  // Discipline ('video' | 'web') — selectable on create, fixed on edit
  const [projectType, setProjectType] = useState<ProjectType>(
    initialProject?.type ?? "video"
  );
  const isVideo = projectType === "video";

  // Shared Project Fields
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [clientName, setClientName] = useState(initialProject?.client_name ?? "");
  const [year, setYear] = useState(
    initialProject ? initialProject.year ?? "" : new Date().getFullYear().toString()
  );
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [role, setRole] = useState(initialProject?.role ?? "");
  const [overview, setOverview] = useState(initialProject?.overview ?? "");
  const [deliverablesInput, setDeliverablesInput] = useState(
    (initialProject?.deliverables ?? []).join(", ")
  );
  const [tagsInput, setTagsInput] = useState((initialProject?.tags ?? []).join(", "));
  const [manualPriority, setManualPriority] = useState<string>(() => {
    if (!initialProject) return "";
    if (initialProject.manual_priority) return initialProject.manual_priority.toString();
    if (initialProject.sort_order && initialProject.sort_order > 0) {
      return initialProject.sort_order.toString();
    }
    return "";
  });
  const [isPublished, setIsPublished] = useState(initialProject?.is_published ?? true);

  // Video Fields
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
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Web Fields
  const [liveUrl, setLiveUrl] = useState(initialProject?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initialProject?.github_url ?? "");
  const [previewMode, setPreviewMode] = useState<WebPreviewMode>(() => {
    if (!initialProject) return "iframe";
    return (
      initialProject.preview_mode ||
      (initialProject.can_embed === false ? "fallback" : "iframe")
    );
  });
  const [webPreviewImageUrl, setWebPreviewImageUrl] = useState(
    initialProject && initialProject.type === "web"
      ? initialProject.preview_image_url ?? ""
      : ""
  );

  // Shared Image Upload / Drag & Drop / Clipboard Paste State
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (nextTitle: string) => {
    const prevAutoSlug = toUrlSlug(title);
    setTitle(nextTitle);
    if (!isEdit && (!slug || slug === prevAutoSlug)) {
      setSlug(toUrlSlug(nextTitle));
    }
  };

  const handleUploadImage = useCallback(
    async (file: File, targetType: "video" | "web" = isVideo ? "video" : "web") => {
      setUploadingScreenshot(true);
      setScreenshotError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", targetType);

        const res = await fetch("/api/admin/upload-screenshot", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error ||
              (targetType === "video"
                ? "Failed to upload video thumbnail"
                : "Failed to upload screenshot")
          );
        }

        if (data.url) {
          if (targetType === "video") {
            setVideoThumbnailUrl(data.url);
            setIsCustomVideoThumbnail(true);
          } else {
            setWebPreviewImageUrl(data.url);
          }
        }
      } catch (err: unknown) {
        setScreenshotError(
          err instanceof Error ? err.message : "Failed to upload image"
        );
      } finally {
        setUploadingScreenshot(false);
      }
    },
    [isVideo]
  );

  // Global Clipboard Paste listener (Ctrl+V / Win+V image paste)
  useEffect(() => {
    const onWindowPaste = (e: ClipboardEvent) => {
      if (uploadingScreenshot) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            const ext = item.type.split("/")[1] || "png";
            const fileName = `${isVideo ? "video-thumbnail" : "web-screenshot"}-${Date.now()}.${ext}`;
            const imageFile = new File([blob], fileName, { type: item.type });
            void handleUploadImage(imageFile, isVideo ? "video" : "web");
            return;
          }
        }
      }
    };

    window.addEventListener("paste", onWindowPaste);
    return () => window.removeEventListener("paste", onWindowPaste);
  }, [handleUploadImage, isVideo, uploadingScreenshot]);

  const handleClipboardButtonPaste = async (targetType: "video" | "web") => {
    setScreenshotError(null);
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error(
          "Your browser does not support button clipboard reading. Press Ctrl+V (or Win+V) directly to paste your copied image."
        );
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split("/")[1] || "png";
          const fileName = `${targetType === "video" ? "video-thumbnail" : "web-screenshot"}-${Date.now()}.${ext}`;
          const file = new File([blob], fileName, { type: imageType });
          await handleUploadImage(file, targetType);
          return;
        }
      }
      throw new Error(
        "No copied image found in clipboard. Copy a screenshot or image first, then press Ctrl+V or click Paste Image."
      );
    } catch (err: unknown) {
      setScreenshotError(
        err instanceof Error
          ? err.message
          : "Press Ctrl+V (or Win+V) directly on the page to paste your copied image."
      );
    }
  };

  const handleDropImage = (
    e: React.DragEvent<HTMLDivElement>,
    targetType: "video" | "web"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (uploadingScreenshot) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setScreenshotError("Please drop a valid image file (PNG, JPG, WebP, or AVIF).");
        return;
      }
      void handleUploadImage(file, targetType);
    }
  };

  const handleResolveVideo = async (urlToResolve = videoUrl) => {
    if (!urlToResolve.trim()) return;
    setResolvingVideo(true);
    setResolveError(null);

    try {
      const res = await fetch("/api/admin/resolve-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToResolve.trim(), title: title.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resolve video details");
      }

      const meta = data.meta;
      setVideoProvider(meta.provider);
      setVideoId(meta.videoId);
      setResolutionStatus(meta.status || null);

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
      if (!isEdit && meta.title && !title) {
        handleTitleChange(meta.title);
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
    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (!title.trim()) throw new Error("Project title is required.");
      const trimmedSlug = slug.trim();
      if (trimmedSlug && !SLUG_PATTERN.test(trimmedSlug)) {
        throw new Error(
          "URL slug may only contain letters, numbers, and hyphens (no spaces or slashes)."
        );
      }
      if (isVideo && !videoUrl.trim()) {
        throw new Error("Video URL is required for Video projects.");
      }
      if (!isVideo && !liveUrl.trim()) {
        throw new Error("Live URL is required for Web projects.");
      }

      const parsedPriority = manualPriority.trim()
        ? parseInt(manualPriority.trim(), 10)
        : null;
      if (
        parsedPriority !== null &&
        (isNaN(parsedPriority) || parsedPriority <= 0)
      ) {
        throw new Error(
          "Display priority must be a positive integer (e.g. 1, 2, 3...) or left blank."
        );
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const deliverables = deliverablesInput
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const effectiveVideoThumbnail =
        videoThumbnailUrl.trim() ||
        autoDetectedThumbnail ||
        fallbackSvgThumbnail ||
        null;

      const payload = {
        ...(isEdit ? {} : { type: projectType }),
        title: title.trim(),
        slug: trimmedSlug || undefined,
        client_name: clientName.trim() || null,
        year: year.trim() || null,
        description: description.trim(),
        role: role.trim() || null,
        overview: overview.trim() || null,
        deliverables,
        tags,
        manual_priority: parsedPriority,
        is_published: isPublished,
        ...(isVideo
          ? {
              video_url: videoUrl.trim(),
              video_provider: videoProvider || "other",
              video_id: videoId || null,
              aspect_ratio: aspectRatio,
              preview_image_url: effectiveVideoThumbnail,
            }
          : {
              live_url: liveUrl.trim(),
              github_url: githubUrl.trim() || null,
              can_embed: previewMode === "iframe",
              preview_mode: previewMode,
              preview_image_url: webPreviewImageUrl.trim() || null,
              aspect_ratio: "16:9" as AspectRatio,
            }),
      };

      const endpoint =
        isEdit && initialProject
          ? `/api/admin/projects/${initialProject.id}`
          : "/api/admin/projects";

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(
          resData.error ||
            (isEdit ? "Failed to update project" : "Failed to create project")
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal uppercase tracking-tight">
            {isEdit ? "Edit Project" : "Create Project"}
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            {isEdit
              ? "Update project metadata, media preview settings, and case study details."
              : "Configure discipline, media source, and case study details for a new portfolio item."}
          </p>
        </div>

        <Link
          href="/admin"
          className={buttonVariants({ variant: "secondary", size: "default" })}
        >
          Cancel
        </Link>
      </div>

      {/* Discipline Selection (Create) or Fixed Discipline Indicator (Edit) */}
      {!isEdit ? (
        <Card className="p-6 space-y-4">
          <Label>1. Select Project Discipline</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setProjectType("video")}
              className={`p-5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isVideo
                  ? "bg-white/10 border-white text-white shadow-md ring-1 ring-white/20"
                  : "bg-white/2 border-white/10 text-[#888] hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 mb-3">
                <Film className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="font-sans font-medium text-base text-white">
                Video Project
              </div>
              <p className="font-mono-custom text-xs text-[#888] mt-1">
                Editorial video showcase layout, 16:9 or 9:16, YouTube/TikTok auto-metadata.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProjectType("web")}
              className={`p-5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                !isVideo
                  ? "bg-white/10 border-white text-white shadow-md ring-1 ring-white/20"
                  : "bg-white/2 border-white/10 text-[#888] hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-3">
                <Globe className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="font-sans font-medium text-base text-white">
                Web Project
              </div>
              <p className="font-mono-custom text-xs text-[#888] mt-1">
                4-column web case study cards, live preview modal, GitHub integration.
              </p>
            </button>
          </div>
        </Card>
      ) : (
        <Card className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white">
              {isVideo ? (
                <Film className="h-5 w-5 text-sky-400" aria-hidden="true" />
              ) : (
                <Globe className="h-5 w-5 text-purple-400" aria-hidden="true" />
              )}
            </div>
            <div>
              <span className="font-sans text-sm font-medium text-white block">
                {isVideo ? "Video Project" : "Web Project"}
              </span>
              <span className="font-mono-custom text-xs text-[#888]">
                Discipline is fixed to preserve editorial consistency.
              </span>
            </div>
          </div>
          {initialProject && (
            <span className="font-mono-custom text-xs text-[#666]">
              ID: {initialProject.id.slice(0, 8)}...
            </span>
          )}
        </Card>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMessage}
        </div>
      )}

      {/* Main Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {isVideo ? (
          <Card className="p-6 space-y-5">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-sky-400">
              Video Source &amp; Metadata
            </h3>

            <div>
              <Label htmlFor="project-video-url" className="mb-2">
                Video URL (YouTube, Vimeo, TikTok, Facebook, Instagram, MP4, etc.) *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="project-video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={() => {
                    if (!isEdit) handleResolveVideo();
                  }}
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://www.tiktok.com/@..."
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={() => handleResolveVideo()}
                  disabled={resolvingVideo || !videoUrl.trim()}
                  className="h-auto px-4 py-3 shrink-0"
                >
                  {resolvingVideo ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      <span>Resolving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{isEdit ? "Re-Detect" : "Detect & Preview"}</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="font-mono-custom text-[11px] text-[#666] mt-1.5">
                Automatically resolves provider, aspect ratio, and default thumbnail (if available from YouTube/Vimeo/TikTok).
              </p>
            </div>

            {resolveError && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom">
                {resolveError} — You can upload, drag &amp; drop, or paste a custom thumbnail image below.
              </div>
            )}

            {/* 5-Option Aspect Ratio Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Aspect Ratio Format *</Label>
                <span className="font-mono-custom text-[11px] text-[#666]">
                  Active: <strong className="text-white">{aspectRatio}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(
                  [
                    { id: "16:9", label: "16:9", sub: "Landscape", box: "w-8 h-4.5" },
                    { id: "9:16", label: "9:16", sub: "Portrait", box: "w-4 h-7" },
                    { id: "1:1", label: "1:1", sub: "Square", box: "w-5.5 h-5.5" },
                    { id: "4:3", label: "4:3", sub: "Standard", box: "w-7 h-5" },
                    { id: "5:4", label: "5:4", sub: "Near-Square", box: "w-6.5 h-5" },
                  ] as const
                ).map((opt) => {
                  const isSelected = aspectRatio === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAspectRatio(opt.id as AspectRatio)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                        isSelected
                          ? "bg-white/15 border-white text-white shadow-sm ring-1 ring-white/20"
                          : "bg-white/2 border-white/10 text-[#888] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div
                        className={`${opt.box} border-2 ${
                          isSelected
                            ? "border-white bg-white/20"
                            : "border-white/30 bg-white/5"
                        } rounded-sm flex items-center justify-center`}
                      />
                      <div className="text-center">
                        <span className="font-mono-custom text-xs font-semibold block leading-tight">
                          {opt.label}
                        </span>
                        <span className="font-mono-custom text-[10px] text-[#777] block mt-0.5">
                          {opt.sub}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="font-mono-custom text-[11px] text-[#666] mt-1.5">
                Source of truth for editorial works card display and player stage modal.
              </p>
            </div>

            {/* Video Card Thumbnail — Auto-Detected Default + Custom Upload / Drag & Drop / Clipboard Paste */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label>Video Card Thumbnail (Auto-Detected or Custom Upload)</Label>
                <span className="font-mono-custom text-[11px] text-emerald-400 flex items-center gap-1">
                  {videoThumbnailUrl ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {isCustomVideoThumbnail
                          ? "Custom Thumbnail Active"
                          : "Auto-Detected Thumbnail Active"}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#888]">
                      Auto-detects from YouTube/Vimeo or Upload Custom Image
                    </span>
                  )}
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDraggingOver) setIsDraggingOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingOver(false);
                }}
                onDrop={(e) => handleDropImage(e, "video")}
                className={`p-5 rounded-xl border border-dashed transition-all flex flex-col lg:flex-row items-center justify-between gap-4 ${
                  isDraggingOver
                    ? "bg-sky-500/10 border-sky-400 ring-2 ring-sky-400/25"
                    : "bg-[#18181b] border-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-start gap-3.5 text-center sm:text-left">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-medium text-white">
                      {isDraggingOver
                        ? "Drop Thumbnail Image Here to Upload"
                        : "Drag & Drop, Paste (Ctrl+V / Win+V), or Upload Video Thumbnail"}
                    </p>
                    <p className="font-mono-custom text-[11px] text-[#888]">
                      If the video link has an auto-thumbnail (like YouTube), it is used by default. Upload or paste (`Ctrl+V`) a custom image for external links or custom artwork (PNG, JPG, WebP, AVIF — max 8 MB).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={uploadingScreenshot}
                    onClick={() => handleClipboardButtonPaste("video")}
                    className="h-auto px-3.5 py-2.5 text-xs"
                    title="Paste copied image from clipboard (or press Ctrl+V anywhere)"
                  >
                    <ClipboardPaste className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Paste (Ctrl+V)</span>
                  </Button>

                  <label className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs cursor-pointer transition-all flex items-center gap-2 shrink-0 shadow-sm">
                    {uploadingScreenshot ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      disabled={uploadingScreenshot}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleUploadImage(file, "video");
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {screenshotError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
                  {screenshotError}
                </div>
              )}

              {(videoThumbnailUrl || fallbackSvgThumbnail) && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className={`relative ${
                      aspectRatio === "9:16"
                        ? "w-20 h-36"
                        : aspectRatio === "1:1"
                        ? "w-24 h-24"
                        : "w-44 h-24"
                    } rounded-lg overflow-hidden bg-black shrink-0 border border-white/15`}
                  >
                    <Image
                      src={videoThumbnailUrl || fallbackSvgThumbnail || ""}
                      alt="Video thumbnail preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {videoThumbnailUrl ? (
                          <Badge
                            variant={isCustomVideoThumbnail ? "success" : "info"}
                          >
                            <Check className="h-3 w-3" aria-hidden="true" />
                            <span>
                              {isCustomVideoThumbnail
                                ? "Custom Video Thumbnail"
                                : "Auto-Detected Video Thumbnail"}
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="default">
                            Branded Fallback Preview Card
                          </Badge>
                        )}
                        {videoProvider && (
                          <Badge variant="default">
                            {videoProvider.toUpperCase()}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {autoDetectedThumbnail &&
                          videoThumbnailUrl !== autoDetectedThumbnail && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="xs"
                              onClick={() => {
                                setVideoThumbnailUrl(autoDetectedThumbnail);
                                setIsCustomVideoThumbnail(false);
                              }}
                            >
                              <RotateCcw className="h-3 w-3" aria-hidden="true" />
                              <span>Use Auto Thumbnail</span>
                            </Button>
                          )}

                        {videoThumbnailUrl && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="xs"
                            onClick={() => {
                              setVideoThumbnailUrl("");
                              setIsCustomVideoThumbnail(false);
                            }}
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                            <span>Remove</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="font-mono-custom text-xs text-[#aaa]">
                      Active Ratio: <strong className="text-white">{aspectRatio}</strong>
                      {videoId && (
                        <span className="ml-2 text-[#777]">
                          (ID: <span className="text-white">{videoId}</span>)
                        </span>
                      )}
                    </div>

                    {videoThumbnailUrl && (
                      <p className="font-mono-custom text-xs text-[#888] truncate">
                        {videoThumbnailUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label
                  htmlFor="project-video-thumbnail-url"
                  className="text-[11px] text-[#777] mb-1.5"
                >
                  Or Paste Thumbnail Image URL / Path Directly
                </Label>
                <Input
                  id="project-video-thumbnail-url"
                  type="text"
                  value={videoThumbnailUrl}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setVideoThumbnailUrl(nextVal);
                    setIsCustomVideoThumbnail(
                      Boolean(nextVal.trim()) && nextVal.trim() !== autoDetectedThumbnail
                    );
                  }}
                  placeholder="https://i.ytimg.com/... or /images/projects/... or https://..."
                  className="py-2.5 text-xs font-mono-custom"
                />
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 space-y-5">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-purple-400">
              Web Application Links, Preview Mode &amp; Screenshot
            </h3>

            <div>
              <Label htmlFor="project-live-url" className="mb-2">
                Live Website URL *
              </Label>
              <Input
                id="project-live-url"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                required
                placeholder="https://example.com"
              />
              <p className="font-mono-custom text-[11px] text-[#666] mt-1.5">
                Clicking the project card opens the preview modal with direct links to this Live Website and GitHub.
              </p>
            </div>

            <div>
              <Label htmlFor="project-github-url" className="mb-2">
                GitHub Repository URL (Optional)
              </Label>
              <Input
                id="project-github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kamru1i/project"
              />
            </div>

            {/* Web Preview Mode Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label>Interactive Modal Preview Mode</Label>
                <span className="font-mono-custom text-[11px] text-[#777]">
                  Active:{" "}
                  <strong className="text-white">
                    {previewMode === "iframe" ? "Live Iframe" : "Protected Fallback"}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode("iframe")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    previewMode === "iframe"
                      ? "bg-emerald-950/30 border-emerald-500/60 text-white"
                      : "bg-[#18181b] border-white/10 text-[#888] hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="font-mono-custom text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                    <Monitor className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Live Interactive Iframe</span>
                  </div>
                  <p className="font-mono-custom text-[11px] text-[#888] mt-1 leading-relaxed">
                    Embeds the live site directly inside the modal viewport with desktop/mobile switcher.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("fallback")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    previewMode === "fallback"
                      ? "bg-amber-950/30 border-amber-500/60 text-white"
                      : "bg-[#18181b] border-white/10 text-[#888] hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="font-mono-custom text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Protected / Fallback Card</span>
                  </div>
                  <p className="font-mono-custom text-[11px] text-[#888] mt-1 leading-relaxed">
                    Use when target site sets X-Frame-Options or CSP frame-ancestors; displays summary &amp; launch CTA cleanly.
                  </p>
                </button>
              </div>
            </div>

            {/* Homepage Screenshot Upload, Drag & Drop, Clipboard Paste & Static Preview */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label>Homepage Screenshot (Static Card View) *</Label>
                <span className="font-mono-custom text-[11px] text-emerald-400 flex items-center gap-1">
                  {webPreviewImageUrl ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Screenshot Ready</span>
                    </>
                  ) : (
                    <span className="text-[#888]">
                      Drag &amp; Drop, Paste (Ctrl+V), or Upload PNG / JPG / WebP
                    </span>
                  )}
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDraggingOver) setIsDraggingOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingOver(false);
                }}
                onDrop={(e) => handleDropImage(e, "web")}
                className={`p-5 rounded-xl border border-dashed transition-all flex flex-col lg:flex-row items-center justify-between gap-4 ${
                  isDraggingOver
                    ? "bg-purple-500/10 border-purple-400 ring-2 ring-purple-400/25"
                    : "bg-[#18181b] border-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-start gap-3.5 text-center sm:text-left">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-medium text-white">
                      {isDraggingOver
                        ? "Drop Screenshot Image Here to Upload"
                        : "Drag & Drop, Paste (Ctrl+V / Win+V), or Upload Homepage Screenshot"}
                    </p>
                    <p className="font-mono-custom text-[11px] text-[#888]">
                      Displayed statically on the project card for instant loading. Copy any screenshot and press `Ctrl+V` (or `Win+V`) anywhere, or drop/upload PNG, JPG, WebP, AVIF (max 8 MB).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={uploadingScreenshot}
                    onClick={() => handleClipboardButtonPaste("web")}
                    className="h-auto px-3.5 py-2.5 text-xs"
                    title="Paste copied screenshot from clipboard (or press Ctrl+V anywhere)"
                  >
                    <ClipboardPaste className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Paste (Ctrl+V)</span>
                  </Button>

                  <label className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs cursor-pointer transition-all flex items-center gap-2 shrink-0 shadow-sm">
                    {uploadingScreenshot ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      disabled={uploadingScreenshot}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void handleUploadImage(file, "web");
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {screenshotError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
                  {screenshotError}
                </div>
              )}

              {webPreviewImageUrl && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden bg-[#0e0e0e] border border-white/15 shrink-0">
                    <Image
                      src={webPreviewImageUrl}
                      alt="Homepage screenshot preview"
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="success">
                        Active Static Card Screenshot
                      </Badge>
                      <Button
                        type="button"
                        variant="destructive"
                        size="xs"
                        onClick={() => setWebPreviewImageUrl("")}
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>Remove</span>
                      </Button>
                    </div>
                    <p className="font-mono-custom text-xs text-[#888] truncate">
                      {webPreviewImageUrl}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="project-screenshot-url" className="text-[11px] text-[#777] mb-1.5">
                  Or Paste Screenshot Image URL / Path Directly
                </Label>
                <Input
                  id="project-screenshot-url"
                  type="text"
                  value={webPreviewImageUrl}
                  onChange={(e) => setWebPreviewImageUrl(e.target.value)}
                  placeholder="/images/web-projects/web-project-3.png or https://..."
                  className="py-2.5 text-xs font-mono-custom"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Shared Project Details */}
        <Card className="p-6 space-y-5">
          <h3 className="font-mono-custom text-xs uppercase tracking-wider text-white/70">
            Project Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-title" className="mb-2">
                Project Title *
              </Label>
              <Input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Syston Autos Cinema"
              />
            </div>

            <div>
              <Label htmlFor="project-slug" className="mb-2">
                URL Slug *
              </Label>
              <Input
                id="project-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="syston-autos-cinema"
                className="font-mono-custom"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-client" className="mb-2">
                Client / Brand Name
              </Label>
              <Input
                id="project-client"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Independent Client Project"
              />
            </div>

            <div>
              <Label htmlFor="project-year" className="mb-2">
                Year
              </Label>
              <Input
                id="project-year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2025"
                className="font-mono-custom"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project-description" className="mb-2">
              Short Summary / Description
            </Label>
            <Textarea
              id="project-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise summary displayed on project cards and the top of the case study page..."
            />
          </div>

          <div>
            <Label htmlFor="project-tags" className="mb-2">
              Tags / Technologies (comma separated)
            </Label>
            <Input
              id="project-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={
                isVideo
                  ? "e.g. Premiere Pro, DaVinci Resolve, Sound Design"
                  : "e.g. Next.js, TypeScript, Tailwind CSS, Supabase"
              }
              className="font-mono-custom"
            />
          </div>

          {/* Case Study Detail Fields */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400">
                Case Study Page Details (Optional)
              </h4>
              <span className="font-mono-custom text-[11px] text-[#666]">
                Displayed on /projects/{projectType}/
                {slug || initialProject?.id || "[slug]"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-role" className="mb-2">
                  Your Role
                </Label>
                <Input
                  id="project-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={
                    isVideo
                      ? "e.g. Video Editor & AI Content Creator"
                      : "e.g. Web Developer & UI Engineer"
                  }
                />
              </div>

              <div>
                <Label htmlFor="project-deliverables" className="mb-2">
                  Deliverables (comma separated)
                </Label>
                <Input
                  id="project-deliverables"
                  type="text"
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder={
                    isVideo
                      ? "e.g. Master Cut, Color Grading, Audio Mix"
                      : "e.g. Production Web App, Admin CMS, REST API"
                  }
                  className="font-mono-custom"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="project-overview" className="mb-2">
                Detailed Case Study Overview
              </Label>
              <Textarea
                id="project-overview"
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="In-depth breakdown of the architecture, editing workflow, challenges solved, and final delivery..."
              />
            </div>
          </div>

          {/* Manual Display Priority */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="project-priority">
                Manual Display Priority (Rank)
              </Label>
              <span className="font-mono-custom text-[11px] text-amber-400">
                {manualPriority
                  ? `Rank #${manualPriority}`
                  : "Unranked (Automatic Recency)"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Input
                id="project-priority"
                type="number"
                min="1"
                step="1"
                value={manualPriority}
                onChange={(e) => setManualPriority(e.target.value)}
                placeholder="e.g. 1 (Top priority), 2, 3..."
                className="w-full sm:w-56 font-mono-custom"
              />
              <p className="font-mono-custom text-[11px] text-[#777] leading-relaxed">
                Optional positive integer. Ranked projects (1, 2, 3...) display first on the public website within their tab, followed by unranked projects by newest publication date.
              </p>
            </div>
          </div>
        </Card>

        {/* Publish State Controls */}
        <Card className="p-6 flex items-center justify-between">
          <div>
            <span className="font-sans font-medium text-sm text-white block">
              Publishing Status
            </span>
            <span className="font-mono-custom text-xs text-[#777] block mt-0.5">
              {isPublished
                ? "Publicly visible on the live website."
                : "Saved as draft. Hidden from public visitors."}
            </span>
          </div>

          <Button
            variant={isPublished ? "success" : "warning"}
            onClick={() => setIsPublished(!isPublished)}
            className="uppercase tracking-wider"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isPublished ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span>{isPublished ? "Published" : "Draft"}</span>
          </Button>
        </Card>

        {/* Submit Controls */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin"
            className={buttonVariants({ variant: "secondary", size: "default", className: "px-5 py-2.5 h-auto" })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 h-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>{isEdit ? "Saving Changes..." : "Saving Project..."}</span>
              </>
            ) : (
              <span>{isEdit ? "Save Changes" : "Save & Publish Project"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
