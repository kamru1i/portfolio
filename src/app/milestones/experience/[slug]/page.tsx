import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PORTFOLIO_DATA, MilestoneItem } from "@/lib/portfolio-data";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_DATA.milestones
    .filter((m) => m.type === "experience")
    .map((m) => ({
      slug: m.slug,
    }));
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const milestone = PORTFOLIO_DATA.milestones.find(
    (m) => m.slug === slug && m.type === "experience"
  );

  if (!milestone) {
    return {
      title: "Experience Record Not Found",
    };
  }

  return {
    title: `${milestone.role} at ${milestone.organization}`,
    description: milestone.highlight,
    openGraph: {
      title: `Kamrul Islam — ${milestone.role} at ${milestone.organization}`,
      description: milestone.highlight,
      type: "article",
    },
  };
}

export default async function ExperienceDetailPage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const experienceItems = PORTFOLIO_DATA.milestones.filter(
    (m) => m.type === "experience"
  );
  const milestone = experienceItems.find((m) => m.slug === slug);

  if (!milestone) {
    notFound();
  }

  const currentIndex = experienceItems.findIndex((m) => m.slug === slug);
  const nextItem =
    experienceItems[(currentIndex + 1) % experienceItems.length] || experienceItems[0];
  const d = milestone.details || {};

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
              href="/#recognitions"
              className="group inline-flex items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Milestones &amp; Recognitions</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO SECTION: Category Pill, Giant Title & Meta Badges       */}
          {/* ============================================================ */}
          <section className="w-full mb-16 md:mb-24">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>CAREER ROLE // {milestone.year}</span>
              </div>

              {/* Organization Badge */}
              <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-mono">
                {milestone.organization}
              </div>

              {/* Employment Duration */}
              {milestone.period && (
                <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#aaa] text-xs font-mono">
                  {milestone.period}
                </div>
              )}
            </div>

            {/* Giant Editorial Title */}
            <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mb-6">
              {milestone.role}
            </h1>

            {/* Highlight Summary */}
            <p className="font-mono-custom text-base sm:text-lg text-[#a1a1a1] max-w-3xl leading-relaxed">
              {milestone.highlight}
            </p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: Strategic Role Overview                           */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  OVERVIEW
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Scope &amp; Responsibilities
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-col space-y-6">
                <p className="font-sans text-xl sm:text-2xl text-white/90 font-light leading-relaxed">
                  {d.overview || milestone.highlight}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: Complete Detailed Responsibilities                */}
          {/* ============================================================ */}
          {d.responsibilities && d.responsibilities.length > 0 && (
            <section className="w-full mb-20 md:mb-28">
              <HairlineRule className="mb-12 md:mb-16" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                    DUTIES &amp; SCOPE
                  </span>
                  <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                    Key Technical &amp; Operational Duties
                  </h2>
                  <p className="font-mono-custom text-xs text-[#777] mt-2">
                    Directly sourced from official CV documentation.
                  </p>
                </div>

                <div className="md:col-span-8 flex flex-col space-y-3.5">
                  {d.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-4 hover:border-white/20 transition-colors"
                    >
                      <span className="font-mono-custom text-xs text-emerald-400 font-bold shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="font-mono-custom text-xs sm:text-sm text-[#ccc] leading-relaxed">
                        {resp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 3: Tools, Software & Systems Used                    */}
          {/* ============================================================ */}
          {d.tools && d.tools.length > 0 && (
            <section className="w-full mb-20 md:mb-28">
              <HairlineRule className="mb-12 md:mb-16" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                    TOOLCHAIN
                  </span>
                  <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                    Software, Frameworks &amp; Systems
                  </h2>
                </div>

                <div className="md:col-span-8 flex flex-wrap gap-2.5 sm:gap-3">
                  {d.tools.map((tool) => (
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
          )}

          {/* ============================================================ */}
          {/* SECTION 4: Documented Achievements & Outcomes                */}
          {/* ============================================================ */}
          {d.achievements && d.achievements.length > 0 && (
            <section className="w-full mb-20 md:mb-28">
              <HairlineRule className="mb-12 md:mb-16" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                    ACHIEVEMENTS
                  </span>
                  <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                    Documented Contributions
                  </h2>
                </div>

                <div className="md:col-span-8 flex flex-col space-y-4">
                  {d.achievements.map((ach) => (
                    <div
                      key={ach}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3"
                    >
                      <span className="text-emerald-400 mt-0.5">✦</span>
                      <p className="font-mono-custom text-xs sm:text-sm text-[#aaa] leading-relaxed">
                        {ach}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* FOOTER NAVIGATION: Next Career Milestone                     */}
          {/* ============================================================ */}
          {nextItem && (
            <section className="w-full pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                    Next Experience
                  </span>
                  <Link
                    href={`/milestones/experience/${nextItem.slug}`}
                    className="group inline-flex items-center gap-3 font-gambarino text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{nextItem.role} · {nextItem.organization}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>

                <Link
                  href="/#recognitions"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono-custom text-xs uppercase tracking-wider transition-all self-start sm:self-center"
                >
                  All Milestones
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
