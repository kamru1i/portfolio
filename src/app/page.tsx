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

export default async function HomePage() {
  const initialProjects = await getPublishedProjects();

  return <HomePageClient initialProjects={initialProjects} />;
}
