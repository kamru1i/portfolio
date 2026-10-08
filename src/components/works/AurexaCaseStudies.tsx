"use client";

import { motion } from "framer-motion";
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
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full select-none pb-20">
      {/* Aurexa Case Studies Dual-Column Layout matching Image 1 (media_1791492048973_f5e1e745.png) */}
      <div className="w-full flex flex-col lg:flex-row gap-10 xl:gap-16 items-start justify-between">
        {/* LEFT COLUMN: 2-Column Scrolling Grid of Aurexa Project Cards */}
        <div className="w-full lg:w-[60%] xl:w-[62%] grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                delay: (index % 2) * 0.1,
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

        {/* RIGHT COLUMN: Sticky Header & Narrative Block matching Image 1 */}
        <div className="w-full lg:w-[38%] xl:w-[35%] lg:sticky lg:top-28 xl:top-32 self-start flex flex-col order-first lg:order-last mb-8 lg:mb-0">
          {/* PROJECTS Pill Badge */}
          <div className="inline-flex items-center self-start px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-neutral-300 font-mono-custom text-xs uppercase tracking-wider mb-5 sm:mb-6">
            PROJECTS
          </div>

          {/* Headline matching Aurexa: "Case studies" */}
          <h2 className="font-sans text-4xl sm:text-5xl xl:text-6xl font-medium tracking-tight text-white leading-[1.08] mb-4 sm:mb-5">
            Case studies
          </h2>

          {/* Subtitle Description matching Aurexa reference */}
          <p className="font-sans text-[15px] sm:text-base text-[#a1a1a1] leading-relaxed max-w-md mb-8">
            A collection of strategic design projects crafted to help modern brands grow, scale, and stand out digitally.
          </p>

          {/* CTA Action Button */}
          <button
            type="button"
            onClick={() => {
              const first = projects[0];
              if (first) onPreviewWeb(first);
            }}
            className="inline-flex items-center gap-3 self-start px-5 py-2.5 rounded-full bg-[#1c1c1c] hover:bg-[#282828] border border-white/10 text-white font-sans text-sm transition-all group cursor-pointer shadow-md hover:border-white/20"
          >
            <span>View all case studies</span>
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>

          {/* Stats Counters Block matching Aurexa Reference */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-6 max-w-sm">
            <div>
              <span className="font-sans text-xs text-[#888] uppercase tracking-wider block mb-2">
                Projects
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-normal text-white">
                60+
              </span>
            </div>
            <div>
              <span className="font-sans text-xs text-[#888] uppercase tracking-wider block mb-2">
                Awards & features
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-normal text-white">
                28+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
