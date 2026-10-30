import Link from "next/link";
import { Metadata } from "next";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { getPublishedCvDocument } from "@/lib/cv-service";
import { serializeJsonLd } from "@/lib/url-utils";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { HairlineRule } from "@/components/common/HairlineRule";
import { CvPdfViewer } from "@/components/cv/CvPdfViewer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curriculum Vitae (CV) — Video Editor, AI Content Creator, Web Developer & IT Professional",
  description:
    "Official Curriculum Vitae of Kamrul Islam (Kamrul I) — Creative-tech professional specializing in Video Editing & Post-Production, AI-Assisted Content Creation, Web Development, and IT Support & Digital Infrastructure.",
  alternates: {
    canonical: "https://kamrulislam.me/cv",
  },
  openGraph: {
    siteName: "Kamrul Islam",
    title: "Curriculum Vitae — Kamrul Islam (Kamrul I)",
    description:
      "View or download the official Curriculum Vitae of Kamrul Islam across Video Editing, AI-Assisted Content Creation, Web Development, and IT Support.",
    url: "https://kamrulislam.me/cv",
    type: "profile",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Curriculum Vitae",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curriculum Vitae — Kamrul Islam (Kamrul I)",
    description:
      "Official CV of Kamrul Islam — Video Editing & Post-Production, AI-Assisted Content Creation, Web Development, and IT Infrastructure.",
    images: ["/opengraph-image.jpg"],
  },
};

const CORE_PILLARS = [
  {
    index: "01",
    title: "Video Editing & Post-Production",
    serviceSlug: "video-editing",
    summary:
      "End-to-end video editing, storytelling, pacing, noise reduction and audio enhancement, color correction and grading, motion graphics, compositing, and multi-platform social optimization.",
    skills: [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "DaVinci Resolve",
      "CapCut & Final Cut Pro",
      "Adobe Podcast & Audacity",
      "Color Grading & Motion Graphics",
    ],
  },
  {
    index: "02",
    title: "AI-Assisted Content Creation",
    serviceSlug: "ai-assisted-content",
    summary:
      "Concept development, script writing, scene planning, prompt-based video/image/voiceover generation, and hybrid NLE timeline refinement for continuity and visual quality.",
    skills: [
      "Gemini Omni Flash & Google Veo",
      "ChatGPT Sora & Kling 3.0",
      "Google Nano Banana & ChatGPT Image 2",
      "Higgsfield Soul & Kling 3",
      "Script Writing & Scene Planning",
      "Adobe Photoshop & Illustrator",
    ],
  },
  {
    index: "03",
    title: "Web Development & WordPress",
    serviceSlug: "web-development",
    summary:
      "Responsive MERN and Next.js web applications, modular UI component systems, REST API & Supabase integration, Rust/Tauri v2 apps, and WordPress + Elementor Pro customization.",
    skills: [
      "React.js, Next.js & TypeScript",
      "HTML5, CSS3 & Tailwind CSS",
      "DaisyUI, Shadcn/UI & Bootstrap",
      "Node.js, Express.js & MongoDB",
      "Supabase (PostgreSQL), Firebase & JWT",
      "WordPress & Elementor Pro",
    ],
  },
  {
    index: "04",
    title: "IT Support & Digital Infrastructure",
    serviceSlug: "it-support",
    summary:
      "Windows installation and troubleshooting, Microsoft Office & Outlook configuration, employee VPN access, LAN/Wi-Fi & printer support, cPanel/GoDaddy DNS & SSL management, and basic CCTV monitoring.",
    skills: [
      "Windows Setup & Troubleshooting",
      "Microsoft Word, Excel, PowerPoint & Outlook",
      "Internet, LAN, Wi-Fi & VPN Support",
      "cPanel, GoDaddy, DNS & SSL",
      "Website Security & Malware Cleanup",
      "Basic CCTV Setup & Monitoring",
    ],
  },
];

