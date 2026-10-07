"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { WorkCard } from "./WorkCard";

export function WorksGrid() {
  const projects = PORTFOLIO_DATA.projects;

  return (
    <div className="w-full flex flex-col gap-24 sm:gap-32 md:gap-40 pb-20">
      {/* Row 1: Card 1 (Left 352px) + Card 2 (Right 704px) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
        {/* Project 1: Biqolpo (Left, 3-cols / 352px) */}
        {projects[0] && (
          <div className="col-span-12 md:col-span-3">
            <WorkCard project={projects[0]} isLarge={false} />
          </div>
        )}

        {/* Project 2: Syston Autos (Right, 6-cols / 704px) */}
        {projects[1] && (
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <WorkCard project={projects[1]} isLarge={true} />
          </div>
        )}
      </div>

      {/* Row 2: Card 3 (Centered 704px) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
        {/* Project 3: Velocity Digital (Center, 6-cols / 704px) */}
        {projects[2] && (
          <div className="col-span-12 md:col-span-6 md:col-start-4">
            <WorkCard project={projects[2]} isLarge={true} />
          </div>
        )}
      </div>

      {/* Row 3: Card 4 (Left 704px) + Card 5 (Right 352px + Explore More) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
        {/* Project 4: B&F Corporate IT (Left, 6-cols / 704px) */}
        {projects[3] && (
          <div className="col-span-12 md:col-span-6">
            <WorkCard project={projects[3]} isLarge={true} />
          </div>
        )}

        {/* Project 5: B&F Cars (Right, 3-cols / 352px) */}
        {projects[4] && (
          <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-between">
            <WorkCard project={projects[4]} isLarge={false} />

            {/* Explore More CTA matching reference */}
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
    </div>
  );
}
