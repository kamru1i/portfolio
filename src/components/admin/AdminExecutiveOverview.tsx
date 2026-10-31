"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Inbox,
  FileText,
  ArrowRight,
  ExternalLink,
  Download,
  Pencil,
  AlertTriangle,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { ProjectRecord } from "@/types/project";
import { ContactInquiryRecord } from "@/lib/inquiries-service";
import type { CvDocumentRecord } from "@/lib/document-categories";
import { getDisplayDomain } from "@/lib/url-utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminProjectSubTab } from "./AdminSidebarShell";

interface AdminExecutiveOverviewProps {
  projects: ProjectRecord[];
  inquiries: ContactInquiryRecord[];
  cvDocuments: CvDocumentRecord[];
  activeCvDocument: CvDocumentRecord | null;
  loading: boolean;
  togglingId: string | null;
  onSelectProjectsTab: (tab: AdminProjectSubTab) => void;
  onTogglePublish: (project: ProjectRecord) => void;
  onSaveEditReturnState: (projectId: string) => void;
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function AdminExecutiveOverview({
  projects,
  inquiries,
  cvDocuments,
  activeCvDocument,
  loading,
  togglingId,
  onSelectProjectsTab,
  onTogglePublish,
  onSaveEditReturnState,
}: AdminExecutiveOverviewProps) {
  // Project Stats
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.is_published).length;
  const draftProjects = totalProjects - publishedProjects;
  const videoProjects = projects.filter((p) => p.type === "video").length;
  const webProjects = projects.filter((p) => p.type === "web").length;

  // Inquiry Stats
  const totalInquiries = inquiries.length;
  const unreadInquiries = inquiries.filter((i) => i.status === "unread").length;
  const repliedInquiries = inquiries.filter((i) => i.status === "replied").length;
  const archivedInquiries = inquiries.filter((i) => i.status === "archived").length;
  const recentInquiries = inquiries.slice(0, 4);

  // Featured Lineup (Top 3 Published Video & Web Projects)
  const topVideoProjects = projects
    .filter((p) => p.type === "video" && p.is_published)
    .slice(0, 3);
  const topWebProjects = projects
    .filter((p) => p.type === "web" && p.is_published)
    .slice(0, 3);

  // Recently Updated / Added Projects (Top 5 sorted by updated_at / created_at descending)
  const recentProjects = [...projects]
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="space-y-7">
      {/* Top Executive Header */}
      <div>
        <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal uppercase tracking-tight">
          Dashboard Overview
        </h1>
        <p className="font-mono-custom text-xs sm:text-sm text-[#888] mt-1">
          Executive command center across portfolio works, client inquiries, and active CV.
        </p>
      </div>

