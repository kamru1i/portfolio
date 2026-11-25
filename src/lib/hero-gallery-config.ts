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
    title: "Dark Studio Cinema Camera Rig",
    alt: "Moody low-key close-up of a rigged cinema camera with matte box, prime cine lens, shotgun microphone, and field monitor",
    photographer: "Unsplash Contributor",
    sourceUrl: "https://images.unsplash.com/photo-1705107959309-ca7d26fbeb08",
    license: "Unsplash License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-2",
    src: "/images/hero-gallery/hero-card-2.webp",
    discipline: "video-editing",
    title: "Dark Multi-Track Post-Production Suite",
    alt: "Dark post-production editing interface showing a golden-hour silhouette preview above a vivid multi-track video timeline",
    photographer: "Pexels Contributor",
    sourceUrl: "https://www.pexels.com/photo/31718971/",
    license: "Pexels License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-3",
    src: "/images/hero-gallery/hero-card-3.webp",
    discipline: "creative-digital",
    title: "Iridescent 3D Glass Form & AI Visuals",
    alt: "Sculptural twisted iridescent prismatic 3D glass torus suspended against a pure obsidian black background",
    photographer: "Unsplash Contributor",
    sourceUrl: "https://images.unsplash.com/photo-1771599940657-f9f151abed45",
    license: "Unsplash License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-4",
    src: "/images/hero-gallery/hero-card-4.webp",
    discipline: "web-development",
    title: "React/TSX & AI Engineering Workstation",
    alt: "Dark developer workstation displaying modern TypeScript and React code alongside an AI coding workflow under cobalt-blue ambient light",
    photographer: "Unsplash Contributor",
    sourceUrl: "https://images.unsplash.com/photo-1759661990336-51bd4b951fea",
    license: "Unsplash License (Free to use, Commercial & Non-Commercial)",
  },
  {
    id: "hero-card-5",
    src: "/images/hero-gallery/hero-card-5.webp",
    discipline: "tech-craft",
    title: "Iridescent Illuminated MacBook Pro Macro",
    alt: "Macro close-up of a sleek MacBook Pro half-open in darkness bathed in iridescent cyan, violet, and magenta light reflections",
    photographer: "Martin Sanchez",
    sourceUrl: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c",
    license: "Unsplash License (Free to use, Commercial & Non-Commercial)",
  },
];
