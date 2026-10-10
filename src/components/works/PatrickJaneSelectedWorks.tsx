import Link from "next/link";
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

  // Strict display limit of 5 projects for the Patrick Jane selected works overview
  const displayedProjects = projects.slice(0, 5);

  return (
    <div className="w-full flex flex-col gap-24 sm:gap-32 md:gap-40 pb-16 select-none">
      {/* Row 1: Card 1 (Left 352px / 3-cols) + Card 2 (Right 704px / 6-cols col-start-7) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
        {displayedProjects[0] && (
          <div className="col-span-12 md:col-span-3">
            <WorkCard
              project={displayedProjects[0]}
              isLarge={false}
              onPlayVideo={onPlayVideo}
            />
          </div>
        )}

        {displayedProjects[1] && (
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <WorkCard
              project={displayedProjects[1]}
              isLarge={true}
              onPlayVideo={onPlayVideo}
            />
          </div>
        )}
      </div>

      {/* Row 2: Card 3 (Centered 704px / 6-cols col-start-4) */}
      {displayedProjects[2] && (
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
          <div className="col-span-12 md:col-span-6 md:col-start-4">
            <WorkCard
              project={displayedProjects[2]}
              isLarge={true}
              onPlayVideo={onPlayVideo}
            />
          </div>
        </div>
      )}

      {/* Row 3: Card 4 (Left 704px / 6-cols) + Card 5 (Right 352px / 3-cols col-start-10) with Explore More */}
      {(displayedProjects[3] || displayedProjects[4]) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
          {displayedProjects[3] && (
            <div className="col-span-12 md:col-span-6">
              <WorkCard
                project={displayedProjects[3]}
                isLarge={true}
                onPlayVideo={onPlayVideo}
              />
            </div>
          )}

          {displayedProjects[4] && (
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-between">
              <WorkCard
                project={displayedProjects[4]}
                isLarge={false}
                onPlayVideo={onPlayVideo}
              />

              {/* Dedicated Explore More Action for Video Projects */}
              <div className="mt-14 sm:mt-20 pt-1">
                <Link
                  href="/projects?type=video"
                  className="group inline-flex items-center gap-2 font-mono-custom text-[15px] sm:text-[16px] text-white hover:text-white/80 hover-underline-link tracking-normal transition-colors"
                  aria-label="Explore more video projects"
                >
                  <span>Explore More</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback Explore More button if fewer than 5 projects are present */}
      {!displayedProjects[4] && (
        <div className="w-full flex items-center justify-center pt-8">
          <Link
            href="/projects?type=video"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono-custom text-xs uppercase tracking-wider transition-colors"
          >
            <span>Explore More Video Projects</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
