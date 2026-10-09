"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio, ProjectType, VideoProvider, WebPreviewMode } from "@/types/database";

export default function NewProjectPage() {
  const router = useRouter();

  // Step 1: Type selection ('video' | 'web')
  const [projectType, setProjectType] = useState<ProjectType>("video");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [manualPriority, setManualPriority] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Video Fields
  const [videoUrl, setVideoUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [videoProvider, setVideoProvider] = useState<VideoProvider | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Web Fields
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [previewMode, setPreviewMode] = useState<WebPreviewMode>("iframe");
  const [webPreviewImageUrl, setWebPreviewImageUrl] = useState("");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  // Video URL auto resolution
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
      setResolvedThumbnail(meta.thumbnailUrl);
      setResolutionStatus(meta.status || null);
      if (meta.aspectRatio) {
        setAspectRatio(meta.aspectRatio);
      }
      if (meta.title && !title) {
        handleTitleChange(meta.title);
      }
    } catch (err: unknown) {
      setResolveError(err instanceof Error ? err.message : "Error resolving metadata");
    } finally {
      setResolvingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // Validate
      if (!title.trim()) throw new Error("Project title is required.");
      if (projectType === "video" && !videoUrl.trim()) {
        throw new Error("Video URL is required for Video projects.");
      }
      if (projectType === "web" && !liveUrl.trim()) {
        throw new Error("Live URL is required for Web projects.");
      }

      const parsedPriority = manualPriority.trim() ? parseInt(manualPriority.trim(), 10) : null;
      if (parsedPriority !== null && (isNaN(parsedPriority) || parsedPriority <= 0)) {
        throw new Error("Display priority must be a positive integer (e.g. 1, 2, 3...) or left blank.");
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        type: projectType,
        title: title.trim(),
        slug: slug.trim() || undefined,
        client_name: clientName.trim() || null,
        year: year.trim() || null,
        description: description.trim(),
        tags,
        manual_priority: parsedPriority,
        is_published: isPublished,
        ...(projectType === "video"
          ? {
              video_url: videoUrl.trim(),
              video_provider: videoProvider || "other",
              video_id: videoId || null,
              aspect_ratio: aspectRatio,
              preview_image_url: resolvedThumbnail || null,
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

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to create project");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono-custom text-xs text-[#888] mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white">New Project</span>
          </div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal uppercase tracking-tight">
            Create Project
          </h1>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Step 1: Type Selection (Video vs Web) */}
      <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
        <label className="block font-mono-custom text-xs uppercase tracking-wider text-[#aaa]">
          1. Select Project Discipline
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setProjectType("video")}
            className={`p-5 rounded-xl border text-left transition-all ${
              projectType === "video"
                ? "bg-white/10 border-white text-white shadow-md ring-1 ring-white/20"
                : "bg-white/[0.02] border-white/10 text-[#888] hover:border-white/20 hover:text-white"
            }`}
          >
            <div className="text-2xl mb-2">🎬</div>
            <div className="font-sans font-medium text-base text-white">Video Project</div>
            <p className="font-mono-custom text-xs text-[#888] mt-1">
              Patrick Jane editorial layout, 16:9 or 9:16, YouTube/TikTok auto-metadata.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setProjectType("web")}
            className={`p-5 rounded-xl border text-left transition-all ${
              projectType === "web"
                ? "bg-white/10 border-white text-white shadow-md ring-1 ring-white/20"
                : "bg-white/[0.02] border-white/10 text-[#888] hover:border-white/20 hover:text-white"
            }`}
          >
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-sans font-medium text-base text-white">Web Project</div>
            <p className="font-mono-custom text-xs text-[#888] mt-1">
              Aurexa 3-column case study cards, live preview modal, GitHub integration.
            </p>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Discipline-specific inputs */}
        {projectType === "video" ? (
          /* VIDEO SPECIFIC SECTION */
          <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-5">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-sky-400">
              Video Source & Metadata
            </h3>

            {/* Video URL */}
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Video URL (YouTube, Vimeo, TikTok, MP4) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={() => handleResolveVideo()}
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://www.tiktok.com/@..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => handleResolveVideo()}
                  disabled={resolvingVideo || !videoUrl.trim()}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/15 transition-colors disabled:opacity-40"
                >
                  {resolvingVideo ? "Resolving..." : "Detect & Preview"}
                </button>
              </div>
              <p className="font-mono-custom text-[11px] text-[#666] mt-1.5">
                Automatically resolves provider, aspect ratio, and public high-res thumbnail.
              </p>
            </div>

            {/* Auto-resolved Preview Card */}
            {resolvedThumbnail && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div
                  className={`relative ${
                    aspectRatio === "9:16" ? "w-20 h-36" : aspectRatio === "1:1" ? "w-24 h-24" : "w-40 h-24"
                  } rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/15`}
                >
                  <Image
                    src={resolvedThumbnail}
                    alt="Auto-resolved thumbnail"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                      resolutionStatus === "available"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                        : "bg-sky-950/60 text-sky-300 border-sky-800/50"
                    }`}>
                      {resolutionStatus === "available" ? "Direct Thumbnail ✓" : "Branded Preview Card ✓"}
                    </span>
                    <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                      {videoProvider?.toUpperCase()}
                    </span>
                  </div>

                  <div className="font-mono-custom text-xs text-[#aaa]">
                    Detected Ratio: <strong className="text-white">{aspectRatio}</strong>
                    {videoId && (
                      <span className="ml-2 text-[#777]">
                        (ID: <span className="text-white">{videoId}</span>)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {resolveError && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom">
                {resolveError} (A branded fallback card will be used)
              </div>
            )}

            {/* 5-Option Aspect Ratio Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono-custom text-xs text-[#aaa] uppercase">
                  Aspect Ratio Format *
                </label>
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
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? "bg-white/15 border-white text-white shadow-sm ring-1 ring-white/20"
                          : "bg-white/[0.02] border-white/10 text-[#888] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div
                        className={`${opt.box} border-2 ${
                          isSelected ? "border-white bg-white/20" : "border-white/30 bg-white/5"
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
                Source of truth for Patrick Jane editorial works card display and player stage modal.
              </p>
            </div>
          </div>
        ) : (
          /* WEB SPECIFIC SECTION */
          <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-5">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-purple-400">
              Web Application Links & Preview
            </h3>

            {/* Live URL */}
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Live Website URL *
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                required
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kamru1i/project"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Web Preview Mode Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block font-mono-custom text-xs text-[#aaa] uppercase">
                  Web Preview Mode *
                </label>
                <span className="font-mono-custom text-[11px] text-[#777]">
                  Active: <strong className="text-white">{previewMode === "iframe" ? "Live Iframe" : "Fallback Showcase"}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Live Iframe */}
                <button
                  type="button"
                  onClick={() => setPreviewMode("iframe")}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    previewMode === "iframe"
                      ? "bg-white/10 border-white text-white shadow-sm ring-1 ring-white/20"
                      : "bg-white/[0.02] border-white/10 text-[#888] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">🖥️</span>
                      <span className="font-mono-custom text-[10px] px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-800/50 uppercase">
                        Interactive
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-white block">
                      Live Iframe Preview (Auto)
                    </span>
                    <p className="font-mono-custom text-[11px] text-[#888] mt-1 leading-relaxed">
                      Embeds the live website directly. Ideal for sites that permit cross-origin framing and don&apos;t run bot verification.
                    </p>
                  </div>
                  <span className="font-mono-custom text-[10px] text-white/50">
                    {previewMode === "iframe" ? "● Selected Mode" : "○ Click to select"}
                  </span>
                </button>

                {/* Option 2: Fallback Showcase */}
                <button
                  type="button"
                  onClick={() => setPreviewMode("fallback")}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    previewMode === "fallback"
                      ? "bg-white/10 border-white text-white shadow-sm ring-1 ring-white/20"
                      : "bg-white/[0.02] border-white/10 text-[#888] hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">🛡️</span>
                      <span className="font-mono-custom text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/50 uppercase">
                        Shielded
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-white block">
                      Security-Shielded Fallback Preview
                    </span>
                    <p className="font-mono-custom text-[11px] text-[#888] mt-1 leading-relaxed">
                      Recommended for Cloudflare (&ldquo;Please wait while your request is being verified...&rdquo;), Turnstile, or strict CSP. Displays domain favicon, snapshot, and direct Open CTA.
                    </p>
                  </div>
                  <span className="font-mono-custom text-[10px] text-white/50">
                    {previewMode === "fallback" ? "● Selected Mode" : "○ Click to select"}
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Fallback Preview Screenshot/Artwork */}
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Preview Screenshot / Thumbnail Image URL (Optional)
              </label>
              <input
                type="text"
                value={webPreviewImageUrl}
                onChange={(e) => setWebPreviewImageUrl(e.target.value)}
                placeholder="/images/aurexa/aurexa-project-3.png or https://..."
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
              <p className="font-mono-custom text-[11px] text-[#666] mt-1.5">
                Optional visual asset for the fallback showcase. If blank, automatically renders a clean branded canvas with the domain&apos;s live favicon.
              </p>
            </div>
          </div>
        )}

        {/* SHARED PROJECT DETAILS */}
        <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-5">
          <h3 className="font-mono-custom text-xs uppercase tracking-wider text-white/70">
            Project Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Syston Autos Cinema"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="syston-autos-cinema"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-mono-custom focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Client / Brand Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Syston Autos Ltd"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024–2025"
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-mono-custom focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the project, story, or architectural highlights..."
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
              Tags / Technologies (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Premiere Pro, After Effects, Sound Design"
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-mono-custom focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Manual Display Priority */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono-custom text-xs text-[#aaa] uppercase">
                Manual Display Priority (Rank)
              </label>
              <span className="font-mono-custom text-[11px] text-amber-400">
                {manualPriority ? `Rank #${manualPriority}` : "Unranked (Automatic Recency)"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="number"
                min="1"
                step="1"
                value={manualPriority}
                onChange={(e) => setManualPriority(e.target.value)}
                placeholder="e.g. 1 (Top priority), 2, 3..."
                className="w-full sm:w-56 px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-mono-custom focus:outline-none focus:border-white/30"
              />
              <p className="font-mono-custom text-[11px] text-[#777] leading-relaxed">
                Optional positive integer. Ranked projects (1, 2, 3...) display first on the public website within their tab, followed by unranked projects by newest publication date.
              </p>
            </div>
          </div>
        </div>

        {/* PUBLISH STATE CONTROLS */}
        <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div>
            <span className="font-sans font-medium text-sm text-white block">
              Publishing Status
            </span>
            <span className="font-mono-custom text-xs text-[#777] block mt-0.5">
              {isPublished
                ? "Will be immediately visible on public website (newest first)."
                : "Saved as draft. Only visible inside the admin dashboard."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`px-4 py-2 rounded-xl font-mono-custom text-xs uppercase tracking-wider border transition-all ${
              isPublished
                ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300"
                : "bg-amber-950/40 border-amber-800/40 text-amber-300"
            }`}
          >
            {isPublished ? "● Published" : "○ Draft"}
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Saving Project...</span>
              </>
            ) : (
              <span>Save & Publish Project</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
