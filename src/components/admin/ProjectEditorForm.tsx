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
  ScanSearch,
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
  initialDiscipline?: ProjectType;
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

export function ProjectEditorForm({
  mode,
  initialProject,
  initialDiscipline = "video",
}: ProjectEditorFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit" && Boolean(initialProject);

  // Discipline ('video' | 'web') — selected from sidebar submenu on create, fixed on edit
  const projectType: ProjectType = initialProject?.type ?? initialDiscipline;
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
    <div className="w-full space-y-4 select-none">
      {/* Page Header with Active Discipline Badge */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isVideo
                ? "bg-sky-500/15 border-sky-500/25 text-sky-400"
                : "bg-purple-500/15 border-purple-500/25 text-purple-400"
            }`}
          >
            {isVideo ? (
              <Film className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Globe className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-gambarino text-2xl sm:text-3xl text-white font-normal uppercase tracking-tight">
                {isEdit
                  ? isVideo
                    ? "Edit Video Project"
                    : "Edit Web Project"
                  : isVideo
                  ? "Create Video Project"
                  : "Create Web Project"}
              </h1>
              {initialProject && (
                <span className="font-mono-custom text-[11px] text-[#666]">
                  ID: {initialProject.id.slice(0, 8)}...
                </span>
              )}
            </div>
            <p className="font-mono-custom text-xs text-[#888] mt-0.5 truncate">
              {isVideo
                ? "Editorial video showcase layout, aspect ratio, thumbnail & case study details."
                : "Web application links, interactive preview mode, static screenshot & case study details."}
            </p>
          </div>
        </div>

        <Link
          href="/admin"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          Cancel
        </Link>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMessage}
        </div>
      )}

      {/* Main Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isVideo ? (
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono-custom text-xs uppercase tracking-wider text-sky-400">
                Video Source, Aspect Ratio &amp; Thumbnail
              </h3>
              <span className="font-mono-custom text-[11px] text-[#666]">
                Active Ratio: <strong className="text-white">{aspectRatio}</strong>
              </span>
            </div>

            {/* Single Line: Video URL + Detect + Aspect Ratio + Video Thumbnail (Drag & Drop / Paste / Upload) */}
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
                      if (!isEdit) handleResolveVideo();
                    }}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 h-11 py-2"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleResolveVideo()}
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

              {/* 3. Video Thumbnail (Drag & Drop / Paste / Upload) on the Same Line */}
              <div className="xl:col-span-4 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Video Thumbnail</Label>
                  {videoThumbnailUrl && (
                    <Badge
                      variant={isCustomVideoThumbnail ? "success" : "info"}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {isCustomVideoThumbnail ? "Custom" : "Auto"}
                    </Badge>
                  )}
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
                  className={`h-11 px-3 rounded-xl border border-dashed transition-all flex items-center justify-between gap-2 ${
                    isDraggingOver
                      ? "bg-sky-500/10 border-sky-400 ring-2 ring-sky-400/25"
                      : "bg-[#18181b] border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {videoThumbnailUrl || fallbackSvgThumbnail ? (
                      <div className="relative w-12 h-8 rounded overflow-hidden bg-black shrink-0 border border-white/15">
                        <Image
                          src={videoThumbnailUrl || fallbackSvgThumbnail || ""}
                          alt="Video thumbnail preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                        <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono-custom text-[10px] text-[#aaa] truncate">
                        {isDraggingOver
                          ? "Drop Image Here"
                          : "Drop, Paste (Ctrl+V), or Upload"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
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
                          title="Restore Auto-Detected Thumbnail"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden="true" />
                          <span>Auto</span>
                        </Button>
                      )}

                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      disabled={uploadingScreenshot}
                      onClick={() => handleClipboardButtonPaste("video")}
                      title="Paste copied image from clipboard (Ctrl+V)"
                    >
                      <ClipboardPaste className="h-3 w-3" aria-hidden="true" />
                      <span>Paste</span>
                    </Button>

                    <label className="px-2.5 py-1 rounded-lg bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs cursor-pointer transition-all flex items-center gap-1 shrink-0 shadow-xs">
                      {uploadingScreenshot ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                      ) : (
                        <Upload className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span>{uploadingScreenshot ? "..." : "Upload"}</span>
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

                    {videoThumbnailUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="xs"
                        onClick={() => {
                          setVideoThumbnailUrl("");
                          setIsCustomVideoThumbnail(false);
                        }}
                        title="Remove Thumbnail"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {resolveError && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom">
                {resolveError} — Upload, drag &amp; drop, or paste (`Ctrl+V`) a custom thumbnail.
              </div>
            )}

            {screenshotError && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
                {screenshotError}
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-5 space-y-4">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-purple-400">
              Web Application Links, Preview Mode &amp; Screenshot
            </h3>

            {/* Row 1 (Single Line): Live Website URL + GitHub Repository URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-live-url" className="mb-1.5">
                  Live Website URL *
                </Label>
                <Input
                  id="project-live-url"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  required
                  placeholder="https://example.com"
                  className="h-10 py-2"
                />
              </div>

              <div>
                <Label htmlFor="project-github-url" className="mb-1.5">
                  GitHub Repository URL (Optional)
                </Label>
                <Input
                  id="project-github-url"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/kamru1i/project"
                  className="h-10 py-2"
                />
              </div>
            </div>

            {/* Row 2 (Single Line): Live Interactive Iframe + Protected Fallback Card + Drag & Drop / Paste Screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch pt-1">
              {/* 1. Live Interactive Iframe */}
              <button
                type="button"
                onClick={() => setPreviewMode("iframe")}
                className={`lg:col-span-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  previewMode === "iframe"
                    ? "bg-emerald-950/30 border-emerald-500/60 text-white"
                    : "bg-[#18181b] border-white/10 text-[#888] hover:border-white/25 hover:text-white"
                }`}
              >
                <div className="font-mono-custom text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <Monitor className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Live Interactive Iframe</span>
                </div>
                <p className="font-mono-custom text-[10px] text-[#888] mt-1 leading-snug">
                  Embeds live site inside modal with desktop/mobile switcher.
                </p>
              </button>

              {/* 2. Protected / Fallback Card */}
              <button
                type="button"
                onClick={() => setPreviewMode("fallback")}
                className={`lg:col-span-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  previewMode === "fallback"
                    ? "bg-amber-950/30 border-amber-500/60 text-white"
                    : "bg-[#18181b] border-white/10 text-[#888] hover:border-white/25 hover:text-white"
                }`}
              >
                <div className="font-mono-custom text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Protected / Fallback Card</span>
                </div>
                <p className="font-mono-custom text-[10px] text-[#888] mt-1 leading-snug">
                  For sites with X-Frame-Options/CSP; shows summary &amp; launch CTA.
                </p>
              </button>

              {/* 3. Drag & Drop / Paste (Ctrl+V) / Upload Screenshot Box on the Same Line */}
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
                className={`lg:col-span-6 p-3.5 rounded-xl border border-dashed transition-all flex items-center justify-between gap-2.5 ${
                  isDraggingOver
                    ? "bg-purple-500/10 border-purple-400 ring-2 ring-purple-400/25"
                    : "bg-[#18181b] border-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {webPreviewImageUrl ? (
                    <div className="relative w-14 h-9 rounded overflow-hidden bg-[#0e0e0e] border border-white/15 shrink-0">
                      <Image
                        src={webPreviewImageUrl}
                        alt="Screenshot preview"
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="hidden sm:flex w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 items-center justify-center text-purple-400 shrink-0">
                      <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-xs font-medium text-white truncate">
                        {isDraggingOver
                          ? "Drop Screenshot Here"
                          : "Homepage Screenshot *"}
                      </span>
                      {webPreviewImageUrl && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0">
                          Ready
                        </Badge>
                      )}
                    </div>
                    <p className="font-mono-custom text-[10px] text-[#888] truncate">
                      Drag &amp; Drop, Paste (`Ctrl+V` / `Win+V`), or Upload
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    disabled={uploadingScreenshot}
                    onClick={() => handleClipboardButtonPaste("web")}
                    title="Paste copied screenshot from clipboard (Ctrl+V)"
                  >
                    <ClipboardPaste className="h-3 w-3" aria-hidden="true" />
                    <span>Paste</span>
                  </Button>

                  <label className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-xs">
                    {uploadingScreenshot ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      <Upload className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>{uploadingScreenshot ? "..." : "Upload"}</span>
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

                  {webPreviewImageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => setWebPreviewImageUrl("")}
                      title="Remove Screenshot"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {screenshotError && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
                {screenshotError}
              </div>
            )}
          </Card>
        )}

        {/* Shared Project Information & Case Study Details */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-white/70">
              Project Information &amp; Case Study Details
            </h3>
            <span className="font-mono-custom text-[11px] text-[#666]">
              /projects/{projectType}/{slug || initialProject?.id || "[slug]"}
            </span>
          </div>

          {/* Line 1: Project Title + URL Slug + Client / Brand Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="project-title" className="mb-1.5">
                Project Title *
              </Label>
              <Input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Syston Autos Cinema"
                className="h-10 py-2"
              />
            </div>

            <div>
              <Label htmlFor="project-slug" className="mb-1.5">
                URL Slug *
              </Label>
              <Input
                id="project-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="syston-autos-cinema"
                className="h-10 py-2 font-mono-custom"
              />
            </div>

            <div>
              <Label htmlFor="project-client" className="mb-1.5">
                Client / Brand Name
              </Label>
              <Input
                id="project-client"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Independent Client Project"
                className="h-10 py-2"
              />
            </div>
          </div>

          {/* Line 2: Year + Your Role + Deliverables + Priority Rank + Publishing Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-2">
              <Label htmlFor="project-year" className="mb-1.5">
                Year
              </Label>
              <Input
                id="project-year"
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2026"
                className="h-10 py-2 font-mono-custom"
              />
            </div>

            <div className="lg:col-span-3">
              <Label htmlFor="project-role" className="mb-1.5">
                Your Role
              </Label>
              <Input
                id="project-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={
                  isVideo
                    ? "e.g. Video Editor & AI Creator"
                    : "e.g. Web Developer & UI Engineer"
                }
                className="h-10 py-2"
              />
            </div>

            <div className="lg:col-span-3">
              <Label htmlFor="project-deliverables" className="mb-1.5">
                Deliverables (comma separated)
              </Label>
              <Input
                id="project-deliverables"
                type="text"
                value={deliverablesInput}
                onChange={(e) => setDeliverablesInput(e.target.value)}
                placeholder={
                  isVideo
                    ? "e.g. Master Cut, Color, Audio"
                    : "e.g. Web App, Admin CMS, API"
                }
                className="h-10 py-2 font-mono-custom"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="project-priority">Priority Rank</Label>
                <span className="font-mono-custom text-[10px] text-amber-400">
                  {manualPriority ? `#${manualPriority}` : "Auto"}
                </span>
              </div>
              <Input
                id="project-priority"
                type="number"
                min="1"
                step="1"
                value={manualPriority}
                onChange={(e) => setManualPriority(e.target.value)}
                placeholder="e.g. 1, 2..."
                className="h-10 py-2 font-mono-custom"
              />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <Label>Status</Label>
                <span className="font-mono-custom text-[10px] text-[#777]">
                  {isPublished ? "Public" : "Hidden"}
                </span>
              </div>
              <Button
                type="button"
                variant={isPublished ? "success" : "warning"}
                onClick={() => setIsPublished(!isPublished)}
                className="w-full h-10 uppercase tracking-wider text-xs justify-center"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPublished ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span>{isPublished ? "Published" : "Draft"}</span>
              </Button>
            </div>
          </div>

          {/* Line 3: Tags / Technologies + Short Summary / Description on the Same Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label htmlFor="project-tags" className="mb-1.5">
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
                className="h-10 py-2 font-mono-custom"
              />
            </div>

            <div>
              <Label htmlFor="project-description" className="mb-1.5">
                Short Summary / Description
              </Label>
              <Input
                id="project-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Concise summary displayed on project cards and top of case study..."
                className="h-10 py-2"
              />
            </div>
          </div>

          {/* Line 4: Detailed Case Study Overview right below */}
          <div>
            <Label htmlFor="project-overview" className="mb-1.5">
              Detailed Case Study Overview
            </Label>
            <Textarea
              id="project-overview"
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="In-depth breakdown of the architecture, editing workflow, challenges solved, and final delivery..."
            />
          </div>
        </Card>

        {/* Clean Bottom Submit Bar — Only Cancel & Save/Publish Project */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Link
            href="/admin"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
              className: "px-5 py-2.5 h-10 text-xs",
            })}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 h-10 text-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>{isEdit ? "Saving Changes..." : "Publishing Project..."}</span>
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
