import { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact — Hire for Video Editing, AI Content & Web Development",
  description:
    "Get in touch with Kamrul Islam (hello@kamrulislam.me) about commercial video editing, AI-assisted content production, modern web development, and digital infrastructure projects.",
  alternates: {
    canonical: "https://kamrulislam.me/contact-us",
  },
  openGraph: {
    title: "Kamrul Islam — Contact",
    description:
      "Get in touch with Kamrul Islam about commercial video editing, AI-assisted content production, modern web development, and digital infrastructure projects.",
    url: "https://kamrulislam.me/contact-us",
    siteName: "Kamrul Islam",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamrul Islam — Contact",
    description:
      "Get in touch with Kamrul Islam about commercial video editing, AI-assisted content production, modern web development, and digital infrastructure projects.",
  },
};

export default function ContactUsPage() {
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
        name: "Contact",
        item: "https://kamrulislam.me/contact-us",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <ContactPageContent />
    </>
  );
}
