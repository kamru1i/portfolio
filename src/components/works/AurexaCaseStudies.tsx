"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioProject } from "@/lib/portfolio-data";
import { AurexaCaseStudyCard } from "./AurexaCaseStudyCard";

interface AurexaCaseStudiesProps {
  projects: PortfolioProject[];
  onPreviewWeb: (project: PortfolioProject) => void;
}

export function AurexaCaseStudies({
  projects,
  onPreviewWeb,
}: AurexaCaseStudiesProps) {
  const [activeProject, setActiveProject] = useState<PortfolioProject>(
    projects[0] || ({} as PortfolioProject)
  );

  if (!projects || projects.length === 0) return null;

  const activeIndex = projects.findIndex((p) => p.id === activeProject.id);

  return (
    <div className="w-full select-none pb-20">
      {/* Desktop Split Composition (Lg+): Left Scrolling Project Rows + Right Anchored Active Case Study */}
      <div className="w-full hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT SIDE: Scrolling / Interactive Case Study Project List */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-mono-custom text-xs uppercase tracking-widest text-[#888]">
              Selected Case Studies ({projects.length})
            </span>
            <span className="font-mono-custom text-xs text-[#666]">
              Scroll to explore / Click to feature
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {projects.map((project, idx) => {
              const isSelected = project.id === activeProject.id;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  onMouseEnter={() => setActiveProject(project)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-3xl p-1 ${
                    isSelected
                      ? "ring-1 ring-emerald-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <AurexaCaseStudyCard
                    project={project}
                    onPreviewWeb={onPreviewWeb}
                  />

                  {/* Active Indicator Floating Chip */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeAurexaIndicator"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="absolute -top-3 right-6 z-30 px-3 py-1 rounded-full bg-emerald-500 text-black font-mono-custom text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-lg"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Active
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Visually Stable / Anchored Active Case Study Presentation */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="w-full rounded-3xl bg-[#111111]/90 border border-white/10 backdrop-blur-md p-7 xl:p-8 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            {/* Header: Badge + Counter */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-mono-custom text-xs uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CASE STUDY</span>
              </div>
              <span className="font-mono-custom text-xs text-[#888]">
                0{activeIndex + 1} / 0{projects.length}
              </span>
            </div>

            {/* Active Title & Category with Smooth Crossfade Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id + "-info"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col mb-5"
              >
                <h3 className="font-sans text-2xl xl:text-3xl font-semibold tracking-tight text-white leading-tight">
                  {activeProject.title}
                </h3>
                <p className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400/90 mt-1.5">
                  {activeProject.category || activeProject.client}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Active Large Project Visual / Mockup Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id + "-media"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] mb-6 shadow-inner group"
              >
                <Image
                  src={activeProject.thumbnail}
                  alt={activeProject.title}
                  fill
                  sizes="(max-width: 1200px) 50vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Active Description Narrative */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id + "-desc"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="flex flex-col mb-6"
              >
                <p className="font-sans text-sm xl:text-[15px] text-[#a3a3a3] leading-relaxed">
                  {activeProject.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-white/10">
              {activeProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-custom text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex items-center gap-3">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono-custom text-xs border border-white/15 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  aria-label={`View ${activeProject.title} source on GitHub`}
                >
                  <span>GitHub Repository</span>
                  <span>↗</span>
                </a>
              )}

              {activeProject.liveUrl && (
                <button
                  type="button"
                  onClick={() => onPreviewWeb(activeProject)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02]"
                  aria-label={`Preview live website for ${activeProject.title}`}
                >
                  <span>Launch Live Site</span>
                  <span>↗</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Stacking View (< Lg): Pure Aurexa Case Study Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:hidden items-stretch">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full flex"
          >
            <AurexaCaseStudyCard
              project={project}
              onPreviewWeb={onPreviewWeb}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
