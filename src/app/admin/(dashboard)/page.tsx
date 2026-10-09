"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ProjectRecord } from "@/types/project";
import Image from "next/image";

type FilterTab = "all" | "video" | "web" | "published" | "drafts";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<ProjectRecord | null>(null);

  // Fetch projects from admin API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/projects");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load projects");
      }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.is_published).length;
    const drafts = total - published;
    const video = projects.filter((p) => p.type === "video").length;
    const web = projects.filter((p) => p.type === "web").length;
    return { total, published, drafts, video, web };
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Tab filter
      if (activeTab === "video" && p.type !== "video") return false;
      if (activeTab === "web" && p.type !== "web") return false;
      if (activeTab === "published" && !p.is_published) return false;
      if (activeTab === "drafts" && p.is_published) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchClient = p.client_name?.toLowerCase().includes(q) || false;
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        return matchTitle || matchClient || matchTags;
      }

      return true;
    });
  }, [projects, activeTab, searchQuery]);

  // Toggle publish state
  const handleTogglePublish = async (project: ProjectRecord) => {
    try {
      setTogglingId(project.id);
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !project.is_published }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      const { project: updated } = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error toggling publish state");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!confirmDeleteProject) return;
    try {
      setDeletingId(confirmDeleteProject.id);
      const res = await fetch(`/api/admin/projects/${confirmDeleteProject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== confirmDeleteProject.id));
      setConfirmDeleteProject(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            Project Overview
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            Manage, publish, and inspect portfolio works across Video and Web systems.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 active:scale-95 transition-all shadow-sm flex-shrink-0"
        >
          <span className="text-base leading-none font-bold">+</span>
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-[#888] uppercase tracking-wider block mb-1">
            Total
          </span>
          <span className="font-sans text-2xl font-semibold text-white">
            {stats.total}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-emerald-400/80 uppercase tracking-wider block mb-1">
            Published
          </span>
          <span className="font-sans text-2xl font-semibold text-emerald-400">
            {stats.published}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-amber-400/80 uppercase tracking-wider block mb-1">
            Drafts
          </span>
          <span className="font-sans text-2xl font-semibold text-amber-400">
            {stats.drafts}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-sky-400/80 uppercase tracking-wider block mb-1">
            Video
          </span>
          <span className="font-sans text-2xl font-semibold text-sky-400">
            {stats.video}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10 col-span-2 sm:col-span-1">
          <span className="font-mono-custom text-[11px] text-purple-400/80 uppercase tracking-wider block mb-1">
            Web
          </span>
          <span className="font-sans text-2xl font-semibold text-purple-400">
            {stats.web}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#141416] border border-white/10">
          {(
            [
              { id: "all", label: "All Projects" },
              { id: "video", label: "Video" },
              { id: "web", label: "Web" },
              { id: "published", label: "Published" },
              { id: "drafts", label: "Drafts" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-white/15 text-white font-medium shadow-sm"
                  : "text-[#888] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141416] border border-white/10 text-white placeholder-white/20 text-xs font-mono-custom focus:outline-none focus:border-white/30 transition-all"
          />
          <span className="absolute left-3 top-2.5 text-[#666] text-xs">🔍</span>
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMsg}
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl bg-[#141416] border border-white/10">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-3" />
          <p className="font-mono-custom text-xs text-[#888]">Loading projects from database...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#141416] border border-white/10">
          <p className="font-mono-custom text-sm text-[#888] mb-4">No projects match the selected criteria.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono-custom text-xs border border-white/10 transition-colors"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#141416] border border-white/10 overflow-hidden shadow-sm divide-y divide-white/5">
          {filteredProjects.map((project) => {
            const isVideo = project.type === "video";
            const is916 = project.aspect_ratio === "9:16";

            return (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Project Media Thumbnail + Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Thumbnail Container */}
                  <div className={`relative flex-shrink-0 ${is916 ? "w-12 h-20" : "w-20 h-14"} rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center`}>
                    {project.preview_image_url ? (
                      <Image
                        src={project.preview_image_url}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs text-[#666] font-mono-custom">
                        {isVideo ? "🎬" : "🌐"}
                      </span>
                    )}

                    {/* Provider Pill badge */}
                    <span className="absolute bottom-1 right-1 font-mono-custom text-[9px] uppercase px-1 py-0.2 rounded bg-black/80 text-white/90 border border-white/20">
                      {project.video_provider || project.type}
                    </span>
                  </div>

                  {/* Title & Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                        isVideo
                          ? "bg-sky-950/40 text-sky-300 border-sky-800/40"
                          : "purple-950/40 text-purple-300 border-purple-800/40"
                      }`}>
                        {isVideo ? `Video • ${project.aspect_ratio}` : "Web Project"}
                      </span>

                      {project.client_name && (
                        <span className="font-mono-custom text-[11px] text-[#888]">
                          {project.client_name}
                        </span>
                      )}

                      {project.year && (
                        <span className="font-mono-custom text-[11px] text-[#666]">
                          • {project.year}
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans font-medium text-base text-white truncate max-w-lg">
                      {project.title}
                    </h3>

                    <p className="font-mono-custom text-xs text-[#777] truncate max-w-xl mt-0.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Status & Controls */}
                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  {/* Publish Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    disabled={togglingId === project.id}
                    className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                      project.is_published
                        ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/50"
                        : "bg-amber-950/40 border-amber-800/40 text-amber-300 hover:bg-amber-900/50"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.is_published ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span>{project.is_published ? "Published" : "Draft"}</span>
                  </button>

                  {/* Edit Link */}
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
                  >
                    Edit
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteProject(project)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-300 font-mono-custom text-xs border border-red-800/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-sans font-medium text-lg text-white">
              Delete Project?
            </h3>
            <p className="font-mono-custom text-xs text-[#aaa] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white font-semibold">"{confirmDeleteProject.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setConfirmDeleteProject(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === confirmDeleteProject.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-custom text-xs font-medium transition-colors disabled:opacity-50"
              >
                {deletingId === confirmDeleteProject.id ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
