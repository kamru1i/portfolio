import type { MetadataRoute } from "next";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { getPublishedProjects } from "@/lib/projects-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kamrulislam-bd.netlify.app";
  const now = new Date();
  const publishedProjects = await getPublishedProjects();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/milestones/education`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const serviceEntries: MetadataRoute.Sitemap = (PORTFOLIO_DATA.services || []).map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const experienceEntries: MetadataRoute.Sitemap = (PORTFOLIO_DATA.milestones || [])
    .filter((m) => m.type === "experience")
    .map((m) => ({
      url: `${baseUrl}/milestones/experience/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const videoProjectEntries: MetadataRoute.Sitemap = publishedProjects
    .filter((p) => p.type === "video")
    .map((p) => ({
      url: `${baseUrl}/projects/video/${p.slug || p.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const webProjectEntries: MetadataRoute.Sitemap = publishedProjects
    .filter((p) => p.type === "web")
    .map((p) => ({
      url: `${baseUrl}/projects/web/${p.slug || p.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...experienceEntries,
    ...videoProjectEntries,
    ...webProjectEntries,
  ];
}
