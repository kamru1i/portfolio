import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { PORTFOLIO_DATA, ServiceItem } from "@/lib/portfolio-data";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_DATA.services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = PORTFOLIO_DATA.services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found — Kamrul Islam",
    };
  }

  return {
    title: `${service.title} — Kamrul Islam`,
    description: service.description,
    openGraph: {
      title: `${service.title} | Kamrul Islam`,
      description: service.headline,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = PORTFOLIO_DATA.services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Find next service for navigation footer
  const currentIndex = PORTFOLIO_DATA.services.findIndex(
    (s) => s.slug === slug,
  );
  const nextService =
    PORTFOLIO_DATA.services[
      (currentIndex + 1) % PORTFOLIO_DATA.services.length
    ];

  return (
    <>
      {/* Global Fixed Navigation */}
      <Navigation isRevealed={true} />

      {/* Main Detail Canvas */}
      <main className="relative z-10 w-full bg-black min-h-screen text-white pt-32 sm:pt-36 md:pt-40 pb-24 mb-[450px] md:mb-[510px] lg:mb-[634px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-8 sm:mb-12">
            <Link
              href="/#services"
              className="group inline-flex items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>Back to Services</span>
            </Link>
          </div>

          {/* ============================================================ */}
          {/* HERO SECTION: Number Badge, Giant Title, Bullets & Hero Visual */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{`${service.index} // ${service.category}`}</span>
              </div>

              {/* Bullet Highlights (Desktop Header) */}
              <div className="hidden lg:flex items-center gap-6 font-mono-custom text-xs text-[#a1a1a1]">
                {service.bulletHighlights.slice(0, 3).map((hl) => (
                  <span key={hl} className="tracking-wide">
                    {hl}
                  </span>
                ))}
              </div>
            </div>

            {/* Giant Editorial Title */}
            <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] max-w-5xl mb-12 md:mb-16">
              {service.headline}
            </h1>

            {/* Hero Visual Card with Primary Service Image */}
            <div className="relative w-full h-[320px] sm:h-[460px] md:h-[560px] lg:h-[620px] rounded-[16px] sm:rounded-[24px] overflow-hidden border border-white/10 bg-[#111] shadow-[0_30px_70px_rgba(0,0,0,0.85)]">
              <Image
                src={service.image}
                alt={`${service.title} Hero Visual`}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Overlay metadata bar */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono-custom text-xs sm:text-sm text-white/90">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  {service.title}
                </span>
                <span className="hidden sm:inline px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  Kamrul Islam Portfolio
                </span>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 1: Strategic Overview & Introduction */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Left Column: Pill Badge */}
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  INTRODUCTION
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Overview &amp; Core Philosophy
                </h2>
              </div>

              {/* Right Column: Narrative Content */}
              <div className="md:col-span-8 flex flex-col space-y-6">
                <p className="font-sans text-xl sm:text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
                  {service.introduction}
                </p>
                <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: Capabilities Grid (6 Precision Cards) */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="mb-10 md:mb-14">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                CAPABILITIES
              </span>
              <h2 className="font-gambarino text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                Specialized Technical Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.capabilities.map((cap, idx) => (
                <div
                  key={cap.title}
                  className="group p-6 sm:p-8 rounded-[16px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-custom text-xs text-[#777] group-hover:text-emerald-400 transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
                  </div>

                  <div>
                    <h3 className="font-gambarino text-xl sm:text-2xl text-white mb-2 group-hover:text-white transition-colors">
                      {cap.title}
                    </h3>
                    <p className="font-mono-custom text-xs sm:text-sm text-[#a1a1a1] leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: Tools & Technologies Stack */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  TOOLS &amp; TECH
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight">
                  Software, Frameworks &amp; Systems
                </h2>
              </div>

              <div className="md:col-span-8 flex flex-wrap gap-2.5 sm:gap-3">
                {service.tools.map((tool) => (
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
          {/* SECTION 4: Production Workflow / Approach */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="mb-10 md:mb-14">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                APPROACH
              </span>
              <h2 className="font-gambarino text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                Structured Execution Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {service.workflow.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-[14px] bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <span className="font-mono-custom text-xl text-emerald-400 font-bold">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-gambarino text-lg sm:text-xl text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="font-mono-custom text-xs text-[#999] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 5: Professional Experience Context */}
          {/* ============================================================ */}
          <section className="w-full mb-20 md:mb-28">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="mb-10 md:mb-14">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                EXPERIENCE
              </span>
              <h2 className="font-gambarino text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                Documented Professional Track Record
              </h2>
            </div>

            <div className="flex flex-col space-y-6">
              {service.experience.map((exp) => (
                <div
                  key={exp.organization + exp.role}
                  className="p-6 sm:p-8 rounded-[16px] bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div>
                    <h3 className="font-gambarino text-2xl text-white mb-1">
                      {exp.role}
                    </h3>
                    <p className="font-mono-custom text-sm text-emerald-400 mb-2">
                      {exp.organization} · {exp.period}
                    </p>
                    <p className="font-mono-custom text-xs sm:text-sm text-[#aaa] max-w-3xl leading-relaxed">
                      {exp.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 6: Project Showcase / Portfolio Connection */}
          {/* ============================================================ */}
          {service.projects && service.projects.length > 0 && (
            <section className="w-full mb-20 md:mb-28">
              <HairlineRule className="mb-12 md:mb-16" />

              <div className="mb-10 md:mb-14">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider mb-4">
                  PORTFOLIO
                </span>
                <h2 className="font-gambarino text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                  Selected Work &amp; Engagements
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.projects.map((proj) => (
                  <div
                    key={proj.title}
                    className="group rounded-[16px] overflow-hidden bg-white/[0.02] border border-white/10 flex flex-col justify-between"
                  >
                    {proj.image && (
                      <div className="relative w-full h-[220px] bg-zinc-900 overflow-hidden">
                        <Image
                          src={proj.image}
                          alt={proj.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-emerald-400 font-mono-custom text-xs uppercase tracking-wider">
                            {proj.client}
                          </span>
                        </div>
                        <h3 className="font-gambarino text-2xl text-white mb-2">
                          {proj.title}
                        </h3>
                        <p className="font-mono-custom text-xs text-[#a1a1a1] leading-relaxed">
                          {proj.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 font-mono-custom text-xs text-white/70">
                        Role: {proj.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* SECTION 7: Next Service Link + Project Inquiry Callout */}
          {/* ============================================================ */}
          <section className="w-full pt-8">
            <HairlineRule className="mb-12 md:mb-16" />

            <div className="p-8 sm:p-12 md:p-16 rounded-[20px] bg-gradient-to-b from-white/[0.06] to-transparent border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-emerald-400 font-mono-custom text-xs uppercase tracking-widest mb-2 block">
                  EXPLORE NEXT SERVICE
                </span>
                <Link
                  href={nextService.href}
                  className="font-gambarino text-3xl sm:text-4xl text-white hover:text-white/80 transition-colors inline-flex items-center gap-3 group"
                >
                  <span>{nextService.title}</span>
                  <span className="group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </Link>
                <p className="font-mono-custom text-xs sm:text-sm text-[#888] mt-2">
                  {nextService.headline}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href={`/contact-us?service=${encodeURIComponent(service.slug)}`}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Inquire About This Service
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Global Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
