import type { Metadata } from "next";
import "./globals.css";
import { FilmGrain } from "@/components/common/FilmGrain";
import { SmoothScroll } from "@/components/common/SmoothScroll";

export const metadata: Metadata = {
  title: "Kamrul Islam — Video Editor | AI Creator | Web Developer | IT Professional",
  description:
    "Portfolio of Kamrul Islam: Assistant IT Manager, Video Editor, AI-assisted content creator, and full-stack web developer based in Chittagong, Bangladesh.",
  openGraph: {
    title: "Kamrul Islam | Video Editor & Digital Professional",
    description:
      "Crafting high-impact video edits, AI-assisted visual narratives, modern web platforms, and resilient IT infrastructure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black min-h-screen">
        <SmoothScroll>
          <FilmGrain />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
