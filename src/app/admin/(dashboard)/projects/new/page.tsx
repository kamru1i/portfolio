"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio, ProjectType, VideoProvider } from "@/types/database";

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
  const [isPublished, setIsPublished] = useState(true);

  // Video Fields
  const [videoUrl, setVideoUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [videoProvider, setVideoProvider] = useState<VideoProvider | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(null);
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Web Fields
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [canEmbed, setCanEmbed] = useState(false);

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
              can_embed: canEmbed,
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
                    aspectRatio === "9:16" ? "w-20 h-36" : "w-40 h-24"
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
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                    Auto-Resolved Metadata ✓
                  </span>
                  <div className="font-mono-custom text-xs text-[#aaa] mt-1">
                    Provider: <strong className="text-white uppercase">{videoProvider}</strong>
                  </div>
                  {videoId && (
                    <div className="font-mono-custom text-xs text-[#aaa]">
                      Video ID: <strong className="text-white">{videoId}</strong>
                    </div>
                  )}
                  <div className="font-mono-custom text-xs text-[#aaa]">
                    Aspect Ratio: <strong className="text-white">{aspectRatio}</strong>
                  </div>
                </div>
              </div>
            )}

            {resolveError && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom">
                {resolveError} (A branded fallback card will be used)
              </div>
            )}

            {/* Aspect Ratio Override */}
            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Aspect Ratio Format
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`py-2 px-3 rounded-xl font-mono-custom text-xs border transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-white/15 border-white text-white font-medium"
                      : "bg-white/[0.03] border-white/10 text-[#888] hover:text-white"
                  }`}
                >
                  16:9 Landscape
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`py-2 px-3 rounded-xl font-mono-custom text-xs border transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-white/15 border-white text-white font-medium"
                      : "bg-white/[0.03] border-white/10 text-[#888] hover:text-white"
                  }`}
                >
                  9:16 Portrait / Reel
                </button>
              </div>
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

            {/* Can Embed Checkbox */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <input
                type="checkbox"
                id="canEmbed"
                checked={canEmbed}
                onChange={(e) => setCanEmbed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 accent-white cursor-pointer"
              />
              <label htmlFor="canEmbed" className="cursor-pointer">
                <span className="font-sans text-xs font-medium text-white block">
                  Permit In-Site Live Iframe Preview
                </span>
                <span className="font-mono-custom text-[11px] text-[#777] block mt-0.5">
                  Check only if the target website does not block iframe embedding with X-Frame-Options or CSP headers.
                </span>
              </label>
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