const SKILL_PROFICIENCY_MATRIX = [
  {
    domain: "Video Editing & AI Content Creation",
    expertise: [
      "Video Editing & Post-Production",
      "Storytelling & Narrative Flow",
      "Video Pacing, Timing & Rhythm",
      "Audio Editing & Sound Synchronization",
      "Noise Cancellation & Voice Cleanup",
      "Color Correction & Color Grading",
      "Motion Graphics & Animated Text",
      "Visual Effects & Compositing",
      "Social Media Video Creation",
    ],
    comfortable: [
      "AI Video, Image & Scene Generation",
      "AI Voiceover & Audio Generation",
      "Script Writing & Scene Planning",
      "Prompt-Based Content Generation",
      "AI Asset Integration & Editing",
      "Video Thumbnail Creation",
      "Multi-Platform Video Formatting",
    ],
    familiar: [
      "Content Repurposing",
      "Social Media Content Management",
      "Video Scheduling & Publishing",
      "Platform-Specific Optimization",
    ],
  },
  {
    domain: "Web Development & WordPress",
    expertise: [
      "HTML5 & CSS3",
      "React.js",
      "Tailwind CSS, DaisyUI & Bootstrap",
      "Firebase",
      "WordPress, Elementor & Elementor Pro",
      "Website Customization",
    ],
    comfortable: [
      "JavaScript (ES6) & TypeScript",
      "Next.js & Shadcn/UI",
      "Node.js, Express.js & MongoDB",
      "Supabase (PostgreSQL) & JWT",
      "Rust & Tauri v2",
      "Plugin Management, Backups & Speed Optimization",
    ],
    familiar: [
      "Redux & IndexedDB",
      "Progressive Web Apps (PWA)",
      "Web Push Notifications",
      "PHP & Laravel",
      "Basic Website Security & Malware Cleanup",
    ],
  },
];

function formatCvUpdatedDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default async function CurriculumVitaePage() {
  const publishedCv = await getPublishedCvDocument();
  const updatedAtFormatted = formatCvUpdatedDate(
    publishedCv?.published_at || publishedCv?.updated_at
  );

  const employmentItems = (PORTFOLIO_DATA.milestones || []).filter(
    (m) => m.type === "experience"
  );
  const educationItems = (PORTFOLIO_DATA.milestones || []).filter(
    (m) => m.type === "education"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://kamrulislam.me/cv#profilepage",
        url: "https://kamrulislam.me/cv",
        name: "Curriculum Vitae — Kamrul Islam",
        description:
          "Official Curriculum Vitae of Kamrul Islam covering Video Editing & Post-Production, AI-Assisted Content Creation, Web Development, and IT Support.",
        inLanguage: "en-US",
         ...(publishedCv?.updated_at ? { dateModified: publishedCv.updated_at } : {}),
        mainEntity: {
          "@id": "https://kamrulislam.me/#person",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kamrulislam.me/cv#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kamrulislam.me",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Curriculum Vitae",
            item: "https://kamrulislam.me/cv",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Navigation isRevealed={true} />

      <main className="relative z-10 w-full bg-black min-h-screen text-white pt-32 sm:pt-36 md:pt-40 pb-24 mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)] overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-mono-custom text-xs sm:text-sm text-[#888] uppercase tracking-wider">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                Curriculum Vitae
              </li>
            </ol>
          </nav>

          {/* Editorial Header */}
          <header className="w-full mb-12 md:mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/8 border border-white/10 text-white/80 text-xs font-mono-custom uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>OFFICIAL DOSSIER // CURRICULUM VITAE</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#aaa] text-xs font-mono-custom">
                Chittagong, Bangladesh • Remote Worldwide
              </div>

              {updatedAtFormatted && (
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#888] text-xs font-mono-custom">
                  Updated {updatedAtFormatted}
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-4xl">
                <h1 className="font-gambarino text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.06] mb-6">
                  Curriculum Vitae — Kamrul Islam
                </h1>
                <p className="font-mono-custom text-sm sm:text-base md:text-lg text-[#a1a1a1] leading-relaxed max-w-3xl">
                  Creative-technology professional combining commercial{" "}
                  <strong className="text-white font-normal">Video Editing &amp; Post-Production</strong>,{" "}
                  <strong className="text-white font-normal">AI-Assisted Content Creation</strong>,{" "}
                  <strong className="text-white font-normal">Full-Stack Web Development</strong>, and{" "}
                  <strong className="text-white font-normal">Enterprise IT Infrastructure</strong> under one multidisciplinary practice.
                </p>
              </div>

              {/* Primary Header Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {publishedCv ? (
                  <>
                    <a
                      href="/api/cv/pdf?download=1"
                      download="Kamrul-Islam-CV.pdf"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
                    >
                      <span>Download CV (PDF)</span>
                      <span>↓</span>
                    </a>
                    <a
                      href="/api/cv/pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
                    >
                      <span>Open PDF</span>
                      <span>↗</span>
                    </a>
                  </>
                ) : (
                  <a
                    href="mailto:hello@kamrulislam.me?subject=Request%20for%20Official%20CV%20PDF%20%E2%80%94%20Kamrul%20Islam"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
                  >
                    <span>Request PDF CV</span>
                    <span>↗</span>
                  </a>
                )}

                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/4 hover:bg-white/10 text-white/90 font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
                >
                  <span>Inquire / Hire</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Interactive PDF Viewer / Controlled Fallback Section */}
          <section aria-label="Curriculum Vitae Document Viewer" className="mb-20 md:mb-28">
            <CvPdfViewer
              hasPublishedPdf={Boolean(publishedCv)}
              title={publishedCv?.title}
              fileName={publishedCv?.file_name}
              fileSize={publishedCv?.file_size}
              versionLabel={publishedCv?.version_label}
              updatedAtFormatted={updatedAtFormatted}
            />
          </section>

          {/* ============================================================ */}
          {/* CRAWLABLE HTML CURRICULUM VITAE SUMMARY                      */}
          {/* ============================================================ */}
          <div id="cv-summary" className="space-y-20 md:space-y-28 scroll-mt-28">
            {/* SECTION 01: CORE CAPABILITIES */}
            <section aria-labelledby="cv-capabilities-heading">
              <HairlineRule className="mb-10 md:mb-14" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <span className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400 block">
                    01 // Core Capabilities
                  </span>
                  <h2
                    id="cv-capabilities-heading"
                    className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight"
                  >
                    Four Interconnected Practice Areas
                  </h2>
                  <p className="font-mono-custom text-xs sm:text-sm text-[#888] leading-relaxed">
                    Ordered by primary creative and technical focus, bridging post-production storytelling with full-stack engineering and IT reliability.
                  </p>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {CORE_PILLARS.map((pillar) => (
                      <article
                        key={pillar.index}
                        className="p-6 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-between space-y-5 hover:border-white/20 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono-custom text-xs text-emerald-400">
                              PILLAR {pillar.index}
                            </span>
                            <Link
                              href={`/services/${pillar.serviceSlug}`}
                              className="font-mono-custom text-[11px] uppercase tracking-wider text-[#aaa] hover:text-white transition-colors"
                            >
                              Service Spec →
                            </Link>
                          </div>

                          <h3 className="font-gambarino text-2xl text-white tracking-tight">
                            {pillar.title}
                          </h3>

                          <p className="font-mono-custom text-xs text-[#999] leading-relaxed">
                            {pillar.summary}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                          {pillar.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-md bg-white/4 border border-white/10 font-mono-custom text-[11px] text-white/85"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Proficiency Tiers from Authoritative CVs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {SKILL_PROFICIENCY_MATRIX.map((group) => (
                      <div
                        key={group.domain}
                        className="p-6 rounded-2xl bg-white/2 border border-white/10 space-y-4"
                      >
                        <h3 className="font-gambarino text-xl text-white tracking-tight">
                          {group.domain} — Proficiency Breakdown
                        </h3>
                        <div className="space-y-3 font-mono-custom text-xs">
                          <div>
                            <span className="text-emerald-400 uppercase tracking-wider block mb-1">
                              Expertise
                            </span>
                            <p className="text-[#bbb] leading-relaxed">
                              {group.expertise.join(" • ")}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/80 uppercase tracking-wider block mb-1">
                              Comfortable
                            </span>
                            <p className="text-[#999] leading-relaxed">
                              {group.comfortable.join(" • ")}
                            </p>
                          </div>
                          <div>
                            <span className="text-[#888] uppercase tracking-wider block mb-1">
                              Familiar
                            </span>
                            <p className="text-[#777] leading-relaxed">
                              {group.familiar.join(" • ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 02: PROFESSIONAL EXPERIENCE */}
            <section aria-labelledby="cv-experience-heading">
              <HairlineRule className="mb-10 md:mb-14" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <span className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400 block">
                    02 // Career Timeline
                  </span>
                  <h2
                    id="cv-experience-heading"
                    className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight"
                  >
                    Professional Experience
                  </h2>
                  <p className="font-mono-custom text-xs sm:text-sm text-[#888] leading-relaxed">
                    Verified corporate, creative, and technical appointments across digital content production, IT administration, and enterprise operations.
                  </p>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  {employmentItems.map((job) => {
                    const details = job.details || {};
                    return (
                      <article
                        key={job.slug}
                        className="p-6 sm:p-7 rounded-2xl bg-white/3 border border-white/10 space-y-4 hover:border-white/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-mono-custom text-xs text-emerald-400 uppercase tracking-wider block mb-1">
                              {job.period || job.year}
                              {details.department ? ` • ${details.department}` : ""}
                            </span>
                            <h3 className="font-gambarino text-2xl sm:text-3xl text-white tracking-tight">
                              {job.role}
                            </h3>
                            <p className="font-mono-custom text-xs sm:text-sm text-[#bbb] mt-0.5">
                              {job.organization}
                            </p>
                          </div>

                          <Link
                            href={`/milestones/experience/${job.slug}`}
                            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/6 hover:bg-white text-white hover:text-black font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all shrink-0"
                          >
                            <span>Full Role Dossier</span>
                            <span>→</span>
                          </Link>
                        </div>

                        {details.overview && (
                          <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed">
                            {details.overview}
                          </p>
                        )}

                        {details.responsibilities && details.responsibilities.length > 0 && (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                            {details.responsibilities.slice(0, 4).map((item, idx) => (
                              <li
                                key={idx}
                                className="font-mono-custom text-xs text-[#aaa] flex items-start gap-2"
                              >
                                <span className="text-emerald-400 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 03: ACADEMIC QUALIFICATIONS */}
            <section aria-labelledby="cv-education-heading">
              <HairlineRule className="mb-10 md:mb-14" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <span className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400 block">
                    03 // Education
                  </span>
                  <h2
                    id="cv-education-heading"
                    className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight"
                  >
                    Academic Qualifications
                  </h2>
                  <p className="font-mono-custom text-xs sm:text-sm text-[#888] leading-relaxed">
                    Computer Science &amp; Engineering degree and science foundation in Chittagong, Bangladesh.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/milestones/education"
                      className="inline-flex items-center gap-2 font-mono-custom text-xs uppercase tracking-wider text-white hover:text-emerald-400 transition-colors"
                    >
                      <span>View Complete Academic Dossier</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {educationItems.map((edu) => {
                    const d = edu.details || {};
                    return (
                      <article
                        key={edu.slug}
                        className="p-5 sm:p-6 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <span className="font-mono-custom text-xs text-emerald-400 block">
                            {d.passingYear ? `Passing Year: ${d.passingYear}` : "University Studies"}
                          </span>
                          <h3 className="font-gambarino text-xl text-white tracking-tight leading-snug">
                            {edu.role}
                          </h3>
                          <p className="font-mono-custom text-xs text-[#aaa]">
                            {d.institution || edu.organization}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 space-y-1 font-mono-custom text-[11px] text-[#888]">
                          {d.department && <div>Department: {d.department}</div>}
                          {d.subject && <div>Subject: {d.subject}</div>}
                          {d.major && <div>Major: {d.major}</div>}
                          {d.group && <div>Group: {d.group}</div>}
                          {d.board && <div>Board: {d.board}</div>}
                          {d.gpa && <div className="text-white/90">GPA: {d.gpa}</div>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 04: LANGUAGES & PROFESSIONAL CONTACT */}
            <section aria-labelledby="cv-contact-heading">
              <HairlineRule className="mb-10 md:mb-14" />
              <div className="p-6 sm:p-10 md:p-12 rounded-2xl bg-white/3 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3 max-w-2xl">
                  <span className="font-mono-custom text-xs uppercase tracking-wider text-emerald-400 block">
                    04 // Direct Inquiries &amp; Collaboration
                  </span>
                  <h2
                    id="cv-contact-heading"
                    className="font-gambarino text-3xl sm:text-4xl text-white tracking-tight"
                  >
                    Available for Video Production, Creative-Tech &amp; Web Projects
                  </h2>
                  <p className="font-mono-custom text-xs sm:text-sm text-[#999] leading-relaxed">
                    Languages: <strong className="text-white font-normal">Bangla</strong> (Fluent — Reading, Writing, Speaking),{" "}
                    <strong className="text-white font-normal">English</strong> (Good Command — Reading, Writing, Speaking),{" "}
                    <strong className="text-white font-normal">Hindi</strong> (Conversational — Speaking, Listening). Direct inquiries can be sent to{" "}
                    <a
                      href="mailto:hello@kamrulislam.me"
                      className="text-white underline underline-offset-4 hover:text-emerald-400 transition-colors"
                    >
                      hello@kamrulislam.me
                    </a>{" "}
                    or{" "}
                    <span className="inline-flex items-center gap-1.5 align-middle">
                      <a
                        href="tel:+8801839006867"
                        className="text-white underline underline-offset-4 hover:text-emerald-400 transition-colors"
                      >
                        (+880) 1839 00 6867
                      </a>
                      <a
                        href="https://wa.me/8801839006867"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        title="Open in WhatsApp"
                        className="w-6 h-6 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-[#25D366] inline-flex items-center justify-center transition-all hover:scale-110"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.461 3.484 1.336 5.008L2 22l5.156-1.352a9.927 9.927 0 0 0 4.875 1.281h.004c5.512 0 9.965-4.453 9.965-9.969 0-2.664-1.035-5.168-2.918-7.051A9.907 9.907 0 0 0 12.031 2Zm0 18.281h-.004a8.268 8.268 0 0 1-4.215-1.152l-.301-.18-3.062.805.816-2.984-.199-.313a8.252 8.252 0 0 1-1.266-4.488c0-4.57 3.719-8.289 8.293-8.289 2.215 0 4.297.863 5.863 2.43a8.238 8.238 0 0 1 2.426 5.859c0 4.574-3.719 8.293-8.351 8.312Zm4.547-6.203c-.25-.125-1.477-.727-1.703-.812-.23-.082-.395-.125-.563.125-.164.25-.645.812-.789.977-.145.168-.289.188-.539.062-.25-.125-1.055-.387-2.008-1.238-.742-.66-1.242-1.48-1.387-1.73-.145-.25-.016-.383.109-.508.113-.113.25-.293.375-.438.125-.145.164-.25.25-.414.082-.168.043-.312-.02-.438-.062-.125-.562-1.355-.77-1.855-.203-.484-.41-.418-.562-.426l-.477-.008c-.168 0-.438.062-.668.312-.23.25-.875.855-.875 2.086s.895 2.418 1.02 2.586c.125.164 1.762 2.691 4.27 3.773.598.258 1.062.41 1.426.527.598.191 1.145.164 1.574.102.48-.07 1.477-.605 1.688-1.188.207-.586.207-1.086.145-1.188-.062-.105-.227-.168-.477-.293Z" />
                        </svg>
                      </a>
                    </span>
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="mailto:hello@kamrulislam.me"
                    className="px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
                  >
                    hello@kamrulislam.me ↗
                  </a>
                  <Link
                    href="/projects"
                    className="px-6 py-3.5 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
                  >
                    Explore Portfolio Works →
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <CurtainFooter />
    </>
  );
}
