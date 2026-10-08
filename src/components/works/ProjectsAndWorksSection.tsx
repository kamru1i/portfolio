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
  
  // Video projects ordered to match Patrick Jane proportions:
  // Card 1 (Small): Biqolpo (Latent Stories)
  // Card 2 (Large): Syston Autos Cinema
  // Card 3 (Center Large): B&F Cars Automotive (9:16 vertical reel)
  const videoProjects = [
    projects.find((p) => p.id === "biqolpo-ai-video"),
    projects.find((p) => p.id === "syston-autos-video"),
    projects.find((p) => p.id === "bf-cars-video"),
  ].filter(Boolean) as PortfolioProject[];

  // Web projects ordered to match Patrick Jane proportions:
  // Card 1 (Small): Architectural Portfolio
  // Card 2 (Large): Velocity Interface System
  // Card 3 (Center Large): JobMatchingBD Career Portal
  const webProjects = [
    projects.find((p) => p.id === "portfolio-architectural-web"),
    projects.find((p) => p.id === "velocity-interface-web"),
    projects.find((p) => p.id === "jobmatching-portal-web"),
  ].filter(Boolean) as PortfolioProject[];

  const currentProjects = activeTab === "video" ? videoProjects : webProjects;

  return (
    <section
      id="projects"
      className="relative w-full pt-20 md:pt-28 pb-20 select-none scroll-mt-24"
    >
      {/* Anchor alias to support legacy #works links */}
      <div id="works" className="absolute -top-24 pointer-events-none" />

      {/* Hairline Divider Rule */}
      <HairlineRule className="mb-10 md:mb-14" />

      {/* Section Header: Patrick Jane Title (Left) + Subtitle (Right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8 sm:mb-10">
        {/* Left: Section Badge + Patrick Jane Headline */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
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

        {/* Right: Editorial Narrative Statement matching Patrick Jane */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
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

      {/* Left-Aligned Category Tabs with Low Visual Emphasis */}
      <div className="w-full flex items-center justify-start mt-6 mb-16 sm:mb-20 md:mb-24">
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

      {/* Projects Grid Container: Exact Patrick Jane Selected Works Asymmetric Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full flex flex-col gap-24 sm:gap-32 md:gap-40 pb-20"
        >
          {/* Row 1: Card 1 (Left 352px / 3-cols) + Card 2 (Right 704px / 6-cols col-start-7) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
            {currentProjects[0] && (
              <div className="col-span-12 md:col-span-3">
                <WorkCard
                  project={currentProjects[0]}
                  isLarge={false}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}

            {currentProjects[1] && (
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                <WorkCard
                  project={currentProjects[1]}
                  isLarge={true}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            )}
          </div>

          {/* Row 2: Card 3 (Centered 704px / 6-cols col-start-4) */}
          {currentProjects[2] && (
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
              <div className="col-span-12 md:col-span-6 md:col-start-4">
                <WorkCard
                  project={currentProjects[2]}
                  isLarge={true}
                  onPlayVideo={(p) => setActiveVideoProject(p)}
                  onPreviewWeb={(p) => setActiveWebProject(p)}
                />
              </div>
            </div>
          )}

          {/* Row 3: Card 4 (Left 704px / 6-cols) + Card 5 (Right 352px / 3-cols col-start-10) with Explore More */}
          {(currentProjects[3] || currentProjects[4]) && (
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
              {currentProjects[3] && (
                <div className="col-span-12 md:col-span-6">
                  <WorkCard
                    project={currentProjects[3]}
                    isLarge={true}
                    onPlayVideo={(p) => setActiveVideoProject(p)}
                    onPreviewWeb={(p) => setActiveWebProject(p)}
                  />
                </div>
              )}

              {currentProjects[4] && (
                <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-between">
                  <WorkCard
                    project={currentProjects[4]}
                    isLarge={false}
                    onPlayVideo={(p) => setActiveVideoProject(p)}
                    onPreviewWeb={(p) => setActiveWebProject(p)}
                  />

                  {/* Explore More CTA matching Patrick Jane reference */}
                  <div className="mt-16 sm:mt-24 pt-4">
                    <a
                      href="#works"
                      className="font-mono-custom text-[15px] sm:text-[16px] text-white hover-underline-link tracking-wide"
                    >
                      Explore More
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
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
