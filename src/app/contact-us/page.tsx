import { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kamrul Islam about commercial video editing, AI-assisted content production, modern web development, and digital infrastructure projects.",
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: "Kamrul Islam — Contact",
    description:
      "Get in touch with Kamrul Islam about commercial video editing, AI-assisted content production, modern web development, and digital infrastructure projects.",
    url: "/contact-us",
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
  return <ContactPageContent />;
}
