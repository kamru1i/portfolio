"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
import { ContactInquiryRecord } from "@/lib/inquiries-service";
import { CvDocumentRecord } from "@/lib/cv-service";
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
import {
  ADMIN_RETURN_STATE_KEY,
  AdminProjectsReturnState,
} from "@/components/admin/project-editor/useProjectSharedForm";
import {
  ADMIN_VIEW_EVENT,
  AdminProjectSubTab,
  AdminViewEventDetail,
  dispatchAdminViewChange,
} from "@/components/admin/AdminSidebarShell";
import { AdminExecutiveOverview } from "@/components/admin/AdminExecutiveOverview";

type FilterTab = AdminProjectSubTab;

function isValidFilterTab(value: string | null | undefined): value is FilterTab {
  return (
    value === "all" ||
    value === "video" ||
    value === "web" ||
    value === "published" ||
    value === "drafts"
  );
}

function readInitialAdminViewState(): {
  mode: "dashboard" | "projects";
  tab: FilterTab;
  page: number;
  searchQuery: string;
  highlightedProjectId: string | null;
} {
  if (typeof window === "undefined") {
    return {
      mode: "dashboard",
      tab: "all",
      page: 1,
      searchQuery: "",
      highlightedProjectId: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const urlTab = params.get("tab");
  const urlPage = parseInt(params.get("page") || "", 10);
  const hasProjectsHash = window.location.hash === "#projects-manager";

  let saved: Partial<AdminProjectsReturnState> | null = null;
  try {
    const raw = window.sessionStorage.getItem(ADMIN_RETURN_STATE_KEY);
    if (raw) {
      saved = JSON.parse(raw) as Partial<AdminProjectsReturnState>;
    }
  } catch {
    // Ignore storage read errors
  }

  const isProjectsView =
    isValidFilterTab(urlTab) ||
    hasProjectsHash ||
    Boolean(saved?.shouldRestoreScroll && saved?.isAllProjectsMode);

  const tab: FilterTab = isValidFilterTab(urlTab)
    ? urlTab
    : isValidFilterTab(saved?.tab)
    ? saved.tab
    : "all";
  const page =
    Number.isFinite(urlPage) && urlPage > 0
      ? urlPage
      : typeof saved?.page === "number" && saved.page > 0
      ? saved.page
      : 1;
  const searchQuery =
    typeof saved?.searchQuery === "string" ? saved.searchQuery : "";
  const highlightedProjectId =
    saved?.shouldRestoreScroll && typeof saved?.projectId === "string"
      ? saved.projectId
      : null;

  return {
    mode: isProjectsView ? "projects" : "dashboard",
    tab,
    page,
    searchQuery,
    highlightedProjectId,
  };
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [cvDocuments, setCvDocuments] = useState<CvDocumentRecord[]>([]);
  const [activeCvDocument, setActiveCvDocument] =
    useState<CvDocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Deterministic initial states so SSR and client hydration match 100%
  const [viewMode, setViewMode] = useState<"dashboard" | "projects">(
    "dashboard"
  );
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(
    null
  );
  const hasRestoredViewRef = useRef(false);
  const pageSize = 12;

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<ProjectRecord | null>(null);

  // Listen for sidebar view/sub-tab changes
  useEffect(() => {
    const handleSidebarViewChange = (e: Event) => {
      const custom = e as CustomEvent<AdminViewEventDetail>;
      if (!custom.detail) return;
      if (custom.detail.mode === "dashboard") {
        setViewMode("dashboard");
      } else if (custom.detail.mode === "projects") {
        setViewMode("projects");
        if (custom.detail.tab) {
          setActiveTab(custom.detail.tab);
          setCurrentPage(1);
        }
      }
    };
    window.addEventListener(ADMIN_VIEW_EVENT, handleSidebarViewChange);
    return () =>
      window.removeEventListener(ADMIN_VIEW_EVENT, handleSidebarViewChange);
  }, []);

  // Sync URL query params and sessionStorage whenever viewMode, tab, page, or searchQuery changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasRestoredViewRef.current) return;
    const params = new URLSearchParams(window.location.search);

    if (viewMode === "dashboard") {
      params.delete("tab");
      params.delete("page");
    } else {
      params.set("tab", activeTab);
      if (currentPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(currentPage));
      }
    }

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const nextUrl = `/admin${queryStr}`;
    window.history.replaceState(null, "", nextUrl);

    try {
      const existingRaw = window.sessionStorage.getItem(ADMIN_RETURN_STATE_KEY);
      const existing = existingRaw
        ? (JSON.parse(existingRaw) as Partial<AdminProjectsReturnState>)
        : {};
      const updatedState: AdminProjectsReturnState = {
        tab: activeTab,
        page: currentPage,
        searchQuery,
        scrollY: existing.shouldRestoreScroll
          ? existing.scrollY ?? window.scrollY
          : window.scrollY,
        projectId: existing.projectId,
        isAllProjectsMode: viewMode === "projects",
        returnUrl: nextUrl,
        shouldRestoreScroll: existing.shouldRestoreScroll,
      };
      window.sessionStorage.setItem(
        ADMIN_RETURN_STATE_KEY,
        JSON.stringify(updatedState)
      );
    } catch {
      // Ignore storage write errors
    }
  }, [viewMode, activeTab, currentPage, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await Promise.resolve();
      if (!isMounted) return;

      const restored = readInitialAdminViewState();
      hasRestoredViewRef.current = true;
      setViewMode(restored.mode);
      setActiveTab(restored.tab);
      setSearchQuery(restored.searchQuery);
      setCurrentPage(restored.page);
      setHighlightedProjectId(restored.highlightedProjectId);

      try {
        const [projectsRes, inquiriesRes, cvRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/inquiries").catch(() => null),
          fetch("/api/admin/cv").catch(() => null),
        ]);

        if (!projectsRes.ok) {
          const data = await projectsRes.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load projects");
        }

        const [projectsData, inquiriesData, cvData] = await Promise.all([
          projectsRes.json(),
          inquiriesRes && inquiriesRes.ok
            ? inquiriesRes.json().catch(() => ({}))
            : Promise.resolve({}),
          cvRes && cvRes.ok ? cvRes.json().catch(() => ({})) : Promise.resolve({}),
        ]);

        if (isMounted) {
          const loadedProjects: ProjectRecord[] = projectsData.projects || [];
          setProjects(loadedProjects);
          setInquiries(inquiriesData.inquiries || []);
          setCvDocuments(cvData.documents || []);
          setActiveCvDocument(cvData.activeDocument || null);

          // Ensure the page containing the edited project is selected if priority changed
          if (restored.highlightedProjectId && restored.mode === "projects") {
            const filtered = loadedProjects.filter((p) => {
              if (restored.tab === "video" && p.type !== "video") return false;
              if (restored.tab === "web" && p.type !== "web") return false;
              if (restored.tab === "published" && !p.is_published) return false;
              if (restored.tab === "drafts" && p.is_published) return false;
              if (restored.searchQuery.trim()) {
                const q = restored.searchQuery.toLowerCase();
                const matchTitle = p.title.toLowerCase().includes(q);
                const matchClient =
                  p.client_name?.toLowerCase().includes(q) || false;
                const matchTags =
                  p.tags?.some((t) => t.toLowerCase().includes(q)) || false;
                return matchTitle || matchClient || matchTags;
              }
              return true;
            });
            const idx = filtered.findIndex(
              (p) => p.id === restored.highlightedProjectId
            );
            if (idx !== -1) {
              const targetPage = Math.floor(idx / pageSize) + 1;
              setCurrentPage(targetPage);
            }
          }
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

  // Restore scroll position & project row when returning from Edit / Create
  useEffect(() => {
    if (loading || typeof window === "undefined") return;

    try {
      const raw = window.sessionStorage.getItem(ADMIN_RETURN_STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<AdminProjectsReturnState>;
      if (!saved.shouldRestoreScroll) return;

      // Clear the one-shot restore flag now that we are on the right tab & page
      window.sessionStorage.setItem(
        ADMIN_RETURN_STATE_KEY,
        JSON.stringify({
          ...saved,
          shouldRestoreScroll: false,
        })
      );

      const targetScrollY =
        typeof saved.scrollY === "number" ? saved.scrollY : 0;
      const targetProjectId = saved.projectId;

      requestAnimationFrame(() => {
        if (targetScrollY > 0) {
          window.scrollTo({ top: targetScrollY, behavior: "instant" });
        }
        if (targetProjectId) {
          const rowEl = document.getElementById(
            `admin-project-row-${targetProjectId}`
          );
          if (rowEl) {
            const rect = rowEl.getBoundingClientRect();
            const isVisibleInViewport =
              rect.top >= 72 && rect.bottom <= window.innerHeight - 24;
            if (!isVisibleInViewport) {
              rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }
      });

      const timer = window.setTimeout(() => {
        setHighlightedProjectId(null);
      }, 2400);

      return () => window.clearTimeout(timer);
    } catch {
      // Ignore storage read errors
    }
  }, [loading, filteredProjects, currentPage, pageSize]);

  const handleSaveEditReturnState = (projectId: string) => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams();
      if (viewMode === "projects") {
        params.set("tab", activeTab);
        if (currentPage > 1) params.set("page", String(currentPage));
      }
      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const returnState: AdminProjectsReturnState = {
        tab: activeTab,
        page: currentPage,
        searchQuery,
        scrollY: window.scrollY,
        projectId,
        isAllProjectsMode: viewMode === "projects",
        returnUrl: `/admin${queryStr}`,
        shouldRestoreScroll: true,
      };
      window.sessionStorage.setItem(
        ADMIN_RETURN_STATE_KEY,
        JSON.stringify(returnState)
      );
    } catch {
      // Ignore storage write errors
    }
  };

  const handleSelectProjectsTab = (tab: FilterTab) => {
    setViewMode("projects");
    setActiveTab(tab);
    setCurrentPage(1);
    dispatchAdminViewChange({ mode: "projects", tab });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  const activeCategoryTitle =
    activeTab === "video"
      ? "Video Projects"
      : activeTab === "web"
      ? "Web Projects"
      : activeTab === "published"
      ? "Published Projects"
      : activeTab === "drafts"
      ? "Draft Projects"
      : "All Projects";

  const activeCategoryDescription =
    activeTab === "video"
      ? `Showing ${filteredProjects.length} of ${stats.video} video showcase works.`
      : activeTab === "web"
      ? `Showing ${filteredProjects.length} of ${stats.web} web engineering case studies.`
      : activeTab === "published"
      ? `Showing ${filteredProjects.length} live published works.`
      : activeTab === "drafts"
      ? `Showing ${filteredProjects.length} unpublished draft works.`
      : `Showing ${filteredProjects.length} of ${stats.total} total portfolio works across Video and Web.`;

  if (viewMode === "dashboard") {
    return (
      <div className="select-none">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
            {errorMsg}
          </div>
        )}
        <AdminExecutiveOverview
          projects={projects}
          inquiries={inquiries}
          cvDocuments={cvDocuments}
          activeCvDocument={activeCvDocument}
          loading={loading}
          togglingId={togglingId}
          onSelectProjectsTab={handleSelectProjectsTab}
          onTogglePublish={handleTogglePublish}
          onSaveEditReturnState={handleSaveEditReturnState}
        />
      </div>
    );
  }

  return (
    <div id="projects-manager" className="space-y-6 select-none">
      {/* Top Category Header, Search & Create Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
              {activeCategoryTitle}
            </h1>
            <Badge variant="default" className="font-mono-custom text-xs px-2.5 py-0.5">
              {filteredProjects.length}
            </Badge>
          </div>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            {activeCategoryDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
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

          {(activeTab === "all" || activeTab === "video") && (
            <Link
              href="/admin/projects/new?type=video"
              className={buttonVariants({
                variant: activeTab === "video" ? "default" : "secondary",
                size: "sm",
                className: "flex-1 sm:flex-initial justify-center px-3.5 py-2 h-9",
              })}
            >
              <Film
                className={`h-3.5 w-3.5 ${
                  activeTab === "video" ? "" : "text-sky-400"
                }`}
                aria-hidden="true"
              />
              <span>+ Video Project</span>
            </Link>
          )}
          {(activeTab === "all" || activeTab === "web") && (
            <Link
              href="/admin/projects/new?type=web"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "flex-1 sm:flex-initial justify-center px-3.5 py-2 h-9",
              })}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>+ Web Project</span>
            </Link>
          )}
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
            const isHighlighted = highlightedProjectId === project.id;

            return (
              <div
                key={project.id}
                id={`admin-project-row-${project.id}`}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500 ${
                  isHighlighted
                    ? "bg-emerald-500/8 ring-1 ring-inset ring-emerald-500/35"
                    : "hover:bg-white/2"
                }`}
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

                    <h3 className="font-sans font-medium text-sm sm:text-base text-white line-clamp-2 sm:truncate">
                      {project.title}
                    </h3>

                    <p className="font-mono-custom text-xs text-[#777] truncate mt-0.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Status & Controls */}
                <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t border-white/5 sm:border-0 shrink-0">
                  {/* Publish Toggle Button */}
                  <Button
                    variant={project.is_published ? "success" : "warning"}
                    size="sm"
                    onClick={() => handleTogglePublish(project)}
                    disabled={togglingId === project.id}
                    className="w-full sm:w-auto justify-center px-2.5 sm:px-3 uppercase tracking-wider"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        project.is_published ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span>{project.is_published ? "Published" : "Draft"}</span>
                  </Button>

                  {/* Edit Link */}
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    onClick={() => handleSaveEditReturnState(project.id)}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "sm",
                      className: "w-full sm:w-auto justify-center px-2.5 sm:px-3",
                    })}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDeleteProject(project)}
                    className="w-full sm:w-auto justify-center px-2.5 sm:px-3"
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

              <div className="flex items-center justify-between sm:justify-center gap-2 w-full sm:w-auto">
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
