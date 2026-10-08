"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HairlineRule } from "@/components/common/HairlineRule";
import { SectionBadge } from "@/components/common/SectionBadge";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";
import { WorkCard } from "./WorkCard";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { ProjectPreviewModal } from "./ProjectPreviewModal";

export function ProjectsAndWorksSection() {
  const [activeTab, setActiveTab] = useState<"video" | "web">("video");
  const [activeVideoProject, setActiveVideoProject] = useState<PortfolioProject | null>(null);
  const [activeWebProject, setActiveWebProject] = useState<PortfolioProject | null>(null);

  const projects = PORTFOLIO_DATA.showcaseProjects || [];
  const videoProjects = projects.filter((p) => p.type === "video");
  const webProjects = projects.filter((p) => p.type === "web");

  const currentProjects = activeTab === "video" ? videoProjects : webProjects;

  /**
   * Render projects using the approved asymmetric Selected Works layout
   * (Row 1: Asymmetric pair, Row 2: Centered spotlight, Row 3+: Alternating pairs)
   */
  const renderAsymmetricGrid = (items: PortfolioProject[]) => {
    const rows: React.ReactNode[] = [];
    let i = 0;
    let cycle = 0;

    while (i < items.length) {
      if (cycle === 0) {
        // Row 1: Left (5-cols) + Right (7-cols offset)
        const p1 = items[i];
        const p2 = items[i + 1];

        rows.push(
          <div
            key={`row-${activeTab}-${i}`}
            className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-14 items-start"
          >
            {p1 && (
              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                <WorkCard
                  project={p1}
                  isLarge={false}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}

            {p2 && (
              <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
                <WorkCard
                  project={p2}
                  isLarge={true}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}
          </div>
        );

        i += p2 ? 2 : 1;
        cycle = 1;
      } else if (cycle === 1) {
        // Row 2: Centered Spotlight (8-cols, col-start-3)
        const p = items[i];
        if (p) {
          rows.push(
            <div
              key={`row-${activeTab}-${i}`}
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-14 items-start"
            >
              <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-8 lg:col-start-3">
                <WorkCard
                  project={p}
                  isLarge={true}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            </div>
          );
        }
        i += 1;
        cycle = 2;
      } else {
        // Row 3: Left (7-cols) + Right (5-cols offset)
        const p1 = items[i];
        const p2 = items[i + 1];

        rows.push(
          <div
            key={`row-${activeTab}-${i}`}
            className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-14 items-start"
          >
            {p1 && (
              <div className="col-span-12 md:col-span-7 lg:col-span-7">
                <WorkCard
                  project={p1}
                  isLarge={true}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}

            {p2 && (
              <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8">
                <WorkCard
                  project={p2}
                  isLarge={false}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}
          </div>
        );

        i += p2 ? 2 : 1;
        cycle = 0;
      }
    }

    return (
      <div className="w-full flex flex-col gap-20 sm:gap-28 md:gap-36 pb-12">
        {rows}
      </div>
    );
  };

  return (
    <section
      id="projects"
      className="relative w-full pt-20 md:pt-28 pb-20 select-none scroll-mt-24"
    >
      {/* Anchor alias to support legacy #works links */}
      <div id="works" className="absolute -top-24 pointer-events-none" />

      <HairlineRule className="mb-14 md:mb-20" />

      {/* Section Header: Patrick Jane Title (Left) + Subtitle (Right) with SectionBadge */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        {/* Left: Badge + Patrick Jane Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
        >
          <SectionBadge label="PROJECTS" />
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white tracking-tight leading-[1.08] font-normal uppercase">
            {PORTFOLIO_DATA.worksHeader.title}
          </h2>
        </motion.div>

        {/* Right: Natural text wrapping subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-md lg:max-w-lg md:text-right"
        >
          <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
            A curated body of commercial video edits, AI-assisted productions, responsive web interfaces, and enterprise digital operations.
          </p>
        </motion.div>
      </div>

      {/* Left-Aligned Category Tabs with Low Visual Emphasis */}
      <div className="w-full flex items-center justify-start mb-12 sm:mb-16">
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

      {/* Projects Grid Container with Smooth Tab Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full"
        >
          {renderAsymmetricGrid(currentProjects)}
        </motion.div>
      </AnimatePresence>

      {/* Video Player Lightbox Modal */}
      <VideoPlayerModal
        project={activeVideoProject}
        onClose={() => setActiveVideoProject(null)}
      />

      {/* Web Live Preview Modal */}
      <ProjectPreviewModal
        project={activeWebProject}
        onClose={() => setActiveWebProject(null)}
      />
    </section>
  );
}
