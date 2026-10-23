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

  const projectsArchiveJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://kamrulislam.me/projects#collection",
        url: "https://kamrulislam.me/projects",
        name: "Projects & Works Archive — Kamrul Islam",
        description:
          "Complete portfolio archive of commercial video editing productions, AI-assisted content creations, and full-stack web applications by Kamrul Islam.",
        inLanguage: "en-US",
        author: {
          "@id": "https://kamrulislam.me/#person",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: publishedProjects.length,
          itemListElement: publishedProjects.slice(0, 30).map((project, idx) => {
            const slug = project.slug || project.id;
            const itemUrl =
              project.type === "video"
                ? `https://kamrulislam.me/projects/video/${slug}`
                : `https://kamrulislam.me/projects/web/${slug}`;
            return {
              "@type": "ListItem",
              position: idx + 1,
              url: itemUrl,
              name: project.title,
              description: project.description,
            };
          }),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kamrulislam.me/projects#breadcrumb",
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
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsArchiveJsonLd).replace(/</g, "\\u003c"),
        }}
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
