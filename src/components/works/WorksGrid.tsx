"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { WorkCard } from "./WorkCard";

export function WorksGrid() {
  const projects = PORTFOLIO_DATA.projects;

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24">
      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Project 1: Biqolpo (AI Video) - Left, col-span-4 */}
        {projects[0] && (
          <div className="col-span-12 md:col-span-4">
            <WorkCard project={projects[0]} />
          </div>
        )}

        {/* Project 2: Syston Autos (Automotive Showcase) - Right, col-span-8 */}
        {projects[1] && (
          <div className="col-span-12 md:col-span-8">
            <WorkCard project={projects[1]} />
          </div>
        )}

        {/* Project 3: Velocity Digital (Web Platform) - Center, col-span-8 offset-2 */}
        {projects[2] && (
          <div className="col-span-12 md:col-span-8 md:col-start-3 md:my-6">
            <WorkCard project={projects[2]} />
          </div>
        )}

        {/* Project 4: B&F Corporate (IT Infrastructure) - Left, col-span-8 */}
        {projects[3] && (
          <div className="col-span-12 md:col-span-8">
            <WorkCard project={projects[3]} />
          </div>
        )}

        {/* Project 5: B&F Cars (Automotive Social) - Right, col-span-4 */}
        {projects[4] && (
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between h-full">
            <WorkCard project={projects[4]} />

            {/* Explore More CTA matching reference */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-4"
            >
              <a
                href="#works"
                className="font-mono-custom text-[15px] sm:text-[16px] text-white hover-underline-link tracking-wide"
              >
                Explore More Works
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
