"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject, PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { compareProjectsByPriorityAndRecency } from "@/types/project";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { ProjectPreviewModal } from "./ProjectPreviewModal";
import { AurexaCaseStudyCard } from "./AurexaCaseStudyCard";
import { HairlineRule } from "@/components/common/HairlineRule";
import { SectionBadge } from "@/components/common/SectionBadge";

const VIDEO_FORMAT_OPTIONS = [
  { id: "all", label: "All Videos" },
  { id: "16:9", label: "16:9 — Landscape" },
  { id: "9:16", label: "9:16 — Portrait / Reels & Shorts" },
  { id: "1:1", label: "1:1 — Square" },
  { id: "4:3", label: "4:3" },
  { id: "5:4", label: "5:4" },
] as const;

interface ProjectsPageContentProps {
  initialProjects?: PortfolioProject[];
}

export function ProjectsPageContent({ initialProjects }: ProjectsPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial tab from query param: ?type=video or ?type=web
  const initialType = searchParams.get("type");
  const [activeTab, setActiveTab] = useState<"video" | "web">(
    initialType === "web" ? "web" : "video"
  );

  // Active aspect ratio subfilter for videos
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

  // Modal states
  const [activeVideoModal, setActiveVideoModal] = useState<PortfolioProject | null>(null);
  const [activeWebModal, setActiveWebModal] = useState<PortfolioProject | null>(null);

  // All published projects
  const [allProjects, setAllProjects] = useState<PortfolioProject[]>(
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : PORTFOLIO_DATA.showcaseProjects || []
  );

  // Synchronize state with URL query parameter
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "web" && activeTab !== "web") {
      setActiveTab("web");
    } else if (typeParam === "video" && activeTab !== "video") {
      setActiveTab("video");
    }
  }, [searchParams, activeTab]);

  // Fetch complete published collection from API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.projects && data.projects.length > 0) {
          // Merge API database projects with static fallback projects to ensure full coverage
          const apiProjects: PortfolioProject[] = data.projects;
          const merged = [...apiProjects];
          
          for (const fallback of PORTFOLIO_DATA.showcaseProjects) {
            const exists = merged.some(
              (p) =>
                p.id === fallback.id ||
                (p.slug && fallback.slug && p.slug === fallback.slug) ||
                p.title.toLowerCase() === fallback.title.toLowerCase()
            );
            if (!exists) {
              merged.push(fallback);
            }
          }
          setAllProjects(merged);
        }
      })
      .catch(() => {
        // Fallback remains active
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (tab: "video" | "web") => {
    setActiveTab(tab);
    // Update URL query parameter without full reload
    const params = new URLSearchParams(window.location.search);
    params.set("type", tab);
    router.replace(`/projects?${params.toString()}`, { scroll: false });
  };

  // Video projects sorted independently
  const allVideoProjects = useMemo(() => {
    return allProjects
      .filter((p) => p.type === "video")
      .sort(compareProjectsByPriorityAndRecency);
  }, [allProjects]);

  // Web projects sorted independently
  const allWebProjects = useMemo(() => {
    return allProjects
      .filter((p) => p.type === "web")
      .sort(compareProjectsByPriorityAndRecency);
  }, [allProjects]);

  // Filter video projects by selected aspect ratio
  const filteredVideos = useMemo(() => {
    if (selectedFormat === "all") return allVideoProjects;
    return allVideoProjects.filter((p) => {
      const format = p.format || "16:9";
      return format === selectedFormat;
    });
  }, [allVideoProjects, selectedFormat]);

  // Compute counts per aspect ratio format
  const formatCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allVideoProjects.length };
    for (const opt of VIDEO_FORMAT_OPTIONS) {
      if (opt.id !== "all") {
        counts[opt.id] = allVideoProjects.filter(
          (p) => (p.format || "16:9") === opt.id
        ).length;
      }
    }
    return counts;
  }, [allVideoProjects]);

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 md:px-10 lg:px-12 pt-28 sm:pt-32 md:pt-36 pb-24">
      {/* Breadcrumb Navigation Back to Overview */}
      <div className="mb-8 sm:mb-12">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] hover:text-white uppercase tracking-wider transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Page Hero Header */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <SectionBadge label="ARCHIVE" />
          <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] font-normal uppercase">
            All Projects &amp; Works
          </h1>
        </div>

        <div className="max-w-md lg:max-w-lg md:text-right">
          <p className="font-mono-custom text-xs sm:text-sm text-[#a1a1a1] leading-relaxed">
            The complete public archive of commercial video post-production, AI-assisted content creation, responsive web platforms, and enterprise digital systems.
          </p>
        </div>
      </div>

      <HairlineRule className="mb-10 sm:mb-14" />

      {/* Main Top-Level Category Navigation: Video vs Web */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 sm:mb-14">
        {/* Category Tabs: Video | Web */}
        <div
          role="tablist"
          aria-label="Filter archive projects by discipline"
          className="inline-flex items-center p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)] w-fit"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => handleTabChange("video")}
            className={`relative px-6 sm:px-8 py-2 rounded-full font-mono-custom text-xs sm:text-sm uppercase tracking-wider transition-colors z-10 flex items-center gap-2 ${
              activeTab === "video" ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`}
          >
            {activeTab === "video" && (
              <motion.div
                layoutId="activeArchiveTab"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white/15 border border-white/20 rounded-full z-[-1] shadow-sm"
              />
            )}
            <span>Video Projects</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-white/10 text-white/80">
              {allVideoProjects.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "web"}
            onClick={() => handleTabChange("web")}
            className={`relative px-6 sm:px-8 py-2 rounded-full font-mono-custom text-xs sm:text-sm uppercase tracking-wider transition-colors z-10 flex items-center gap-2 ${
              activeTab === "web" ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`}
          >
            {activeTab === "web" && (
              <motion.div
                layoutId="activeArchiveTab"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white/15 border border-white/20 rounded-full z-[-1] shadow-sm"
              />
            )}
            <span>Web Projects</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-white/10 text-white/80">
              {allWebProjects.length}
            </span>
          </button>
        </div>

        {/* Total Count Indicator */}
        <div className="font-mono-custom text-xs text-[#888] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>
            {activeTab === "video"
              ? `Showing ${filteredVideos.length} of ${allVideoProjects.length} published video productions`
              : `Showing ${allWebProjects.length} published web applications & platforms`}
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIDEO TAB CONTENT: Aspect Ratio Subcategories & Video Grid   */}
      {/* ============================================================ */}
      {activeTab === "video" && (
        <div className="w-full">
          {/* Aspect Ratio Sub-Filter Pills */}
          <div className="w-full flex flex-wrap items-center gap-2 sm:gap-2.5 mb-10 sm:mb-12">
            <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider mr-2 hidden sm:inline">
              Format:
            </span>
            {VIDEO_FORMAT_OPTIONS.map((opt) => {
              const isSelected = selectedFormat === opt.id;
              const count = formatCounts[opt.id] ?? 0;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedFormat(opt.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-mono-custom text-xs tracking-wide transition-all border flex items-center gap-2 ${
                    isSelected
                      ? "bg-white text-black border-white font-medium shadow-md"
                      : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-black/15 text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Video Projects Grid */}
          {filteredVideos.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {filteredVideos.map((project, idx) => {
                const projectSlug = project.slug || project.id;
                const formatLabel = project.format || "16:9";
                const isPortrait = formatLabel === "9:16";

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                    className="group relative rounded-2xl bg-[#0f0f0f] border border-white/10 hover:border-white/25 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                  >
                    {/* Media Thumbnail Container with Format Badge & Play Action */}
                    <div
                      className={`relative w-full overflow-hidden bg-black/60 cursor-pointer ${
                        isPortrait ? "h-[360px] sm:h-[400px]" : "h-[220px] sm:h-[240px]"
                      }`}
                      onClick={() => setActiveVideoModal(project)}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Top Badges: Format & Attribution */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="font-mono-custom text-[10px] uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/90 border border-white/15">
                          {project.client || "Client Project"}
                        </span>
                        <span className="font-mono-custom text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {formatLabel}
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-lg">
                          <span className="text-sm font-sans ml-0.5">▶</span>
                        </div>
                      </div>

                      {/* Bottom Duration / Platform Hint */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono-custom text-[11px] text-white/80 pointer-events-none">
                        <span className="truncate max-w-[200px]">{project.category || "Commercial Video"}</span>
                        <span>@{project.year || "2026"}</span>
                      </div>
                    </div>

                    {/* Information Body */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <h3 className="font-gambarino text-xl sm:text-2xl text-white leading-snug mb-2 group-hover:text-white transition-colors">
                          <Link href={`/projects/video/${projectSlug}`} className="hover-underline-link">
                            {project.title}
                          </Link>
                        </h3>

                        <p className="font-mono-custom text-xs text-[#999] leading-relaxed line-clamp-3 mb-4">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {(project.tags || []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="font-mono-custom text-[10px] text-[#888] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Buttons: Play Modal + Dedicated Details Page */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveVideoModal(project)}
                          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs transition-colors flex items-center gap-1.5"
                          aria-label={`Play ${project.title}`}
                        >
                          <span>Play</span>
                          <span>▶</span>
                        </button>

                        <Link
                          href={`/projects/video/${projectSlug}`}
                          className="px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white hover:text-black text-white/90 font-mono-custom text-xs border border-white/10 transition-all flex items-center gap-1.5"
                          aria-label={`View full details for ${project.title}`}
                        >
                          <span>Details</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Polished Empty State for aspect ratio filters with no items */
            <div className="w-full py-20 px-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl mb-4">
                🎬
              </div>
              <h3 className="font-gambarino text-2xl text-white mb-2">
                No Projects in {selectedFormat} Format
              </h3>
              <p className="font-mono-custom text-xs sm:text-sm text-[#888] max-w-md mx-auto mb-6 leading-relaxed">
                There are currently no published video projects configured with this specific aspect ratio. Browse all published productions or check other format categories.
              </p>
              <button
                type="button"
                onClick={() => setSelectedFormat("all")}
                className="px-6 py-2 rounded-full bg-white text-black font-mono-custom text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                View All Videos ({allVideoProjects.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* WEB TAB CONTENT: Complete Published Web Projects Collection  */}
      {/* ============================================================ */}
      {activeTab === "web" && (
        <div className="w-full">
          {allWebProjects.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {allWebProjects.map((project, idx) => {
                const projectSlug = project.slug || project.id;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (idx % 8) * 0.05 }}
                    className="w-full flex flex-col"
                  >
                    {/* Aurexa Case Study Card with Interactive Preview */}
                    <AurexaCaseStudyCard
                      project={project}
                      onPreviewWeb={(p) => setActiveWebModal(p)}
                    />

                    {/* Dedicated Detail Page Link below card */}
                    <div className="mt-3 px-2 flex items-center justify-between font-mono-custom text-xs">
                      <span className="text-[#666] truncate max-w-[140px]">
                        {project.client || "Client Project"}
                      </span>
                      <Link
                        href={`/projects/web/${projectSlug}`}
                        className="text-[#aaa] hover:text-white transition-colors flex items-center gap-1 group"
                        aria-label={`View full case study for ${project.title}`}
                      >
                        <span className="group-hover:underline">View Case Study</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="w-full py-20 px-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <p className="font-mono-custom text-sm text-[#888]">
                No web projects found in the archive.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        project={activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
      />

      {/* Web Live Preview Modal */}
      <ProjectPreviewModal
        project={activeWebModal}
        onClose={() => setActiveWebModal(null)}
      />
    </div>
  );
}
