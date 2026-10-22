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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kamrulislam.me"
  ),
  title: {
    default: "Kamrul Islam | Video Editor, AI Content Creator & Web Developer",
    template: "Kamrul Islam — %s",
  },
  description:
    "Explore Kamrul Islam’s portfolio of video editing, AI-assisted content creation, web development, WordPress projects, and IT expertise. View selected projects and professional experience.",
  applicationName: "Kamrul Islam",
  authors: [
    {
      name: "Kamrul Islam",
      url: "https://kamrulislam.me",
    },
  ],
  generator: "Next.js",
  keywords: [
    // Core Identity & Location
    "Kamrul Islam",
    "Kamrul I",
    "Kamrul Islam Portfolio",
    "Chittagong",
    "Bangladesh",

    // Priority 1: Commercial Video Editing & Post-Production
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

    // Priority 2: AI Content Creation & Generative Media
    "AI Content Creator",
    "AI-Assisted Content Creator",
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

    // Priority 3: Full-Stack Web Development
    "Full-Stack Web Developer",
    "Web Developer",
    "Frontend Architecture",
    "Creative Developer",
    "Web Developer Bangladesh",
    "Next.js Developer",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "WordPress Developer",
    "Supabase",
    "PostgreSQL",
    "REST APIs",
    "Responsive Web Design",

    // Priority 4: IT Operations & Infrastructure
    "IT Professional",
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
    url: "https://kamrulislam.me",
    siteName: "Kamrul Islam",
    title: "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
    description:
      "Explore Kamrul Islam’s portfolio of cinematic video storytelling, AI-assisted content creation, full-stack web engineering, and enterprise IT infrastructure.",
    images: [
      {
        url: "https://kamrulislam.me/images/og-card-studio.jpg",
        secureUrl: "https://kamrulislam.me/images/og-card-studio.jpg",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Video Editor, AI-Assisted Content Creator, Web Developer & IT Specialist",
        type: "image/jpeg",
      },
      {
        url: "https://kamrulislam.me/images/og-card-studio.png",
        secureUrl: "https://kamrulislam.me/images/og-card-studio.png",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Video Editor, AI-Assisted Content Creator, Web Developer & IT Specialist",
        type: "image/png",
      },
      {
        url: "https://kamrulislam.me/images/og-card-vibrant.jpg",
        secureUrl: "https://kamrulislam.me/images/og-card-vibrant.jpg",
        width: 1200,
        height: 630,
        alt: "Kamrul Islam — Creative Studio",
        type: "image/jpeg",
      },
    ],
  },
  ...(process.env.NEXT_PUBLIC_FB_APP_ID
    ? {
        facebook: {
          appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        },
      }
    : {}),
  twitter: {
    card: "summary_large_image",
    title: "Kamrul Islam | Video Editor, AI Content Creator, Web Developer & IT Specialist",
    description:
      "Explore Kamrul Islam’s portfolio of cinematic video storytelling, AI-assisted content creation, full-stack web engineering, and enterprise IT infrastructure.",
    images: ["https://kamrulislam.me/images/og-card-studio.jpg"],
    creator: "@kamru1i",
    site: "@kamru1i",
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageObject",
      "@id": "https://kamrulislam.me/#portrait",
      url: "https://kamrulislam.me/images/Kamrul%20I.png",
      contentUrl: "https://kamrulislam.me/images/Kamrul%20I.png",
      name: "Kamrul Islam (Kamrul I) — Official Portrait",
      caption:
        "Kamrul Islam (Kamrul I) — Video Editor, AI-Assisted Content Creator, Web Developer & IT Specialist",
      creator: {
        "@type": "Person",
        "@id": "https://kamrulislam.me/#person",
        name: "Kamrul Islam",
      },
      creditText: "Kamrul Islam",
      copyrightNotice: "© Kamrul Islam",
      license: "https://kamrulislam.me/contact-us",
      acquireLicensePage: "https://kamrulislam.me/contact-us",
      representativeOfPage: true,
    },
    {
      "@type": "Person",
      "@id": "https://kamrulislam.me/#person",
      name: "Kamrul Islam",
      givenName: "Kamrul",
      familyName: "Islam",
      alternateName: [
        "Kamrul I",
        "Kamrul",
        "Kam",
        "Kamrul Islam Video Editor",
        "Kamrul Islam Web Developer",
        "Kamrul Islam IT Specialist",
      ],
      url: "https://kamrulislam.me",
      mainEntityOfPage: {
        "@id": "https://kamrulislam.me/#profilepage",
      },
      image: {
        "@id": "https://kamrulislam.me/#portrait",
      },
      jobTitle: [
        "Video Editor & Post-Production Specialist",
        "AI-Assisted Content Creator",
        "Full-Stack Web Developer",
        "IT Specialist",
      ],
      hasOccupation: [
        {
          "@type": "Occupation",
          name: "Video Editor",
          occupationalCategory: "27-4032.00",
          description:
            "Commercial video editing, post-production, color grading, and motion graphics.",
        },
        {
          "@type": "Occupation",
          name: "AI-Assisted Content Creator",
          description:
            "AI-augmented video generation, script-to-screen storytelling, and multi-platform digital content creation.",
        },
        {
          "@type": "Occupation",
          name: "Web Developer",
          occupationalCategory: "15-1254.00",
          description:
            "Full-stack web application development using Next.js, React, TypeScript, Tailwind CSS, and WordPress.",
        },
        {
          "@type": "Occupation",
          name: "IT Specialist",
          occupationalCategory: "15-1232.00",
          description:
            "Enterprise IT infrastructure, network administration, system troubleshooting, and webmail/DNS management.",
        },
      ],
      description:
        "Kamrul Islam (Kamrul I) is a Video Editor, AI-Assisted Content Creator, Web Developer, and IT Specialist based in Chittagong, Bangladesh.",
      sameAs: [
        "https://www.linkedin.com/in/kamru1i/",
        "https://github.com/kamru1i",
        "https://x.com/kamru1i",
        "https://www.youtube.com/@kamru1iYT",
        "https://www.facebook.com/kamru1i/",
        "https://www.instagram.com/kamru1i/",
        "https://www.tiktok.com/@kamru1i",
      ],
      worksFor: {
        "@type": "Organization",
        name: "B&F Corporate",
      },
      email: "mailto:hello@kamrulislam.me",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Port City International University (PCIU)",
      },
      nationality: {
        "@type": "Country",
        name: "Bangladesh",
      },
      knowsAbout: [
        "Commercial Video Editing",
        "Color Grading",
        "DaVinci Resolve Studio",
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "Generative AI Video",
        "Google Veo",
        "OpenAI Sora",
        "Kling AI",
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
    },
    {
      "@type": "WebSite",
      "@id": "https://kamrulislam.me/#website",
      url: "https://kamrulislam.me/",
      name: "Kamrul Islam",
      alternateName: ["Kamrul I", "Kamrul Islam Portfolio", "kamrulislam.me"],
      description:
        "Explore Kamrul Islam’s portfolio of video editing, AI-assisted content creation, web development, WordPress projects, and IT expertise.",
      publisher: {
        "@id": "https://kamrulislam.me/#person",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ItemList",
      "@id": "https://kamrulislam.me/#sitelinks",
      name: "Main Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Projects & Works",
          description: "Video Editing, AI Content Creation & Web Development Case Studies",
          url: "https://kamrulislam.me/projects",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Curriculum Vitae (CV)",
          description: "Official CV & Professional Resume of Kamrul Islam",
          url: "https://kamrulislam.me/cv",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Video Editing & Post-Production",
          description: "Commercial video editing, color grading, and motion graphics services",
          url: "https://kamrulislam.me/services/video-editing",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "AI-Assisted Content Creation",
          description: "Generative AI video workflows and modern digital storytelling",
          url: "https://kamrulislam.me/services/ai-assisted-content",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Web Development",
          description: "Full-stack Next.js, React, TypeScript & WordPress web engineering",
          url: "https://kamrulislam.me/services/web-development",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Academic Qualifications",
          description: "BSc in Computer Science & Engineering and academic credentials",
          url: "https://kamrulislam.me/milestones/education",
        },
        {
          "@type": "SiteNavigationElement",
          position: 7,
          name: "Contact",
          description: "Get in touch with Kamrul Islam via hello@kamrulislam.me",
          url: "https://kamrulislam.me/contact-us",
        },
      ],
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
