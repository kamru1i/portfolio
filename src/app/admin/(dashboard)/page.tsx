"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Film,
  Globe,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { ProjectRecord } from "@/types/project";
import { getDisplayDomain } from "@/lib/url-utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FilterTab = "all" | "video" | "web" | "published" | "drafts";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<ProjectRecord | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/projects");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load projects");
        }
        const data = await res.json();
        if (isMounted) {
          setProjects(data.projects || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Error fetching projects");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
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

  // Paginated slice
  const totalFiltered = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedProjects = useMemo(() => {
    const from = (currentPage - 1) * pageSize;
    return filteredProjects.slice(from, from + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

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

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/projects/new?type=video"
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "px-3.5 py-2 h-9",
            })}
          >
            <Film className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            <span>+ Video Project</span>
          </Link>
          <Link
            href="/admin/projects/new?type=web"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "px-3.5 py-2 h-9",
            })}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>+ Web Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-[#888] uppercase tracking-wider block mb-1">
            Total
          </span>
          <span className="font-sans text-2xl font-semibold text-white">
            {stats.total}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-emerald-400/80 uppercase tracking-wider block mb-1">
            Published
          </span>
          <span className="font-sans text-2xl font-semibold text-emerald-400">
            {stats.published}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-amber-400/80 uppercase tracking-wider block mb-1">
            Drafts
          </span>
          <span className="font-sans text-2xl font-semibold text-amber-400">
            {stats.drafts}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-sky-400/80 uppercase tracking-wider block mb-1">
            Video
          </span>
          <span className="font-sans text-2xl font-semibold text-sky-400">
            {stats.video}
          </span>
        </Card>

        <Card className="p-4 rounded-xl col-span-2 sm:col-span-1">
          <span className="font-mono-custom text-[11px] text-purple-400/80 uppercase tracking-wider block mb-1">
            Web
          </span>
          <span className="font-sans text-2xl font-semibold text-purple-400">
            {stats.web}
          </span>
        </Card>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div
        id="projects-manager"
        className="scroll-mt-20 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2"
      >
        {/* Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter projects by category or status"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#141416] border border-white/10"
        >
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
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666]"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search projects"
            placeholder="Search projects..."
            className="pl-9 pr-4 py-2 h-9 bg-[#141416] text-xs font-mono-custom"
          />
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
        <Card className="p-16 text-center">
          <Loader2 className="w-7 h-7 text-white animate-spin mx-auto mb-3" aria-hidden="true" />
          <p className="font-mono-custom text-xs text-[#888]">Loading projects from database...</p>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-16 text-center">
          <p className="font-mono-custom text-sm text-[#888] mb-4">No projects match the selected criteria.</p>
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ variant: "secondary", size: "default" })}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Create Your First Project</span>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden divide-y divide-white/5">
          {paginatedProjects.map((project) => {
            const isVideo = project.type === "video";
            const is916 = project.aspect_ratio === "9:16";

            return (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors"
              >
                {/* Project Media Thumbnail + Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  {/* Thumbnail Container */}
                  <div className={`relative shrink-0 ${is916 ? "w-12 h-20" : "w-20 h-14"} rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center`}>
                    {project.preview_image_url ? (
                      <Image
                        src={project.preview_image_url}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : !isVideo && project.live_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- External Google S2 favicon with onError fallback */
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${getDisplayDomain(project.live_url)}&sz=64`}
                        alt=""
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[#666]" aria-hidden="true">
                        {isVideo ? <Film className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
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
                      {/* Priority Badge */}
                      {project.manual_priority ? (
                        <Badge variant="warning" className="font-medium">
                          Priority #{project.manual_priority}
                        </Badge>
                      ) : (
                        <Badge variant="muted">
                          Priority: Date
                        </Badge>
                      )}

                      <Badge variant={isVideo ? "info" : "purple"}>
                        {isVideo ? (
                          <Film className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <Globe className="h-3 w-3" aria-hidden="true" />
                        )}
                        <span>{isVideo ? `Video • ${project.aspect_ratio}` : "Web Project"}</span>
                      </Badge>

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

                    <h3 className="font-sans font-medium text-base text-white truncate">
                      {project.title}
                    </h3>

                    <p className="font-mono-custom text-xs text-[#777] truncate mt-0.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Status & Controls */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t border-white/5 sm:border-0 self-end sm:self-center shrink-0">
                  {/* Publish Toggle Button */}
                  <Button
                    variant={project.is_published ? "success" : "warning"}
                    size="sm"
                    onClick={() => handleTogglePublish(project)}
                    disabled={togglingId === project.id}
                    className="uppercase tracking-wider"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.is_published ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span>{project.is_published ? "Published" : "Draft"}</span>
                  </Button>

                  {/* Edit Link */}
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDeleteProject(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="p-4 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="font-mono-custom text-xs text-[#888]">
                Showing <strong className="text-white">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="text-white">{Math.min(currentPage * pageSize, totalFiltered)}</strong> of{" "}
                <strong className="text-white">{totalFiltered}</strong> projects
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </Button>

                <span className="font-mono-custom text-xs text-[#aaa] px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal via shadcn Dialog */}
      <Dialog
        open={Boolean(confirmDeleteProject)}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteProject(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-semibold">
                &ldquo;{confirmDeleteProject?.title}&rdquo;
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteProject(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructiveSolid"
              onClick={handleDelete}
              disabled={Boolean(
                confirmDeleteProject && deletingId === confirmDeleteProject.id
              )}
            >
              {confirmDeleteProject && deletingId === confirmDeleteProject.id ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Confirm Delete</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
