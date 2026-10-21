import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects-service";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://kamrulislam.me",
  },
  openGraph: {
    url: "https://kamrulislam.me",
  },
};

export default async function HomePage() {
  const initialProjects = await getPublishedProjects();

  return <HomePageClient initialProjects={initialProjects} />;
}
