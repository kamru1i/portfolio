import Link from "next/link";
import { Metadata } from "next";
import { PORTFOLIO_DATA, MilestoneItem } from "@/lib/portfolio-data";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

export const metadata: Metadata = {
  title: "Academic & Educational Qualifications — Kamrul Islam",
  description:
    "Comprehensive academic records, degrees, and educational qualifications of Kamrul Islam, including BSc in Computer Science & Engineering, Higher Secondary Certificate (HSC), and Secondary School Certificate (SSC).",
  openGraph: {
    title: "Academic Qualifications — Kamrul Islam",
    description:
      "Comprehensive academic background, curriculum coursework, and certified degrees of Kamrul Islam.",
    type: "article",
  },
};

export default function EducationQualificationsPage() {
  // Retrieve all education qualifications dynamically from data source
  // Ordered chronologically (latest first) to maintain structured hierarchy
  const educationItems: MilestoneItem[] = (PORTFOLIO_DATA.milestones || []).filter(
    (m) => m.type === "education"
  );

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
              <span>Back to Recognitions &amp; Milestones</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO HEADER: Dossier Title, Meta Badges & Overview           */}
          {/* ============================================================ */}
          <header className="w-full mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ACADEMIC DOSSIER // QUALIFICATIONS</span>
              </div>

              {/* Total Records Badge */}
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#aaa] text-xs font-mono uppercase tracking-wider">
                {educationItems.length} Certified Records
              </div>

              {/* Location Badge */}
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#777] text-xs font-mono">
                Chittagong, Bangladesh
              </div>
            </div>

            {/* Giant Editorial Headline */}
            <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mb-6">
              Education &amp; Academic Qualifications
            </h1>

            {/* Subtitle Statement */}
            <p className="font-mono-custom text-base sm:text-lg text-[#a1a1a1] max-w-3xl leading-relaxed">
              Official academic history, certified qualifications, curriculum coursework, and disciplinary grounding in computer science, natural sciences, and web engineering.
            </p>
          </header>

          {/* ============================================================ */}
          {/* IN-PAGE QUICK JUMP NAVIGATION BAR (STICKY)                  */}
          {/* ============================================================ */}
          <nav
            aria-label="Education sections quick jump"
            className="sticky top-20 sm:top-24 z-20 w-full py-3 px-4 sm:px-6 mb-16 md:mb-20 rounded-2xl bg-[#0e0e0e]/90 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-between gap-4 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider hidden sm:inline">
                Jump to:
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {educationItems.map((item) => {
                const navLabel =
                  item.slug === "bsc-cse"
                    ? "BSc in CSE"
                    : item.slug === "hsc"
                    ? "HSC (Science)"
                    : item.slug === "ssc"
                    ? "SSC (Science)"
                    : item.role;

                return (
                  <a
                    key={item.slug}
                    href={`#${item.slug}`}
                    className="px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white text-white/70 hover:text-black font-mono-custom text-xs uppercase tracking-wider border border-white/10 hover:border-white transition-all flex items-center gap-1.5"
                  >
                    <span>{navLabel}</span>
                    <span className="text-[#555] group-hover:text-black/60 font-mono text-[10px]">
                      @{item.year}
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ============================================================ */}
          {/* DATA-DRIVEN QUALIFICATION SECTIONS                           */}
          {/* ============================================================ */}
          <div className="w-full flex flex-col space-y-24 md:space-y-32">
            {educationItems.map((item, index) => {
              const d = item.details || {};
              const sectionId = item.slug;
              const institution = d.institution || item.organization;
              const authority = d.board || d.authority || "Academic Authority";
              const groupOrMajor = d.major || d.group || d.subject || "General";
              const passingYear = d.passingYear || item.year;
              const resultGrade = d.gpa || d.result || d.grade;

              return (
                <article
                  key={sectionId}
                  id={sectionId}
                  className="w-full scroll-mt-28 md:scroll-mt-36 transition-colors"
                >
                  <HairlineRule className="mb-12 md:mb-16" />

                  {/* Section Editorial Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start mb-12">
                    {/* Left Meta & Index Column */}
                    <div className="lg:col-span-4 flex flex-col space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-custom text-xs px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/90 uppercase tracking-wider">
                          INDEX 0{index + 1}
                        </span>
                        <span className="font-mono-custom text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                          YEAR {passingYear}
                        </span>
                      </div>

                      <h2 className="font-gambarino text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                        {item.role}
                      </h2>

                      <p className="font-mono-custom text-sm text-emerald-400 font-medium">
                        {institution}
                      </p>
                    </div>

                    {/* Right Narrative & Parameter Box */}
                    <div className="lg:col-span-8 flex flex-col space-y-8">
                      {/* Qualification Narrative Overview */}
                      {d.overview && (
                        <p className="font-sans text-lg sm:text-xl text-white/90 font-light leading-relaxed">
                          {d.overview}
                        </p>
                      )}

                      {/* Structured Parameters Specification Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Parameter 1: Institution */}
                        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col">
                          <span className="font-mono-custom text-[11px] text-[#777] uppercase tracking-wider mb-1">
                            Institution
                          </span>
                          <span className="font-sans text-sm sm:text-base text-white font-medium">
                            {institution}
                          </span>
                        </div>

                        {/* Parameter 2: Board / Authority / University */}
                        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col">
                          <span className="font-mono-custom text-[11px] text-[#777] uppercase tracking-wider mb-1">
                            Board / Authority
                          </span>
                          <span className="font-sans text-sm sm:text-base text-white font-medium">
                            {authority}
                          </span>
                        </div>

                        {/* Parameter 3: Academic Group / Major */}
                        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col">
                          <span className="font-mono-custom text-[11px] text-[#777] uppercase tracking-wider mb-1">
                            Group / Major
                          </span>
                          <span className="font-sans text-sm sm:text-base text-emerald-400 font-medium">
                            {groupOrMajor}
                          </span>
                        </div>

                        {/* Parameter 4: Passing Year */}
                        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col">
                          <span className="font-mono-custom text-[11px] text-[#777] uppercase tracking-wider mb-1">
                            Passing Year
                          </span>
                          <span className="font-sans text-sm sm:text-base text-white font-medium">
                            {passingYear}
                          </span>
                        </div>

                        {/* Parameter 5: Result / GPA (rendered when documented) */}
                        {resultGrade && (
                          <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-emerald-500/20 sm:col-span-2 flex flex-col">
                            <span className="font-mono-custom text-[11px] text-emerald-400 uppercase tracking-wider mb-1">
                              Result / Academic Performance
                            </span>
                            <span className="font-sans text-base sm:text-lg text-white font-medium">
                              {resultGrade}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coursework & Verified Academic Achievements Block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start pt-6 border-t border-white/10">
                    {/* Coursework / Syllabus Focus */}
                    <div className="lg:col-span-6">
                      <span className="font-mono-custom text-xs text-[#888] uppercase tracking-wider block mb-4">
                        Curriculum Focus &amp; Core Coursework
                      </span>
                      {d.coursework && d.coursework.length > 0 ? (
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                          {d.coursework.map((course) => (
                            <span
                              key={course}
                              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/90 font-mono-custom text-xs tracking-wide"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="font-mono-custom text-xs text-[#666]">
                          Standard comprehensive syllabus under {authority}.
                        </p>
                      )}
                    </div>

                    {/* Verified Academic Achievements */}
                    <div className="lg:col-span-6">
                      <span className="font-mono-custom text-xs text-[#888] uppercase tracking-wider block mb-4">
                        Verified Milestones &amp; Academic Honors
                      </span>
                      {d.achievements && d.achievements.length > 0 ? (
                        <div className="flex flex-col space-y-3">
                          {d.achievements.map((ach, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3"
                            >
                              <span className="font-mono-custom text-xs text-emerald-400 font-bold shrink-0 mt-0.5">
                                ✓
                              </span>
                              <p className="font-mono-custom text-xs sm:text-sm text-[#aaa] leading-relaxed">
                                {ach}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-mono-custom text-xs text-[#666]">
                          Official academic completion verified against institution records.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* FOOTER NAVIGATION & EXPLORE ACTIONS                         */}
          {/* ============================================================ */}
          <footer className="w-full mt-24 md:mt-32 pt-12 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="font-mono-custom text-xs text-[#777] uppercase tracking-wider block mb-1">
                  Professional Timeline
                </span>
                <Link
                  href="/#recognitions"
                  className="group inline-flex items-center gap-3 font-gambarino text-2xl sm:text-3xl text-white hover:text-emerald-400 transition-colors"
                >
                  <span>Explore Career Experience &amp; Positions</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/#projects"
                  className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono-custom text-xs uppercase tracking-wider transition-all"
                >
                  Projects &amp; Works
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Fixed Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
