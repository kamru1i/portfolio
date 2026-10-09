"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio, ProjectRecord, VideoProvider } from "@/types/project";

export function EditProjectForm({ project }: { project: ProjectRecord }) {
  const router = useRouter();

  const isVideo = project.type === "video";

  // Form states pre-filled from existing record
  const [title, setTitle] = useState(project.title);
  const [slug, setSlug] = useState(project.slug);
  const [clientName, setClientName] = useState(project.client_name || "");
  const [year, setYear] = useState(project.year || "");
  const [description, setDescription] = useState(project.description || "");
  const [tagsInput, setTagsInput] = useState((project.tags || []).join(", "));
  const [isPublished, setIsPublished] = useState(project.is_published);

  // Video states
  const [videoUrl, setVideoUrl] = useState(project.video_url || "");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspect_ratio || "16:9");
  const [videoProvider, setVideoProvider] = useState<VideoProvider | null>(project.video_provider);
  const [videoId, setVideoId] = useState<string | null>(project.video_id);
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string | null>(project.preview_image_url);
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // Web states
  const [liveUrl, setLiveUrl] = useState(project.live_url || "");
  const [githubUrl, setGithubUrl] = useState(project.github_url || "");
  const [canEmbed, setCanEmbed] = useState(project.can_embed);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-resolve video if URL changed
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
      if (!title.trim()) throw new Error("Project title is required.");
      if (isVideo && !videoUrl.trim()) {
        throw new Error("Video URL is required for Video projects.");
      }
      if (!isVideo && !liveUrl.trim()) {
        throw new Error("Live URL is required for Web projects.");
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        client_name: clientName.trim() || null,
        year: year.trim() || null,
        description: description.trim(),
        tags,
        is_published: isPublished,
        ...(isVideo
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

      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update project");
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
            <span className="text-white">Edit Project</span>
          </div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal uppercase tracking-tight">
            Edit Project
          </h1>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Discipline indicator */}
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isVideo ? "🎬" : "🌐"}</span>
            <div>
              <span className="font-sans text-sm font-medium text-white block">
                {isVideo ? "Video Project" : "Web Project"}
              </span>
              <span className="font-mono-custom text-xs text-[#888]">
                Discipline is fixed to preserve editorial consistency.
              </span>
            </div>
          </div>
          <span className="font-mono-custom text-xs text-[#666]">
            ID: {project.id.slice(0, 8)}...
          </span>
        </div>

        {/* Discipline-specific fields */}
        {isVideo ? (
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
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => handleResolveVideo()}
                  disabled={resolvingVideo || !videoUrl.trim()}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/15 transition-colors disabled:opacity-40"
                >
                  {resolvingVideo ? "Resolving..." : "Re-Detect"}
                </button>
              </div>
            </div>

            {/* Auto-resolved preview card */}
            {resolvedThumbnail && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div
                  className={`relative ${
                    aspectRatio === "9:16" ? "w-20 h-36" : "w-40 h-24"
                  } rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/15`}
                >
                  <Image
                    src={resolvedThumbnail}
                    alt="Current thumbnail"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                    Resolved Thumbnail ✓
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
                {resolveError}
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
          <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-5">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-purple-400">
              Web Application Links & Preview
            </h3>

            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                Live Website URL *
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block font-mono-custom text-xs text-[#aaa] mb-2 uppercase">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <input
                type="checkbox"
                id="canEmbedEdit"
                checked={canEmbed}
                onChange={(e) => setCanEmbed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 accent-white cursor-pointer"
              />
              <label htmlFor="canEmbedEdit" className="cursor-pointer">
                <span className="font-sans text-xs font-medium text-white block">
                  Permit In-Site Live Iframe Preview
                </span>
                <span className="font-mono-custom text-[11px] text-[#777] block mt-0.5">
                  Check only if target website does not block iframe embedding with security headers.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Shared fields */}
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
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-white/30"
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
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-mono-custom focus:outline-none focus:border-white/30"
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
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-white/30"
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
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-mono-custom focus:outline-none focus:border-white/30"
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
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-white/30"
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
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm font-mono-custom focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Publish state */}
        <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div>
            <span className="font-sans font-medium text-sm text-white block">
              Publishing Status
            </span>
            <span className="font-mono-custom text-xs text-[#777] block mt-0.5">
              {isPublished
                ? "Publicly visible on the live website."
                : "Draft only. Hidden from public visitors."}
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

        {/* Submit */}
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
