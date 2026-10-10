import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";
import { getProjectBySlugOrId, getPublishedProjects } from "@/lib/projects-service";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

interface WebProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects
    .filter((p) => p.type === "web")
    .map((p) => ({
      slug: p.slug || p.id,
    }));
}

export async function generateMetadata({
  params,
}: WebProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project || project.type !== "web") {
    return {
      title: "Web Project Not Found",
    };
  }

  return {
    title: `${project.title} (Web)`,
    description: project.description,
    openGraph: {
      title: `Kamrul Islam — ${project.title} (Web)`,
      description: project.description,
      type: "website",
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  };
}

export default async function WebProjectDetailPage({ params }: WebProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project || project.type !== "web") {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  const webProjects = allProjects.filter((p) => p.type === "web");
  const currentIndex = webProjects.findIndex(
    (p) => (p.slug || p.id) === (project.slug || project.id)
  );
  const nextProject =
    webProjects[(currentIndex + 1) % webProjects.length] || webProjects[0];

  const isEmbeddable =
    (project.previewMode ? project.previewMode === "iframe" : project.canEmbed !== false) &&
    Boolean(project.liveUrl);

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
              href="/projects?type=web"
              className="group inline-flex items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Web Projects</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO SECTION: Category Pill, Giant Title & Direct Actions    */}
          {/* ============================================================ */}
          <section className="w-full mb-14 md:mb-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>WEB ARCHITECTURE // APPLICATION</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#aaa] text-xs font-mono uppercase tracking-wider">
                {project.client || "Client Project"}
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#777] text-xs font-mono">
                @{project.year || "2026"}
              </div>
            </div>

            {/* Giant Editorial Title */}
            <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mb-6">
              {project.title}
            </h1>

            {/* Subtitle / Category */}
            <p className="font-mono-custom text-base sm:text-lg text-[#a1a1a1] max-w-3xl leading-relaxed mb-8">
              {project.category || "Full-Stack Web Development & Modern UI Architecture"}
            </p>

            {/* Primary Action Links: Live Site & GitHub */}
            <div className="flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs sm:text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Open Live Site</span>
                  <span>↗</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 font-mono-custom text-xs sm:text-sm border border-white/10 transition-colors flex items-center gap-2"
                >
                  <span>GitHub Repository</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* MEDIA SECTION: Interactive Iframe Viewport or Shielded Canvas */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <div className="w-full h-[540px] sm:h-[620px] md:h-[700px] rounded-2xl overflow-hidden border border-white/15 bg-[#0e0e0e] shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col">
              {/* Header preview bar */}
              <div className="px-4 py-2.5 bg-[#181818] border-b border-white/10 flex items-center justify-between text-xs font-mono-custom text-[#888]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-white/70 hidden sm:inline">{project.liveUrl || "Deployment View"}</span>
                </div>
                <span className="text-[11px] text-emerald-400">
                  {isEmbeddable ? "Interactive Live View" : "Security Shielded View"}
                </span>
              </div>

              {/* Viewport Content */}
              <div className="relative flex-1 w-full h-full bg-[#111] overflow-hidden">
                {isEmbeddable && project.liveUrl ? (
                  <iframe
                    src={project.liveUrl}
                    title={`${project.title} live preview`}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0a0b10]">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-3xl mb-4">
                      🌐
                    </div>
                    <h3 className="font-gambarino text-2xl text-white mb-2">
                      External Web Application
                    </h3>
                    <p className="font-mono-custom text-xs sm:text-sm text-[#888] max-w-md mx-auto mb-6 leading-relaxed">
                      This production web application is hosted with strict cross-origin security headers or external domain authentication.
                    </p>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2"
                      >
                        <span>Launch Live Website</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: Strategic Architecture & Overview                 */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  OVERVIEW
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Application Architecture
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
          {/* SECTION 2: Technical Responsibilities & Scope                */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  RESPONSIBILITIES
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Engineering Scope of Work
                </h2>
                <p className="font-mono-custom text-xs text-emerald-400 mt-2">
                  Role: {project.role || "Front-End Developer & UI Engineer"}
                </p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Architecting modular, reusable component hierarchies with React.js & modern styling.",
                  "Converting Figma prototypes into pixel-perfect responsive desktop, tablet, and mobile layouts.",
                  "Integrating RESTful endpoints, API error handling, and asynchronous data state.",
                  "Building accessible interactive forms, validation systems, and intuitive client routing.",
                  "Optimizing cross-browser rendering, asset loading, performance scores, and SEO metadata.",
                  "Version control branching, pull request reviews, and production deployment pipelines.",
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
          {/* SECTION 3: Technologies & Framework Stack                    */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  TECHNOLOGIES
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Frameworks &amp; Toolchain
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-wrap gap-2.5 sm:gap-3">
                {(project.tools && project.tools.length > 0
                  ? project.tools
                  : ["React.js", "TypeScript", "Tailwind CSS", "REST API", "Git / GitHub", "Vercel"]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs sm:text-sm font-mono-custom tracking-wide transition-colors"
                  >
                    {tech}
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
                  Engineered Features
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(project.deliverables && project.deliverables.length > 0
                    ? project.deliverables
                    : ["Production Web Application", "Responsive Breakpoint Testing", "Component Design System"]
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
          {/* FOOTER NAVIGATION: Next Web Project                          */}
          {/* ============================================================ */}
          {nextProject && (
            <section className="w-full pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                    Next Project
                  </span>
                  <Link
                    href={`/projects/web/${nextProject.slug || nextProject.id}`}
                    className="group inline-flex items-center gap-3 font-gambarino text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{nextProject.title}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>

                <Link
                  href="/projects?type=web"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono-custom text-xs uppercase tracking-wider transition-all self-start sm:self-center"
                >
                  All Web Projects
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
