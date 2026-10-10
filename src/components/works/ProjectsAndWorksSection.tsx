"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { SectionBadge } from "@/components/common/SectionBadge";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";
import { compareProjectsByPriorityAndRecency } from "@/types/project";
import { PatrickJaneSelectedWorks } from "./PatrickJaneSelectedWorks";
import { AurexaCaseStudies } from "./AurexaCaseStudies";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { ProjectPreviewModal } from "./ProjectPreviewModal";

interface ProjectsAndWorksSectionProps {
  initialProjects?: PortfolioProject[];
}

export function ProjectsAndWorksSection({ initialProjects }: ProjectsAndWorksSectionProps = {}) {
  const [activeTab, setActiveTab] = useState<"video" | "web">("video");
  const [activeVideoProject, setActiveVideoProject] = useState<PortfolioProject | null>(null);
  const [activeWebProject, setActiveWebProject] = useState<PortfolioProject | null>(null);

  const [projects, setProjects] = useState<PortfolioProject[]>(
    initialProjects || PORTFOLIO_DATA.showcaseProjects || []
  );

  // Fetch updated published projects from database
  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.projects && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {
        // Safe fallback remains active
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter dynamically by type, sort by priority/recency, and enforce strict homepage overview limits (max 5 videos, max 8 web)
  const videoProjects = [...projects.filter((p) => p.type === "video")]
    .sort(compareProjectsByPriorityAndRecency)
    .slice(0, 5);
  const webProjects = [...projects.filter((p) => p.type === "web")]
    .sort(compareProjectsByPriorityAndRecency)
    .slice(0, 8);

  return (
    <section
      id="projects"
      className="relative w-full pt-20 md:pt-28 pb-20 select-none scroll-mt-24"
    >
      {/* Anchor alias to support legacy #works links */}
      <div id="works" className="absolute -top-24 pointer-events-none" />

      {/* Hairline Divider Rule */}
      <HairlineRule className="mb-10 md:mb-14" />

      {/* Section Header: Patrick Jane Title (Left) + Subtitle (Right) — SHARED for both Video & Web */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8 sm:mb-10">
        {/* Left: Section Badge + Patrick Jane Headline */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-6 flex flex-col"
        >
          <SectionBadge label="PROJECTS" />
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08] font-normal uppercase">
            {PORTFOLIO_DATA.worksHeader.title}
          </h2>
        </motion.div>

        {/* Right: Editorial Narrative Statement */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="md:col-span-6 md:pt-14"
        >
          <p
            className="font-mono-custom text-[15px] sm:text-[16px] leading-[1.6] text-[#a1a1a1] [&_strong]:text-white [&_strong]:font-medium"
            dangerouslySetInnerHTML={{
              __html: PORTFOLIO_DATA.worksHeader.statementHtml,
            }}
          />
        </motion.div>
      </div>

      {/* Category Tabs: Video | Web — Positioned AFTER Projects & Works and subtitle */}
      <div className="w-full flex items-center justify-start mt-4 mb-14 sm:mb-18 md:mb-20">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => setActiveTab("video")}
            className={`relative px-5 sm:px-6 py-1.5 rounded-full font-mono-custom text-xs uppercase tracking-wider transition-colors z-10 ${
              activeTab === "video" ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`}
          >
            {activeTab === "video" && (
              <motion.div
                layoutId="activeWorksTab"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white/15 border border-white/20 rounded-full z-[-1] shadow-sm"
              />
            )}
            Video
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "web"}
            onClick={() => setActiveTab("web")}
            className={`relative px-5 sm:px-6 py-1.5 rounded-full font-mono-custom text-xs uppercase tracking-wider transition-colors z-10 ${
              activeTab === "web" ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`}
          >
            {activeTab === "web" && (
              <motion.div
                layoutId="activeWorksTab"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white/15 border border-white/20 rounded-full z-[-1] shadow-sm"
              />
            )}
            Web
          </button>
        </div>
      </div>

      {/* Tab Content: Video (Patrick Jane Selected Works) vs Web (Aurexa Cards Setup) */}
      <AnimatePresence mode="wait">
        {activeTab === "video" ? (
          <motion.div
            key="video-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            {/* Patrick Jane 5-Card Selected Works Grid */}
            <PatrickJaneSelectedWorks
              projects={videoProjects}
              onPlayVideo={(p) => setActiveVideoProject(p)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="web-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            {/* Aurexa Cards Setup (purely the cards grid, zero extra headers/stats) */}
            <AurexaCaseStudies
              projects={webProjects}
              onPreviewWeb={(p) => setActiveWebProject(p)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* In-Site Video Player Modal */}
      <VideoPlayerModal
        project={activeVideoProject}
        onClose={() => setActiveVideoProject(null)}
      />

      {/* In-Site Web Live Preview Modal with Graceful Fallback */}
      <ProjectPreviewModal
        project={activeWebProject}
        onClose={() => setActiveWebProject(null)}
      />
    </section>
  );
}
