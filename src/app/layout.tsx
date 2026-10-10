import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FilmGrain } from "@/components/common/FilmGrain";
import { SmoothScroll } from "@/components/common/SmoothScroll";

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kamrulislam.bd"),
  title: {
    default: "Kamrul Islam — Portfolio",
    template: "Kamrul Islam — %s",
  },
  description:
    "Official portfolio of Kamrul Islam: Assistant IT Manager, Commercial Video Editor, AI Content Creator, and Full-Stack Web Developer based in Chittagong, Bangladesh. Specializing in high-impact video post-production (DaVinci Resolve, Premiere Pro), generative AI media (Veo, Sora, Kling), modern web architectures (Next.js, React, TypeScript), and enterprise IT infrastructure & mail server operations.",
  applicationName: "Kamrul Islam Portfolio",
  authors: [
    {
      name: "Kamrul Islam",
      url: "https://kamrulislam.bd",
    },
  ],
  generator: "Next.js",
  keywords: [
    // Core Identity & Location
    "Kamrul Islam",
    "Kamrul Islam Portfolio",
    "Chittagong",
    "Bangladesh",

    // Profession 1: Commercial Video Editing & Post-Production
    "Commercial Video Editor",
    "Professional Video Editor",
    "Post-Production Specialist",
    "Video Editor Bangladesh",
    "Commercial Video Editing",
    "Color Grading",
    "DaVinci Resolve Studio",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Sound Design & Mixing",
    "Motion Graphics",
    "Visual Storytelling",
    "YouTube Video Editor",
    "Social Media Video Specialist",
    "Short-Form Video Production",
    "Reels & TikTok Editing",
    "Brand Films & Commercials",

    // Profession 2: AI Content Creation & Generative Media
    "AI Content Creator",
    "Generative AI Specialist",
    "AI Video Production",
    "Google Veo",
    "OpenAI Sora",
    "Kling AI",
    "Runway Gen-3",
    "Midjourney",
    "Synthetic Media",
    "AI Visual Storytelling",
    "Prompt Engineering",

    // Profession 3: Full-Stack Web Development & Creative Tech
    "Full-Stack Web Developer",
    "Frontend Architecture",
    "Creative Developer",
    "Web Developer Bangladesh",
    "Next.js Developer",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "REST APIs",
    "Responsive Web Design",

    // Profession 4: IT Operations & Enterprise Infrastructure
    "Assistant IT Manager",
    "IT Operations Specialist",
    "Enterprise IT Infrastructure",
    "cPanel Webmail Administration",
    "DNS Management & Domain Routing",
    "Network Administration",
    "Hardware & Systems Engineering",
    "BSc in Computer Science and Engineering",
    "BSc in CSE",
  ],
  creator: "Kamrul Islam",
  publisher: "Kamrul Islam",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kamrulislam.bd",
    siteName: "Kamrul Islam — Portfolio",
    title: "Kamrul Islam — Commercial Video Editor, AI Creator, Web Developer & IT Professional",
    description:
      "Official portfolio of Kamrul Islam: Assistant IT Manager, Commercial Video Editor, AI Content Creator, and Full-Stack Web Developer based in Chittagong, Bangladesh. Explore commercial video productions, web platforms, and digital systems.",
    images: [
      {
        url: "/images/kamrul-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamrul Islam — Video Editor, AI Creator, Web Developer & IT Professional",
    description:
      "Assistant IT Manager, Commercial Video Editor, AI Content Creator, and Full-Stack Web Developer based in Chittagong, Bangladesh.",
    images: ["/images/kamrul-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kamrul Islam",
  alternateName: "Kamrul",
  url: "https://kamrulislam.bd",
  jobTitle: [
    "Commercial Video Editor",
    "AI Content Creator",
    "Full-Stack Web Developer",
    "Assistant IT Manager",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Sterling Group of Industries / Tex Tech Co.",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Port City International University (PCIU)",
  },
  knowsAbout: [
    "Commercial Video Editing",
    "Color Grading",
    "DaVinci Resolve",
    "Adobe Premiere Pro",
    "Generative AI",
    "Google Veo",
    "OpenAI Sora",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Enterprise IT Infrastructure",
    "cPanel Webmail & Mail Servers",
    "DNS Management",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chittagong",
    addressCountry: "Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black relative">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black min-h-screen">
        <SmoothScroll>
          <FilmGrain />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
