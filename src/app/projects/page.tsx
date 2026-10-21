import { Suspense } from "react";
import { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects-service";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { ProjectsPageContent } from "@/components/works/ProjectsPageContent";

export const metadata: Metadata = {
  title: "Projects & Works Archive — Video Editing, AI Content & Web Development",
  description:
    "Explore the complete portfolio archive of video editing productions, AI-assisted content creations, responsive web applications, and digital systems by Kamrul Islam.",
  alternates: {
    canonical: "https://kamrulislam.me/projects",
  },
  openGraph: {
    siteName: "Kamrul Islam",
    title: "Kamrul Islam — Projects & Works Archive",
    description:
      "Explore the complete portfolio archive of video editing productions, AI-assisted content creations, responsive web applications, and digital systems by Kamrul Islam.",
    url: "https://kamrulislam.me/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamrul Islam — Projects & Works Archive",
    description:
      "Explore the complete portfolio archive of video editing productions, AI-assisted content creations, responsive web applications, and digital systems by Kamrul Islam.",
  },
};

export default async function ProjectsArchivePage() {
  const publishedProjects = await getPublishedProjects();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: "Projects & Works",
        item: "https://kamrulislam.me/projects",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Global Fixed Navigation */}
      <Navigation isRevealed={true} />

      {/* Main Page Scroll Canvas */}
      <main className="relative z-10 w-full bg-black min-h-screen text-white overflow-x-clip mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <Suspense
          fallback={
            <div className="w-full min-h-[60vh] flex items-center justify-center">
              <span className="font-mono-custom text-sm text-[#888] animate-pulse">
                Loading project archive...
              </span>
            </div>
          }
        >
          <ProjectsPageContent initialProjects={publishedProjects} />
        </Suspense>
      </main>

      {/* Fixed Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
