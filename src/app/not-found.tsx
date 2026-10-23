import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description:
    "The requested page or case study could not be found on Kamrul Islam’s portfolio.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Navigation isRevealed={true} />

      <main className="relative z-10 w-full bg-black min-h-screen text-white pt-32 sm:pt-36 md:pt-44 pb-24 mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-white/80 text-xs font-mono-custom uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>HTTP 404 // ROUTE NOT FOUND</span>
          </div>

          {/* Editorial Headline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-16 md:mb-24">
            <div className="lg:col-span-8">
              <h1 className="font-gambarino text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.95]">
                Lost in the{" "}
                <span className="italic text-white/60">Edit Room.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
                The page, project, or archive link you are looking for may have
                been moved, renamed, or cut from the final timeline.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-white text-black font-sans font-medium text-xs sm:text-sm hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                >
                  <span>← Back to Homepage</span>
                </Link>

                <Link
                  href="/projects"
                  className="px-6 py-3 rounded-full bg-white/8 hover:bg-white/15 text-white font-mono-custom text-xs sm:text-sm border border-white/12 transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore All Works</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>

          <HairlineRule className="mb-12 md:mb-16" />

          {/* Quick Directory Cards */}
          <div>
            <span className="font-mono-custom text-xs uppercase tracking-widest text-[#777] block mb-6">
              Quick Navigation Directory
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  index: "01",
                  title: "Video Post-Production",
                  subtitle: "Commercial edits, color grading & reels",
                  href: "/projects?type=video",
                },
                {
                  index: "02",
                  title: "Web Case Studies",
                  subtitle: "Next.js, React & full-stack web apps",
                  href: "/projects?type=web",
                },
                {
                  index: "03",
                  title: "Curriculum Vitae",
                  subtitle: "Experience, education & technical stack",
                  href: "/cv",
                },
                {
                  index: "04",
                  title: "Start a Project",
                  subtitle: "Direct inquiry & project consultation",
                  href: "/contact-us",
                },
              ].map((item) => (
                <Link
                  key={item.index}
                  href={item.href}
                  className="group p-6 rounded-2xl bg-white/3 hover:bg-white/7 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-custom text-xs text-emerald-400">
                      /{item.index}
                    </span>
                    <span className="font-mono-custom text-sm text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      ↗
                    </span>
                  </div>

                  <div className="mt-8">
                    <h2 className="font-gambarino text-2xl text-white mb-1">
                      {item.title}
                    </h2>
                    <p className="font-mono-custom text-xs text-[#888] leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CurtainFooter />
    </>
  );
}
