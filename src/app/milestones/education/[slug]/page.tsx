import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PORTFOLIO_DATA, MilestoneItem } from "@/lib/portfolio-data";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

interface EducationPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_DATA.milestones
    .filter((m) => m.type === "education")
    .map((m) => ({
      slug: m.slug,
    }));
}

export async function generateMetadata({
  params,
}: EducationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const milestone = PORTFOLIO_DATA.milestones.find(
    (m) => m.slug === slug && m.type === "education"
  );

  if (!milestone) {
    return {
      title: "Education Record Not Found — Kamrul Islam",
    };
  }

  return {
    title: `${milestone.role} — Academic Qualification | Kamrul Islam`,
    description: milestone.highlight,
    openGraph: {
      title: `${milestone.role} | Kamrul Islam`,
      description: milestone.highlight,
      type: "article",
    },
  };
}

export default async function EducationDetailPage({ params }: EducationPageProps) {
  const { slug } = await params;
  const educationItems = PORTFOLIO_DATA.milestones.filter(
    (m) => m.type === "education"
  );
  const milestone = educationItems.find((m) => m.slug === slug);

  if (!milestone) {
    notFound();
  }

  const currentIndex = educationItems.findIndex((m) => m.slug === slug);
  const nextItem =
    educationItems[(currentIndex + 1) % educationItems.length] || educationItems[0];
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
                <span>ACADEMIC QUALIFICATION // {milestone.year}</span>
              </div>

              {/* Institution Badge */}
              <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-xs font-mono">
                {d.institution || milestone.organization}
              </div>

              {/* Passing Year / Period */}
              {milestone.period && (
                <div className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#777] text-xs font-mono">
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
          {/* STATS & METRICS STRIP: Academic Parameters Grid              */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div>
                <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                  Institution
                </span>
                <span className="font-sans font-medium text-sm sm:text-base text-white">
                  {d.institution || milestone.organization}
                </span>
              </div>

              <div>
                <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                  {d.board ? "Education Board" : d.department ? "Department" : "Authority"}
                </span>
                <span className="font-sans font-medium text-sm sm:text-base text-white">
                  {d.board || d.department || "Natural Science"}
                </span>
              </div>

              <div>
                <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                  {d.group ? "Group / Stream" : d.major ? "Academic Major" : "Subject"}
                </span>
                <span className="font-sans font-medium text-sm sm:text-base text-white">
                  {d.group || d.major || d.subject || "Science"}
                </span>
              </div>

              <div>
                <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                  {d.gpa ? "Result / GPA" : "Passing Year"}
                </span>
                <span className="font-sans font-medium text-sm sm:text-base text-emerald-400">
                  {d.gpa ? d.gpa : d.passingYear || milestone.year}
                </span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: Academic Overview & Background                    */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  OVERVIEW
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Academic Focus &amp; Context
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
          {/* SECTION 2: Coursework & Academic Foundations                 */}
          {/* ============================================================ */}
          {d.coursework && d.coursework.length > 0 && (
            <section className="w-full mb-20 md:mb-28">
              <HairlineRule className="mb-12 md:mb-16" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-4">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                    COURSEWORK
                  </span>
                  <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                    Key Subjects &amp; Disciplines
                  </h2>
                </div>

                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {d.coursework.map((subject, idx) => (
                    <div
                      key={subject}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3"
                    >
                      <span className="font-mono-custom text-xs text-emerald-400 font-bold shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="font-mono-custom text-xs sm:text-sm text-white/90">
                        {subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 3: Key Academic Outcomes & Achievements              */}
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
                    Documented Recognition
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
          {/* FOOTER NAVIGATION: Next Education Record                     */}
          {/* ============================================================ */}
          {nextItem && (
            <section className="w-full pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                    Next Qualification
                  </span>
                  <Link
                    href={`/milestones/education/${nextItem.slug}`}
                    className="group inline-flex items-center gap-3 font-gambarino text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{nextItem.role}</span>
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