      {/* Section 1: Interactive Project Overview Stat Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-white/70" aria-hidden="true" />
            <h2 className="font-mono-custom text-xs uppercase tracking-wider text-[#aaa]">
              Project Overview
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectProjectsTab("all")}
            className="inline-flex items-center gap-1 font-mono-custom text-xs text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <span>Manage All</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onSelectProjectsTab("all")}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
          >
            <Card className="p-4 bg-[#121212]/90 hover:bg-white/6 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[11px] uppercase tracking-wider text-[#777] group-hover:text-[#aaa]">
                  Total Works
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#555] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                {loading ? "—" : totalProjects}
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => onSelectProjectsTab("published")}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
          >
            <Card className="p-4 bg-[#121212]/90 hover:bg-emerald-500/8 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[11px] uppercase tracking-wider text-emerald-400/80">
                  Published
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-500/40 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 mt-1">
                {loading ? "—" : publishedProjects}
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => onSelectProjectsTab("drafts")}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
          >
            <Card className="p-4 bg-[#121212]/90 hover:bg-amber-500/8 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[11px] uppercase tracking-wider text-amber-400/80">
                  Drafts
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-amber-400 mt-1">
                {loading ? "—" : draftProjects}
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => onSelectProjectsTab("video")}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl"
          >
            <Card className="p-4 bg-[#121212]/90 hover:bg-sky-500/8 hover:border-sky-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[11px] uppercase tracking-wider text-sky-400/80">
                  Video
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-sky-500/40 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-sky-400 mt-1">
                {loading ? "—" : videoProjects}
              </div>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => onSelectProjectsTab("web")}
            className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-2xl col-span-2 sm:col-span-1"
          >
            <Card className="p-4 bg-[#121212]/90 hover:bg-purple-500/8 hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono-custom text-[11px] uppercase tracking-wider text-purple-400/80">
                  Web
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-500/40 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl sm:text-3xl font-semibold text-purple-400 mt-1">
                {loading ? "—" : webProjects}
              </div>
            </Card>
          </button>
        </div>
      </div>

      {/* Section 2: Client Inquiries Overview (7 cols) + CV / Resume Overview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Client Inquiries Overview */}
        <Card className="lg:col-span-7 p-4 sm:p-6 bg-[#121212]/90 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <Inbox className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-sans text-sm font-semibold text-white">
                    Client Inquiries Overview
                  </h2>
                  <p className="font-mono-custom text-[11px] text-[#777]">
                    Direct messages &amp; project briefs from contact form
                  </p>
                </div>
              </div>

