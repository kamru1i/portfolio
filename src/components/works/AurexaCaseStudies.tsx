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
      {/* Pure Aurexa Case Study Cards Grid Setup (No extra headers, no extra buttons, no countdowns) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.6,
              delay: (index % 2) * 0.12,
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
