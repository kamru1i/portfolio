"use client";

import { PortfolioProject } from "@/lib/portfolio-data";
import { WorkCard } from "./WorkCard";

interface PatrickJaneSelectedWorksProps {
  projects: PortfolioProject[];
  onPlayVideo: (project: PortfolioProject) => void;
}

export function PatrickJaneSelectedWorks({
  projects,
  onPlayVideo,
}: PatrickJaneSelectedWorksProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-24 sm:gap-32 md:gap-40 pb-16 select-none">
      {/* Row 1: Card 1 (Left 352px / 3-cols) + Card 2 (Right 704px / 6-cols col-start-7) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
        {projects[0] && (
          <div className="col-span-12 md:col-span-3">
            <WorkCard
              project={projects[0]}
              isLarge={false}
              onPlayVideo={onPlayVideo}
            />
          </div>
        )}

        {projects[1] && (
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <WorkCard
              project={projects[1]}
              isLarge={true}
              onPlayVideo={onPlayVideo}
            />
          </div>
        )}
      </div>

      {/* Row 2: Card 3 (Centered 704px / 6-cols col-start-4) */}
      {projects[2] && (
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
          <div className="col-span-12 md:col-span-6 md:col-start-4">
            <WorkCard
              project={projects[2]}
              isLarge={true}
              onPlayVideo={onPlayVideo}
            />
          </div>
        </div>
      )}

      {/* Row 3: Card 4 (Left 704px / 6-cols) + Card 5 (Right 352px / 3-cols col-start-10) with Explore More */}
      {(projects[3] || projects[4]) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
          {projects[3] && (
            <div className="col-span-12 md:col-span-6">
              <WorkCard
                project={projects[3]}
                isLarge={true}
                onPlayVideo={onPlayVideo}
              />
            </div>
          )}

          {projects[4] && (
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-between">
              <WorkCard
                project={projects[4]}
                isLarge={false}
                onPlayVideo={onPlayVideo}
              />

              {/* Explore More link matching Patrick Jane reference */}
              <div className="mt-12 sm:mt-16 pt-2">
                <a
                  href="#works"
                  className="font-gambarino text-[18px] sm:text-[20px] text-white hover-underline-link tracking-wide"
                >
                  Explore More
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
