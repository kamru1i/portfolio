/**
 * Curated 3D Hero Gallery Configuration
 *
 * Houses the 5 professionally selected stock images reflecting Kamrul Islam's
 * core creative and engineering disciplines: Cinematography, Video Editing,
 * Post-Production, Creative Digital Systems, and Full-Stack Web Development.
 *
 * Future-proofed for eventual Admin Dashboard management without needing
 * component refactors.
 */

export interface HeroGalleryItem {
  id: string;
  src: string;
  alt: string;
  discipline?: string;
  title?: string;
  photographer?: string;
  sourceUrl?: string;
  license?: string;
}

export const HERO_GALLERY_IMAGES: HeroGalleryItem[] = [
  {
    id: "hero-card-1",
    src: "/images/hero-gallery/hero-card-1.webp",
    discipline: "cinematography",
    title: "Professional Cinema Camera Rig",
    alt: "Close-up of a professional Sony cinema camera rig with monitor and lens",
    photographer: "@MOONLIGHTSHOTZ",
    sourceUrl: "https://www.pexels.com/photo/close-up-of-a-professional-camera-11480031/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-2",
    src: "/images/hero-gallery/hero-card-2.webp",
    discipline: "video-editing",
    title: "Video Editing Multi-Track Timeline",
    alt: "Vivid colorful video editing timeline with audio waveforms in post-production suite",
    photographer: "Pexels Contributor",
    sourceUrl: "https://www.pexels.com/photo/colorful-monitor-3069868/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-3",
    src: "/images/hero-gallery/hero-card-3.webp",
    discipline: "post-production",
    title: "Video Editing Studio Workstation",
    alt: "Monochrome post-production suite with Apple Cinema Display editing sequence and keyboard",
    photographer: "Pexels Contributor",
    sourceUrl: "https://www.pexels.com/photo/laptop-and-computer-on-the-desk-with-video-editing-11025645/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-4",
    src: "/images/hero-gallery/hero-card-4.webp",
    discipline: "creative-digital",
    title: "Creative Workspace with Abstract Display",
    alt: "Modern creative digital workstation with fluid abstract monitor artwork and ambient lighting",
    photographer: "Pexels Contributor",
    sourceUrl: "https://www.pexels.com/photo/modern-workspace-with-abstract-monitor-display-29849371/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-5",
    src: "/images/hero-gallery/hero-card-5.webp",
    discipline: "web-development",
    title: "Web Engineering & Code Architecture",
    alt: "Modern developer desk with laptop displaying syntax-highlighted code editor and workspace",
    photographer: "Daniil Komov (dkomov.com)",
    sourceUrl: "https://www.pexels.com/photo/modern-workspace-with-laptop-and-coding-screen-34804019/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
];
