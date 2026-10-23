import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects-service";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title:
    "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
  description:
    "Official portfolio of Kamrul Islam (Kamrul I) — Creative-tech professional specializing in commercial Video Editing & Post-Production, AI-Assisted Content Creation, Full-Stack Web Development (Next.js/React), and Enterprise IT Infrastructure.",
  alternates: {
    canonical: "https://kamrulislam.me",
  },
  openGraph: {
    url: "https://kamrulislam.me",
    siteName: "Kamrul Islam",
    title:
      "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
    description:
      "Explore Kamrul Islam’s portfolio of cinematic video storytelling, AI-assisted content creation, full-stack web engineering, and enterprise IT infrastructure.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Video Editor, AI Content Creator, Web Developer & IT Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
    description:
      "Explore Kamrul Islam’s portfolio of cinematic video storytelling, AI-assisted content creation, full-stack web engineering, and enterprise IT infrastructure.",
    images: ["/opengraph-image.jpg"],
  },
};

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
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
    },
    {
      "@type": "FAQPage",
      "@id": "https://kamrulislam.me/#faqpage",
      mainEntity: (PORTFOLIO_DATA.faq?.items || []).map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default async function HomePage() {
  const initialProjects = await getPublishedProjects();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePageClient initialProjects={initialProjects} />
    </>
  );
}
