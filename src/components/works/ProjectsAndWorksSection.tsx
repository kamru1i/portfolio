"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { ProjectPreviewModal } from "./ProjectPreviewModal";

export function ProjectsAndWorksSection() {
  const [activeTab, setActiveTab] = useState<"video" | "web">("video");
  const [activeVideoProject, setActiveVideoProject] = useState<PortfolioProject | null>(null);
  const [activeWebProject, setActiveWebProject] = useState<PortfolioProject | null>(null);

  const projects = PORTFOLIO_DATA.showcaseProjects || [];
  const videoProjects = projects.filter((p) => p.type === "video");
  const webProjects = projects.filter((p) => p.type === "web");

  return (
    <section id="projects" className="relative w-full pt-20 md:pt-28 pb-20 select-none scroll-mt-24">
      {/* Anchor alias to support legacy #works links */}
      <div id="works" className="absolute -top-24 pointer-events-none" />

      <HairlineRule className="mb-14 md:mb-20" />

      {/* Section Header: Patrick Jane Title (Left) + Subtitle (Right) */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
        >
          <h2 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white tracking-tight leading-[1.08] font-normal uppercase">
            {PORTFOLIO_DATA.worksHeader.title}
          </h2>
        </motion.div>

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

      {/* Centered Category Tabs: VIDEO / WEB */}
      <div className="w-full flex items-center justify-center mb-12 md:mb-16">
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="inline-flex items-center p-1.5 rounded-full bg-[#181818] border border-white/10 backdrop-blur-md shadow-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => setActiveTab("video")}
            className={`relative px-7 sm:px-9 py-2.5 rounded-full font-mono-custom text-xs sm:text-sm uppercase tracking-wider font-medium transition-colors z-10 ${
              activeTab === "video" ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            {activeTab === "video" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white rounded-full z-[-1] shadow-md"
              />
            )}
            Video
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "web"}
            onClick={() => setActiveTab("web")}
            className={`relative px-7 sm:px-9 py-2.5 rounded-full font-mono-custom text-xs sm:text-sm uppercase tracking-wider font-medium transition-colors z-10 ${
              activeTab === "web" ? "text-black" : "text-white/70 hover:text-white"
            }`}
          >
            {activeTab === "web" && (
              <motion.div
                layoutId="activeTabIndicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white rounded-full z-[-1] shadow-md"
              />
            )}
            Web
          </button>
        </div>
      </div>

      {/* Projects Grid Container with Smooth Transition */}
      <AnimatePresence mode="wait">
        {activeTab === "video" ? (
          <motion.div
            key="tab-video"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          >
            {videoProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveVideoProject(project)}
                className="group relative rounded-2xl bg-[#161616] border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between cursor-pointer hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Thumbnail Container with Play Overlay */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-5">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl pl-1 shadow-xl transition-transform duration-300 group-hover:scale-110">
                        ▶
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 font-mono-custom text-[11px] text-white/90">
                      {project.year}
                    </div>
                  </div>

                  {/* Client & Metadata */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono-custom text-xs uppercase tracking-wider text-[#888] group-hover:text-emerald-400 transition-colors">
                      {project.client}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans text-xl sm:text-2xl text-white font-medium tracking-tight mb-3">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Action Indicator */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-custom text-[11px] text-[#777] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="font-mono-custom text-xs text-white/60 group-hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap">
                    Play Video ↗
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="tab-web"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          >
            {webProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-[#161616] border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Thumbnail / Visual Preview */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-5">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 font-mono-custom text-[11px] text-white/90">
                      {project.year}
                    </div>
                  </div>

                  {/* Client & Metadata */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono-custom text-xs uppercase tracking-wider text-[#888] group-hover:text-emerald-400 transition-colors">
                      {project.client}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans text-xl sm:text-2xl text-white font-medium tracking-tight mb-3">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Web Action Buttons: GITHUB / PROJECT & LIVE WEBSITE */}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white font-mono-custom text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>GitHub</span>
                        <span>↗</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveWebProject(project)}
                        className="flex-1 py-2 px-3 rounded-full bg-white text-black hover:bg-neutral-200 font-sans text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Live Website</span>
                        <span>↗</span>
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-custom text-[11px] text-[#777] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
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