              <Link
                href="/admin/inquiries"
                className={buttonVariants({
                  variant: "secondary",
                  size: "xs",
                  className: "shrink-0",
                })}
              >
                <span>Open Inbox</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            {/* Mini Inquiry Stat Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/8">
                <span className="block font-mono-custom text-[10px] uppercase tracking-wider text-amber-400">
                  Unread
                </span>
                <span className="text-lg font-semibold text-white">
                  {loading ? "—" : unreadInquiries}
                </span>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/8">
                <span className="block font-mono-custom text-[10px] uppercase tracking-wider text-emerald-400">
                  Replied
                </span>
                <span className="text-lg font-semibold text-white">
                  {loading ? "—" : repliedInquiries}
                </span>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/8">
                <span className="block font-mono-custom text-[10px] uppercase tracking-wider text-[#888]">
                  Archived
                </span>
                <span className="text-lg font-semibold text-white">
                  {loading ? "—" : archivedInquiries}
                </span>
              </div>
              <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/8">
                <span className="block font-mono-custom text-[10px] uppercase tracking-wider text-[#888]">
                  Total
                </span>
                <span className="text-lg font-semibold text-white">
                  {loading ? "—" : totalInquiries}
                </span>
              </div>
            </div>

            {/* Recent Inquiries List */}
            {loading ? (
              <div className="py-8 flex items-center justify-center gap-2 font-mono-custom text-xs text-[#666]">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Loading recent inquiries...</span>
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-7 px-4 rounded-xl bg-white/2 border border-white/6 text-center">
                <p className="font-mono-custom text-xs text-[#777]">
                  No client inquiries received yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/6 rounded-xl border border-white/8 bg-white/2 overflow-hidden">
                {recentInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    href="/admin/inquiries"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 px-3.5 py-3 sm:py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            inq.status === "unread"
                              ? "bg-amber-400"
                              : inq.status === "replied"
                              ? "bg-emerald-400"
                              : "bg-white/30"
                          }`}
                        />
                        <span className="font-sans text-xs font-medium text-white truncate">
                          {inq.name}
                        </span>
                        <span className="font-mono-custom text-[10px] text-[#777] truncate">
                          • {inq.project_type}
                        </span>
                      </div>
                      <p className="font-mono-custom text-[11px] text-[#888] truncate mt-0.5 pl-4">
                        {inq.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pl-4 sm:pl-0 shrink-0">
                      <span className="font-mono-custom text-[10px] text-[#666]">
                        {formatShortDate(inq.created_at)}
                      </span>
                      <Badge
                        variant={
                          inq.status === "unread"
                            ? "warning"
                            : inq.status === "replied"
                            ? "success"
                            : "default"
                        }
                        className="text-[9px] px-1.5 py-0"
                      >
                        {inq.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right: CV / Resume Overview */}
        <Card className="lg:col-span-5 p-4 sm:p-6 bg-[#121212]/90 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0 mt-0.5 sm:mt-0">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-sans text-sm font-semibold text-white">
                    Curriculum Vitae Status
                  </h2>
                  <p className="font-mono-custom text-[11px] text-[#777]">
                    Active Curriculum Vitae served on /cv
                  </p>
                </div>
              </div>

              <Link
                href="/admin/cv"
                className={buttonVariants({
                  variant: "secondary",
                  size: "xs",
                  className: "shrink-0",
                })}
              >
                <span>Manage CV</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>

            {loading ? (
              <div className="py-10 flex items-center justify-center gap-2 font-mono-custom text-xs text-[#666]">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Checking active CV...</span>
              </div>
            ) : activeCvDocument ? (
              <div className="p-4 rounded-xl bg-white/3 border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="success" className="text-[10px]">
                        ● LIVE ON SITE
                      </Badge>
                      {activeCvDocument.version_label && (
                        <Badge variant="info" className="text-[10px]">
                          {activeCvDocument.version_label}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-sans text-sm font-medium text-white mt-2 truncate">
                      {activeCvDocument.title}
                    </h3>
                    <p className="font-mono-custom text-[11px] text-[#888] truncate mt-0.5">
                      {activeCvDocument.file_name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/8 font-mono-custom text-[11px]">
                  <div>
                    <span className="block text-[10px] text-[#666] uppercase">
                      File Size
                    </span>
                    <span className="text-[#ccc]">
                      {formatFileSize(activeCvDocument.file_size)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#666] uppercase">
                      Versions
                    </span>
                    <span className="text-[#ccc]">{cvDocuments.length} stored</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-[10px] text-[#666] uppercase">
                      Updated
                    </span>
                    <span className="text-[#ccc]">
                      {formatShortDate(activeCvDocument.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-amber-500/8 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono-custom text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>No Published CV Document Active</span>
                </div>
                <p className="font-mono-custom text-[11px] text-[#999]">
                  Upload or publish a PDF in the CV Manager so visitors can view and download your resume.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-1">
            {activeCvDocument && (
              <>
                <a
                  href={`/api/cv/pdf?preview=1&id=${encodeURIComponent(
                    activeCvDocument.id
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "xs",
                    className: "w-full sm:flex-1 justify-center",
                  })}
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span>Preview PDF</span>
                </a>
                <a
                  href="/api/cv/pdf?download=1"
                  download
                  className={buttonVariants({
                    variant: "secondary",
                    size: "xs",
                    className: "w-full sm:flex-1 justify-center",
                  })}
                >
                  <Download className="h-3 w-3" aria-hidden="true" />
                  <span>Download</span>
                </a>
              </>
            )}
            <Link
              href="/admin/cv"
              className={buttonVariants({
                variant: "default",
                size: "xs",
                className: "col-span-2 sm:col-span-1 w-full sm:flex-1 justify-center",
              })}
            >
              <span>{activeCvDocument ? "Replace / Update CV" : "Upload CV"}</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Section 3: Homepage Priority #1-#3 Featured Lineup (Video & Web) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 3 Video Lineup */}
        <Card className="p-4 sm:p-5 bg-[#121212]/90 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
              <h2 className="font-sans text-sm font-semibold text-white truncate">
                Video Showcase Lineup (Top 3)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectProjectsTab("video")}
              className="inline-flex items-center gap-1 font-mono-custom text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer shrink-0"
            >
              <span>All Video ({videoProjects})</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {topVideoProjects.length === 0 ? (
            <p className="font-mono-custom text-xs text-[#666] py-4 text-center">
              No published video projects yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {topVideoProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono-custom text-[11px] font-semibold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-medium text-white truncate">
                        {project.title}
                      </p>
                      <span className="font-mono-custom text-[10px] text-[#777]">
                        {project.aspect_ratio || "16:9"} •{" "}
                        {project.manual_priority
                          ? `Priority #${project.manual_priority}`
                          : "Auto Order"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    onClick={() => onSaveEditReturnState(project.id)}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "xs",
                      className: "shrink-0",
                    })}
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    <span>Edit</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top 3 Web Lineup */}
        <Card className="p-4 sm:p-5 bg-[#121212]/90 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
              <h2 className="font-sans text-sm font-semibold text-white truncate">
                Web Case Studies Lineup (Top 3)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectProjectsTab("web")}
              className="inline-flex items-center gap-1 font-mono-custom text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer shrink-0"
            >
              <span>All Web ({webProjects})</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {topWebProjects.length === 0 ? (
            <p className="font-mono-custom text-xs text-[#666] py-4 text-center">
              No published web projects yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {topWebProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono-custom text-[11px] font-semibold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-medium text-white truncate">
                        {project.title}
                      </p>
                      <span className="font-mono-custom text-[10px] text-[#777] truncate block">
                        {project.live_url
                          ? getDisplayDomain(project.live_url)
                          : "Case Study"}{" "}
                        •{" "}
                        {project.manual_priority
                          ? `Priority #${project.manual_priority}`
                          : "Auto Order"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    onClick={() => onSaveEditReturnState(project.id)}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "xs",
                      className: "shrink-0",
                    })}
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    <span>Edit</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Section 4: Recently Added / Updated Projects Quick Access */}
      <Card className="p-4 sm:p-6 bg-[#121212]/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-sm font-semibold text-white">
              Recently Updated Works
            </h2>
            <p className="font-mono-custom text-[11px] text-[#777]">
              Quick status toggle and one-click editing for your latest 5 projects
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectProjectsTab("all")}
            className={buttonVariants({
              variant: "secondary",
              size: "xs",
              className: "self-start sm:self-auto shrink-0",
            })}
          >
            <span>View All {totalProjects} Projects</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <p className="font-mono-custom text-xs text-[#666] py-6 text-center">
            No projects found.
          </p>
        ) : (
          <div className="divide-y divide-white/6 rounded-xl border border-white/8 bg-white/2 overflow-hidden">
            {recentProjects.map((project) => {
              const isVideo = project.type === "video";
              return (
                <div
                  key={project.id}
                  id={`admin-project-row-${project.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3.5 sm:px-4 py-3 hover:bg-white/4 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                      {project.preview_image_url ? (
                        <Image
                          src={project.preview_image_url}
                          alt={project.title}
                          fill
                          sizes="64px"
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] font-mono-custom text-[#555]">
                          NO IMG
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <Badge
                          variant={isVideo ? "info" : "purple"}
                          className="text-[9px] px-1.5 py-0"
                        >
                          {isVideo ? "VIDEO" : "WEB"}
                        </Badge>
                        {project.manual_priority && (
                          <Badge variant="warning" className="text-[9px] px-1.5 py-0">
                            PRIORITY #{project.manual_priority}
                          </Badge>
                        )}
                        <span className="font-mono-custom text-[10px] text-[#666]">
                          Updated {formatShortDate(project.updated_at || project.created_at)}
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm font-medium text-white truncate">
                        {project.title}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-white/5 sm:border-0 shrink-0">
                    <Button
                      variant={project.is_published ? "success" : "warning"}
                      size="xs"
                      onClick={() => onTogglePublish(project)}
                      disabled={togglingId === project.id}
                      className="w-full sm:w-auto justify-center"
                    >
                      {togglingId === project.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                      ) : (
                        <span>
                          {project.is_published ? "● Published" : "○ Draft"}
                        </span>
                      )}
                    </Button>

                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      onClick={() => onSaveEditReturnState(project.id)}
                      className={buttonVariants({
                        variant: "secondary",
                        size: "xs",
                        className: "w-full sm:w-auto justify-center",
                      })}
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
