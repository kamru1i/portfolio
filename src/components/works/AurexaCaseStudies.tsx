"use client";

import Link from "next/link";
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

  // Strict display limit of 8 projects for the Aurexa case studies overview
  const displayedProjects = projects.slice(0, 8);

  return (
    <div className="w-full select-none pb-20">
      {/* Pure Aurexa Case Study Cards Grid Setup (4 cards per row on desktop) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-5 lg:gap-6 items-stretch">
        {displayedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: (index % 4) * 0.08,
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

      {/* Dedicated Explore More Action for Web Projects */}
      <div className="w-full mt-12 sm:mt-16 flex items-center justify-center">
        <Link
          href="/projects?type=web"
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-mono-custom text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-sm"
          aria-label="Explore more web development projects"
        >
          <span>Explore More Web Projects</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
