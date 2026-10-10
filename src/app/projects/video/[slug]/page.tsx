import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";
import { getProjectBySlugOrId, getPublishedProjects } from "@/lib/projects-service";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";
import { getAspectRatioMultiplier } from "@/components/works/modal-tokens";

interface VideoProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects
    .filter((p) => p.type === "video")
    .map((p) => ({
      slug: p.slug || p.id,
    }));
}

export async function generateMetadata({
  params,
}: VideoProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project || project.type !== "video") {
    return {
      title: "Video Project Not Found — Kamrul Islam",
    };
  }

  return {
    title: `${project.title} — Video Post-Production | Kamrul Islam`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Kamrul Islam`,
      description: project.description,
      type: "video.other",
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

function resolveEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0`;
  }
  return null;
}

export default async function VideoProjectDetailPage({ params }: VideoProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project || project.type !== "video") {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  const videoProjects = allProjects.filter((p) => p.type === "video");
  const currentIndex = videoProjects.findIndex(
    (p) => (p.slug || p.id) === (project.slug || project.id)
  );
  const nextProject =
    videoProjects[(currentIndex + 1) % videoProjects.length] || videoProjects[0];

  const embedUrl = resolveEmbedUrl(project.videoUrl);
  const isDirectVideo =
    project.videoUrl &&
    (project.videoUrl.endsWith(".mp4") ||
      project.videoUrl.endsWith(".webm") ||
      project.videoType === "local");
  const format = project.format || "16:9";
  const isPortrait = format === "9:16";

  return (
    <>
      {/* Global Fixed Navigation */}
      <Navigation isRevealed={true} />

      {/* Main Detail Canvas */}
      <main className="relative z-10 w-full bg-black min-h-screen text-white pt-32 sm:pt-36 md:pt-40 pb-24 mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8 sm:mb-12">
            <Link
              href="/projects?type=video"
              className="group inline-flex items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Video Projects</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO SECTION: Category Pill, Giant Title & Meta Badges       */}
          {/* ============================================================ */}
          <section className="w-full mb-14 md:mb-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>VIDEO POST-PRODUCTION // {format}</span>
              </div>

              {/* Client Attribution Badge */}
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#aaa] text-xs font-mono uppercase tracking-wider">
                {project.client || "Personal Project"}
              </div>

              {/* Year */}
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#777] text-xs font-mono">
                @{project.year || "2026"}
              </div>
            </div>

            {/* Giant Editorial Title */}
            <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mb-6">
              {project.title}
            </h1>

            {/* Summary / Category Subtitle */}
            <p className="font-mono-custom text-base sm:text-lg text-[#a1a1a1] max-w-3xl leading-relaxed">
              {project.category || "Commercial Video Editing & Post-Production"}
            </p>
          </section>

          {/* ============================================================ */}
          {/* MEDIA SECTION: Aspect-Ratio Responsive Video Player Viewport */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden border border-white/15 bg-[#0a0a0a] shadow-[0_30px_70px_rgba(0,0,0,0.85)] ${
                isPortrait
                  ? "w-full max-w-[420px] aspect-[9/16]"
                  : "w-full max-w-5xl aspect-video"
              }`}
            >
              {embedUrl ? (
                /* YouTube / Vimeo Embedded Player */
                <iframe
                  src={embedUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full block border-0"
                />
              ) : isDirectVideo && project.videoUrl ? (
                /* Direct HTML5 Video Player */
                <video
                  src={project.videoUrl}
                  poster={project.thumbnail}
                  controls
                  playsInline
                  className="w-full h-full block object-contain"
                />
              ) : project.videoUrl ? (
                /* External Video Link Stage (TikTok / Facebook / Drive) */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover opacity-30 blur-sm"
                  />
                  <div className="relative z-10 max-w-md p-6 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-2xl mb-3">
                      🎬
                    </div>
                    <h3 className="font-gambarino text-xl text-white mb-2">
                      External Platform Video
                    </h3>
                    <p className="font-mono-custom text-xs text-[#aaa] leading-relaxed mb-5">
                      This production is hosted on an external social network platform. Open directly to stream in original fidelity.
                    </p>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span>Watch Original Video</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Static Image Showcase */
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: Strategic Overview & Narrative Context            */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  OVERVIEW
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Project Narrative &amp; Objective
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col space-y-6">
                <p className="font-sans text-xl sm:text-2xl text-white/90 font-light leading-relaxed">
                  {project.description}
                </p>
                {project.overview && (
                  <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
                    {project.overview}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: Role & Post-Production Responsibilities           */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  RESPONSIBILITIES
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Creative &amp; Technical Execution
                </h2>
                <p className="font-mono-custom text-xs text-emerald-400 mt-2">
                  Role: {project.role || "Video Editor & Post-Production Specialist"}
                </p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Raw footage ingestion, hero take selection, and narrative scene assembly.",
                  "Pacing, rhythm, beat-matching, and narrative continuity timing.",
                  "Audio noise reduction, dialogue enhancement, and multi-track sound mixing.",
                  "Color grading, chromatic balance, shot exposure matching, and visual mood.",
                  "Motion graphics integration, animated title cards, lower thirds, and kinetic typography.",
                  "Aspect-ratio formatting, multi-platform optimization, and delivery mastering.",
                ].map((duty, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3"
                  >
                    <span className="font-mono-custom text-xs text-emerald-400 font-bold shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="font-mono-custom text-xs sm:text-sm text-[#aaa] leading-relaxed">
                      {duty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: Tools & Production Stack                          */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  TOOLS &amp; TECH
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Software &amp; Toolchain
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-wrap gap-2.5 sm:gap-3">
                {(project.tools && project.tools.length > 0
                  ? project.tools
                  : ["Adobe Premiere Pro", "DaVinci Resolve", "CapCut", "After Effects", "Adobe Podcast"]
                ).map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs sm:text-sm font-mono-custom tracking-wide transition-colors"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4: Deliverables & Tags                               */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  DELIVERABLES
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Production Assets
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(project.deliverables && project.deliverables.length > 0
                    ? project.deliverables
                    : [`${format} Master Render`, "Audio Mix Master", "Platform Optimized Cuts"]
                  ).map((deliv) => (
                    <span
                      key={deliv}
                      className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 font-mono-custom text-xs text-white/90"
                    >
                      ✓ {deliv}
                    </span>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-2">
                  {(project.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-custom text-[11px] text-[#777] bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* FOOTER NAVIGATION: Next Video Project                        */}
          {/* ============================================================ */}
          {nextProject && (
            <section className="w-full pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                    Next Project
                  </span>
                  <Link
                    href={`/projects/video/${nextProject.slug || nextProject.id}`}
                    className="group inline-flex items-center gap-3 font-gambarino text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{nextProject.title}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>

                <Link
                  href="/projects?type=video"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono-custom text-xs uppercase tracking-wider transition-all self-start sm:self-center"
                >
                  All Video Projects
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Fixed Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
