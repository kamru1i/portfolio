import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects-service";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://kamrulislam.me",
  },
  openGraph: {
    url: "https://kamrulislam.me",
    siteName: "Kamrul Islam",
    title: "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
    description:
      "Explore Kamrul Islam’s portfolio of cinematic video storytelling, AI-assisted content creation, full-stack web engineering, and enterprise IT infrastructure.",
    type: "website",
    locale: "en_US",
  },
};

const homeProfileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://kamrulislam.me/#profilepage",
  url: "https://kamrulislam.me",
  name: "Kamrul Islam (Kamrul I) — Official Portfolio",
  description:
    "Official portfolio of Kamrul Islam (Kamrul I) — Video Editor & Post-Production Specialist, AI-Assisted Content Creator, Web Developer, and IT Specialist.",
  inLanguage: "en-US",
  mainEntity: {
    "@id": "https://kamrulislam.me/#person",
  },
  primaryImageOfPage: {
    "@id": "https://kamrulislam.me/#portrait",
  },
};

export default async function HomePage() {
  const initialProjects = await getPublishedProjects();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeProfileJsonLd).replace(/</g, "\\u003c") }}
      />
      <HomePageClient initialProjects={initialProjects} />
    </>
  );
}
