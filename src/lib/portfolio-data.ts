import { HERO_GALLERY_IMAGES, HeroGalleryItem } from "./hero-gallery-config";
export { HERO_GALLERY_IMAGES };
export type { HeroGalleryItem };

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  discipline: "video" | "ai" | "web" | "it";
  summary: string;
  aspect: "small" | "large" | "medium";
  colSpan: string; // Tailwind grid placement
  image: string;
  tags: string[];
  links?: { label: string; url: string }[];
}

export interface PortfolioProject {
  id: string;
  slug?: string;
  type: "video" | "web";
  title: string;
  category?: string;
  client?: string;
  year: string;
  description: string;
  thumbnail: string;
  previewImageUrl?: string;
  videoUrl?: string;
  videoType?: "local" | "youtube" | "vimeo" | "tiktok" | "facebook" | "instagram" | "twitter" | "other";
  format?: "16:9" | "9:16" | "1:1" | "4:3" | "5:4";
  aspect?: "small" | "large" | "medium";
  githubUrl?: string;
  liveUrl?: string;
  canEmbed?: boolean;
  previewMode?: "iframe" | "fallback";
  featured?: boolean;
  tags: string[];
  published: boolean;
  order: number;
  manualPriority?: number | null;
  publishedAt?: string;
  createdAt?: string;
  role?: string;
  tools?: string[];
  workflow?: string[];
  deliverables?: string[];
  overview?: string;
}

export interface ServiceCapability {
  title: string;
  description: string;
}

export interface ServiceExperience {
  role: string;
  organization: string;
  period: string;
  summary: string;
}

export interface ServiceWorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceProjectHighlight {
  title: string;
  client: string;
  role: string;
  summary: string;
  image?: string;
  link?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  href: string;
  index: string;
  category: string;
  title: string;
  headline: string;
  description: string;
  introduction: string;
  bulletHighlights: string[];
  capabilities: ServiceCapability[];
  tools: string[];
  workflow: ServiceWorkflowStep[];
  experience: ServiceExperience[];
  projects?: ServiceProjectHighlight[];
  images: string[];
  image: string;
}

export interface MilestoneItem {
  year: string;
  organization: string;
  role: string;
  highlight: string;
  slug: string;
  type: "experience" | "education";
  period?: string;
  details?: {
    overview?: string;
    responsibilities?: string[];
    achievements?: string[];
    tools?: string[];
    skills?: string[];
    institution?: string;
    board?: string;
    group?: string;
    gpa?: string;
    passingYear?: string;
    department?: string;
    subject?: string;
    major?: string;
    coursework?: string[];
  };
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const PORTFOLIO_DATA = {
  brand: {
    fullName: "Kamrul Islam",
    displayName: "KAMRUL",
    curtainName: "KAMRUL ISLAM",
    domain: "kamrulislam.bd",
    title: "Video Editor | AI Content Creator | Web Developer | IT Professional",
    location: "Chittagong, Bangladesh",
    timezone: "Asia/Dhaka", // UTC+6
    email: "inquiry.kamrul@gmail.com",
    phone: "(+880) 1839 00 6867",
    socials: [
      { label: "LI", name: "LinkedIn", url: "https://www.linkedin.com/in/kamru1i/" },
      { label: "GH", name: "GitHub", url: "https://github.com/kamru1i" },
      { label: "X", name: "X", url: "https://x.com/kamru1i" },
      { label: "YT", name: "YouTube", url: "https://www.youtube.com/@kamru1iYT" },
      { label: "FB", name: "Facebook", url: "https://www.facebook.com/kamru1i/" },
      { label: "IG", name: "Instagram", url: "https://www.instagram.com/kamru1i/" },
      { label: "TT", name: "TikTok", url: "https://www.tiktok.com/@kamru1i" },
    ],
  },

  hero: {
    wordmark: "KAMRUL ISLAM",
    subtitle:
      "Crafting high-impact video edits, AI-assisted visual narratives, modern web platforms, and resilient IT infrastructure.",
    cards: [
      {
        id: "hero-1",
        title: "AI Video Production",
        subtitle: "Biqolpo Creative",
        tag: "AI + POST",
        color: "#182030",
        accent: "#38bdf8",
      },
      {
        id: "hero-2",
        title: "Automotive Cinema",
        subtitle: "Syston Autos Ltd",
        tag: "VIDEO EDIT",
        color: "#281b15",
        accent: "#f97316",
      },
      {
        id: "hero-3",
        title: "Social Video Campaign",
        subtitle: "B&F Cars",
        tag: "POST-PRODUCTION",
        color: "#1d1929",
        accent: "#a855f7",
      },
      {
        id: "hero-4",
        title: "Full-Stack Web Engineering",
        subtitle: "Velocity Digital Inc.",
        tag: "REACT / NEXT.JS",
        color: "#14251e",
        accent: "#10b981",
      },
      {
        id: "hero-5",
        title: "Digital Infrastructure & Security",
        subtitle: "B&F Corporate",
        tag: "IT OPERATIONS",
        color: "#241e17",
        accent: "#eab308",
      },
    ],
    gallery: HERO_GALLERY_IMAGES,
  },
  heroGallery: HERO_GALLERY_IMAGES,

  worksHeader: {
    title: "Projects & Works",
    statementHtml: `A <strong>curated body</strong> of <strong>high-impact video edits</strong>, <strong>AI-assisted productions</strong>, <strong>full-stack web interfaces</strong>, and <strong>enterprise IT systems</strong> engineered for <strong>clarity</strong>, <strong>rhythm</strong>, and <strong>dependability</strong>.`,
  },

  projects: [
    {
      id: "biqolpo",
      title: "Biqolpo — Latent Stories",
      category: "AI-Assisted Video & Content Creation",
      client: "Biqolpo",
      year: "2024–2026",
      discipline: "ai",
      summary:
        "End-to-end AI video production, prompt engineering, scene composition, and post-production refinement using Veo, Sora, Kling, and DaVinci Resolve.",
      aspect: "small",
      colSpan: "col-span-12 md:col-span-4",
      image: "/images/work-1-biqolpo.png",
      tags: ["Google Veo", "Kling 3.0", "DaVinci Resolve", "AI Compositing"],
      links: [
        { label: "Video 01", url: "#" },
        { label: "Video 02", url: "#" },
        { label: "Video 03", url: "#" },
      ],
    },
    {
      id: "syston-autos",
      title: "Syston Autos Cinema",
      category: "Social Media & Short-Form Video Production",
      client: "Syston Autos Ltd",
      year: "2024–2025",
      discipline: "video",
      summary:
        "Short-form automotive promotional series with precision rhythm, speed ramping, engine audio enhancement, and cinematic color grading across 6 episodes.",
      aspect: "large",
      colSpan: "col-span-12 md:col-span-8",
      image: "/images/work-2-syston.png",
      tags: ["Premiere Pro", "After Effects", "Sound Design", "Color Grading"],
      links: [
        { label: "Video 01", url: "#" },
        { label: "Video 02", url: "#" },
        { label: "Video 03", url: "#" },
        { label: "Video 04", url: "#" },
        { label: "Video 05", url: "#" },
        { label: "Video 06", url: "#" },
      ],
    },
    {
      id: "velocity-digital",
      title: "Velocity Interface System",
      category: "Front-End Development & UI Engineering",
      client: "Velocity Digital Inc.",
      year: "2023–2024",
      discipline: "web",
      summary:
        "Modular, component-driven web interfaces built in React.js, Tailwind CSS, and TypeScript with fluid animations, REST API integrations, and responsive UX.",
      aspect: "large",
      colSpan: "col-span-12 md:col-span-8 md:col-start-3",
      image: "/images/work-3-web.png",
      tags: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
      links: [{ label: "View Architecture", url: "#" }],
    },
    {
      id: "bf-corporate-infra",
      title: "B&F Corporate Infrastructure",
      category: "IT Operations & Cloud Management",
      client: "B&F Corporate",
      year: "2024–2026",
      discipline: "it",
      summary:
        "Multi-domain web hosting architecture, DNS/SSL lifecycle management, enterprise email servers, VPN routing, malware shielding, and office network uptime.",
      aspect: "large",
      colSpan: "col-span-12 md:col-span-8",
      image: "/images/work-4-it.png",
      tags: ["cPanel Hosting", "DNS / SSL", "Network VPN", "Security Maintenance"],
      links: [{ label: "Operations Overview", url: "#" }],
    },
    {
      id: "bf-cars",
      title: "B&F Cars Automotive",
      category: "Automotive Social Media Video Editing",
      client: "B&F Cars",
      year: "2024–2025",
      discipline: "video",
      summary:
        "Fast-paced promotional video series focused on vehicular presentation, crisp transitions, motion graphics badges, and multi-platform optimization.",
      aspect: "small",
      colSpan: "col-span-12 md:col-span-4",
      image: "/images/work-5-bfcars.png",
      tags: ["CapCut Pro", "Premiere Pro", "Motion Graphics", "Social Format"],
      links: [
        { label: "Video 01", url: "#" },
        { label: "Video 02", url: "#" },
        { label: "Video 03", url: "#" },
      ],
    },
  ] as ProjectItem[],

  // Future-proof, typed project model separating data from presentation (ready for future database / API integration)
  showcaseProjects: [
    {
      id: "youtube-video-5",
      slug: "audi-q5-dealership-promo",
      type: "video",
      format: "9:16",
      aspect: "small",
      title: "How I Edited a Car Dealership Promo | Audi Q5",
      category: "Social Media • Automotive Video",
      client: "Syston Autos Ltd",
      year: "2026",
      description:
        "High-energy short-form vertical promo edited with speed ramps, custom sound design, cinematic color grade, and beat-matched cuts.",
      thumbnail: "https://img.youtube.com/vi/H5xuQHIwhPM/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/shorts/H5xuQHIwhPM",
      videoType: "youtube",
      tags: ["Premiere Pro", "After Effects", "Sound Design", "Automotive Promo"],
      published: true,
      order: 1,
      publishedAt: "2026-03-15T12:00:00Z",
      role: "Lead Social Video Editor & Sound Designer",
      tools: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve Fairlight"],
      deliverables: ["9:16 Vertical Reel", "Speed Ramped Teaser", "Audio Mixed Master"],
      overview: "Produced for Syston Autos Ltd to showcase an Audi Q5 dealership inventory piece. Built around high-energy speed ramping, custom exhaust sound design, and sharp color contrast to maximize social engagement.",
    },
    {
      id: "youtube-video-4",
      slug: "mustard-oil-health-awareness",
      type: "video",
      format: "9:16",
      aspect: "small",
      title: "রিফাইন্ড তেল নাকি খাঁটি সরিষার তেল? কোনটা নিরাপদ?",
      category: "Documentary • Social Video",
      client: "Health Awareness",
      year: "2026",
      description:
        "Educational vertical social video with kinetic typography, custom motion graphics, sound design, and engaging visual hooks.",
      thumbnail: "https://img.youtube.com/vi/53UpmiVue90/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/shorts/53UpmiVue90",
      videoType: "youtube",
      tags: ["Social Reels", "Motion Graphics", "CapCut Pro", "Voiceover Sync"],
      published: true,
      order: 2,
      publishedAt: "2026-03-14T12:00:00Z",
      role: "Video Editor & Motion Graphics Specialist",
      tools: ["CapCut Desktop", "Adobe Premiere Pro", "Adobe Podcast"],
      deliverables: ["9:16 Vertical Documentary", "Kinetic Typography", "Voiceover Synchronization"],
      overview: "A viral-style investigative health documentary examining cooking oil processing. Features dynamic text animation, precision voiceover pacing, and clean sound effects to sustain high retention.",
    },
    {
      id: "youtube-video-3",
      slug: "upside-down-world-delivery",
      type: "video",
      format: "16:9",
      aspect: "large",
      title: "কেমন হতো, যদি Upside Down World-এও ডেলিভারি দিতে হতো?",
      category: "Creative Commercial • Visual Storytelling",
      client: "Creative Concept",
      year: "2026",
      description:
        "Imaginative storytelling commercial exploring parallel worlds with VFX composites, seamless pacing, and sound immersion.",
      thumbnail: "https://img.youtube.com/vi/7L0Ww3oauc0/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=7L0Ww3oauc0",
      videoType: "youtube",
      tags: ["DaVinci Resolve", "Visual FX", "Premiere Pro", "Commercial Edit"],
      published: true,
      order: 3,
      publishedAt: "2026-03-13T12:00:00Z",
      role: "Commercial Editor & VFX Compositor",
      tools: ["DaVinci Resolve", "Adobe Premiere Pro", "Adobe After Effects"],
      deliverables: ["16:9 Widescreen Commercial", "VFX Compositing", "Cinematic Color Grade"],
      overview: "A narrative commercial exploring what delivery logistics look like in an inverted reality. Utilizes split-screen composites, spatial audio design, and color grading to establish two parallel dimensions.",
    },
    {
      id: "youtube-video-2",
      slug: "plastic-pollution-awareness",
      type: "video",
      format: "16:9",
      aspect: "large",
      title: "যে প্লাস্টিক ফেলে দিচ্ছেন, সেটা কি সত্যিই হারিয়ে যাচ্ছে?",
      category: "Cinematic Awareness • Visual Essay",
      client: "Environmental Impact",
      year: "2026",
      description:
        "Cinematic narrative documentary raising plastic pollution awareness with emotive color grading, rhythm, and foley audio.",
      thumbnail: "https://img.youtube.com/vi/ZdgHrjWnCaE/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=ZdgHrjWnCaE",
      videoType: "youtube",
      tags: ["Color Grading", "DaVinci Resolve", "Sound Design", "Documentary"],
      published: true,
      order: 4,
      publishedAt: "2026-03-12T12:00:00Z",
      role: "Documentary Editor & Colorist",
      tools: ["DaVinci Resolve", "Adobe Podcast", "Premiere Pro"],
      deliverables: ["16:9 Cinematic Video Essay", "Voice Cleanup & Restoration", "Color Palette Grading"],
      overview: "A documentary raising environmental awareness about plastic pollution life cycles. Emphasizes atmospheric audio design, organic pacing, and rich film-like color curves.",
    },
    {
      id: "youtube-video-1",
      slug: "capcut-professional-video-editing",
      type: "video",
      format: "16:9",
      aspect: "large",
      title: "CapCut কি সত্যিই Professional Video Editing-এর জন্য Worthy",
      category: "Tech Analysis • Video Editing",
      client: "Creator Review",
      year: "2026",
      description:
        "In-depth analysis of workflow capabilities, rendering speeds, desktop features, and professional post-production viability.",
      thumbnail: "https://img.youtube.com/vi/pPck6hOVRRQ/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=pPck6hOVRRQ",
      videoType: "youtube",
      tags: ["CapCut Desktop", "Premiere Pro", "Workflow Analysis", "Motion"],
      published: true,
      order: 5,
      publishedAt: "2026-03-11T12:00:00Z",
      role: "Producer, Editor & Technical Analyst",
      tools: ["CapCut Desktop", "Adobe Premiere Pro", "Adobe Photoshop"],
      deliverables: ["16:9 Full Breakdown Video", "Comparative Benchmarks", "Custom Graphic Overlays"],
      overview: "A comprehensive deep dive comparing CapCut Desktop against industry NLEs. Explores real-world playback performance, export speed, auto-caption accuracy, and post-production bottlenecks.",
    },
    {
      id: "biqolpo-ai-production",
      slug: "biqolpo-ai-latent-stories",
      type: "video",
      format: "16:9",
      aspect: "large",
      title: "Biqolpo — Latent Stories (AI Video Production)",
      category: "AI-Assisted Video & Content Creation",
      client: "Biqolpo",
      year: "2026",
      description:
        "AI-assisted video production, creative editing, visual storytelling, AI-generated assets integration, and final content refinement using Google Veo, Kling 3.0, and DaVinci Resolve.",
      thumbnail: "/images/work-1-biqolpo.png",
      videoUrl: "https://drive.google.com/file/d/1yvkmMm77WCu9J8xj8xLePf9-2rauOJ0p/preview",
      videoType: "other",
      tags: ["Google Veo", "Kling 3.0", "AI Compositing", "DaVinci Resolve"],
      published: true,
      order: 6,
      publishedAt: "2026-03-09T12:00:00Z",
      role: "AI-Assisted Video Editor & Prompt Architect",
      tools: ["Google Veo", "Kling 3.0", "ChatGPT Sora", "DaVinci Resolve", "Adobe Podcast"],
      deliverables: ["AI Scene Generation", "Prompt Engineering", "Color Grading", "Post-Production Refinement"],
      overview: "Documented in the official Portfolio. An end-to-end generative AI production pipeline combining algorithmic camera movements with professional NLE assembly and audio enhancement.",
    },
    {
      id: "syston-autos-cinema",
      slug: "syston-autos-short-form-series",
      type: "video",
      format: "9:16",
      aspect: "small",
      title: "Syston Autos Ltd — Short-Form Cinematic Series",
      category: "Social Media & Short-Form Video Editing",
      client: "Syston Autos Ltd",
      year: "2026",
      description:
        "Short-form promotional content, social-first editing, pacing, speed ramping, transitions, visual enhancement, and platform-ready video production.",
      thumbnail: "/images/work-2-syston.png",
      videoUrl: "https://www.tiktok.com/@systonautos.ltd/video/7616056007160040726",
      videoType: "tiktok",
      tags: ["TikTok", "Speed Ramping", "Automotive Promo", "Premiere Pro"],
      published: true,
      order: 7,
      publishedAt: "2026-03-08T12:00:00Z",
      role: "Social Media Video Editor",
      tools: ["Adobe Premiere Pro", "After Effects", "Sound Design", "CapCut"],
      deliverables: ["6-Part TikTok Series", "High Retention Pacing", "Audio Enhancement", "Dynamic Captions"],
      overview: "Documented in the official Portfolio. A 6-part vertical automotive campaign designed specifically for TikTok and Instagram Reels, delivering rapid retention through engine audio mixes and seamless speed transitions.",
    },
    {
      id: "bnf-cars-automotive",
      slug: "bnf-cars-automotive-series",
      type: "video",
      format: "9:16",
      aspect: "small",
      title: "B&F Cars — Automotive Promotional Series",
      category: "Social Media & Short-Form Video Editing",
      client: "B&F Cars",
      year: "2026",
      description:
        "Automotive promotional content, short-form editing, vehicular visual presentation, pacing, transitions, and social media optimization.",
      thumbnail: "/images/work-5-bfcars.png",
      videoUrl: "https://www.tiktok.com/@bnf_cars/video/7600790351141473558",
      videoType: "tiktok",
      tags: ["Automotive Showcase", "Social Video", "CapCut", "Premiere Pro"],
      published: true,
      order: 8,
      publishedAt: "2026-03-07T12:00:00Z",
      role: "Social Media Video Editor",
      tools: ["CapCut", "Adobe Premiere Pro", "Color Grading", "Photoshop"],
      deliverables: ["5-Part TikTok Showcase", "Vehicle Detail Highlight", "Sound Design", "Thumbnail Suite"],
      overview: "Documented in the official Portfolio. Commercial automotive showcases highlighting exterior styling, interior appointments, and driving dynamics across 5 dedicated short-form video releases.",
    },
    {
      id: "kamrul-portfolio-web",
      slug: "kamrul-portfolio",
      type: "web",
      aspect: "large",
      title: "Kamrul Islam | Portfolio",
      category: "Personal Brand • Web Architecture",
      client: "Kamrul Islam",
      year: "2026",
      description:
        "High-performance editorial portfolio engineered with Next.js, Framer Motion, and Supabase integration.",
      thumbnail: "/images/aurexa/aurexa-project-1.png",
      githubUrl: "https://github.com/kamru1i/portfolio",
      liveUrl: "https://kamrulislam-bd.vercel.app/",
      canEmbed: true,
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      published: true,
      order: 1,
      publishedAt: "2026-03-15T10:00:00Z",
      role: "Full-Stack Engineer & UI Architect",
      tools: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
      deliverables: ["Production Web Application", "Curtain Scroll Physics", "Supabase Backend Integration"],
      overview: "Personal portfolio website crafted with precision editorial typography, dark mode aesthetic, full responsive scaling, and an interactive CMS-driven project management layer.",
    },
    {
      id: "photocard-design-web",
      slug: "photocard-design",
      type: "web",
      aspect: "large",
      title: "Photocard Design",
      category: "Digital Product • Web App",
      client: "Photocard Studio",
      year: "2026",
      description:
        "Interactive photocard customization platform with dynamic layout tools and responsive canvas rendering.",
      thumbnail: "/images/aurexa/aurexa-project-2.png",
      githubUrl: "https://github.com/kamrul-islam-dev",
      liveUrl: "https://photocard-five.vercel.app/",
      canEmbed: false,
      previewMode: "fallback",
      tags: ["React.js", "Canvas API", "Tailwind CSS", "Vercel"],
      published: true,
      order: 2,
      publishedAt: "2026-03-14T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "HTML5 Canvas API", "Tailwind CSS", "Vercel"],
      deliverables: ["Interactive Canvas Studio", "Image Export Pipeline", "Responsive UI"],
      overview: "A lightweight web app allowing creators to personalize, filter, and export customized photographic cards with real-time browser preview.",
    },
    {
      id: "web-wing",
      slug: "web-wing-agency",
      type: "web",
      aspect: "large",
      title: "Web Wing",
      category: "Agency Platform • Full Stack",
      client: "Web Wing UK",
      year: "2026",
      description:
        "Digital agency platform featuring scalable design architecture, performance optimization, and client management.",
      thumbnail: "/images/aurexa/aurexa-project-3.png",
      liveUrl: "https://webwing.co.uk/",
      canEmbed: false,
      previewMode: "fallback",
      tags: ["Full Stack", "TypeScript", "Tailwind CSS", "Next.js"],
      published: true,
      order: 3,
      publishedAt: "2026-03-13T10:00:00Z",
      role: "Full-Stack Developer",
      tools: ["Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
      deliverables: ["Corporate Agency Showcase", "Lead Generation Pipeline", "Custom UI Components"],
      overview: "Commercial agency website built with high-speed Next.js page generation, modern typography, and structured service inquiries.",
    },
    {
      id: "japanese-master-chef",
      slug: "japanese-master-chef",
      type: "web",
      aspect: "large",
      title: "Japanese Master Chef",
      category: "Culinary Platform • Interactive UX",
      client: "Master Chef",
      year: "2026",
      description:
        "Interactive culinary showcase featuring traditional recipes, dynamic chef profiles, and custom ordering flow.",
      thumbnail: "/images/aurexa/aurexa-project-4.png",
      liveUrl: "https://japanese-master-chef.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase", "Tailwind CSS", "REST API"],
      published: true,
      order: 4,
      publishedAt: "2026-03-12T10:00:00Z",
      role: "Front-End Engineer",
      tools: ["React.js", "Firebase Auth", "Tailwind CSS", "REST API"],
      deliverables: ["Recipe Catalog", "Chef Profiles Showcase", "Firebase Backend Integration"],
      overview: "Interactive web app celebrating Japanese culinary culture with real-time recipe search, chef bio cards, and Firebase database synchronization.",
    },
    {
      id: "rhythmverse-dance",
      slug: "rhythmverse-dance-school",
      type: "web",
      aspect: "large",
      title: "RythmVerse Dance School",
      category: "Academy Platform • Booking System",
      client: "RythmVerse",
      year: "2026",
      description:
        "Comprehensive dance academy management portal featuring class bookings, student portals, and schedule calendars.",
      thumbnail: "/images/aurexa/aurexa-project-5.png",
      liveUrl: "https://rhythmverse-dance-school.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase Auth", "Tailwind CSS", "Express"],
      published: true,
      order: 5,
      publishedAt: "2026-03-11T10:00:00Z",
      role: "Full-Stack Web Developer",
      tools: ["React.js", "Firebase Auth", "Express.js", "Tailwind CSS"],
      deliverables: ["Class Booking Portal", "Student Dashboard", "Admin Class Management"],
      overview: "A student and instructor portal for dance academies, featuring class schedule enrollment, instructor profiles, and automated booking notifications.",
    },
    {
      id: "talent-hub",
      slug: "talent-hub",
      type: "web",
      aspect: "large",
      title: "Talent Hub",
      category: "Recruitment Portal • Career Management",
      client: "Talent Hub",
      year: "2026",
      description:
        "Modern job search and candidate pipeline platform engineered for rapid recruitment matches and resume tracking.",
      thumbnail: "/images/aurexa/aurexa-project-6.png",
      liveUrl: "https://talent-hub-assignment-09.netlify.app/",
      canEmbed: true,
      tags: ["React.js", "Tailwind CSS", "Netlify", "Job Engine"],
      published: true,
      order: 6,
      publishedAt: "2026-03-10T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Tailwind CSS", "Netlify", "JSON Data Engine"],
      deliverables: ["Job Search Filter Engine", "Application Tracker", "Responsive UI"],
      overview: "A career portal application with instant category filtering, job requirement breakdowns, and applicant submission workflows.",
    },
    {
      id: "babys-toy-out",
      slug: "babys-toy-out",
      type: "web",
      aspect: "large",
      title: "Baby's Toy Out",
      category: "E-Commerce • Marketplace",
      client: "Toy Out Ltd",
      year: "2026",
      description:
        "Full-featured toy marketplace web application with product listings, user authentication, and shopping cart management.",
      thumbnail: "/images/aurexa/aurexa-project-1.png",
      liveUrl: "https://toy-marketplace-assignment-11.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase", "Tailwind CSS", "MongoDB"],
      published: true,
      order: 7,
      publishedAt: "2026-03-09T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Firebase Auth", "MongoDB", "Tailwind CSS"],
      deliverables: ["Product Marketplace", "Seller Dashboard", "Authentication Engine"],
      overview: "E-commerce platform for curated children's toys, featuring user authentication, toy listings management, and category search.",
    },
    {
      id: "the-news-dragon",
      slug: "the-news-dragon",
      type: "web",
      aspect: "large",
      title: "The News Dragon",
      category: "Editorial • Media Platform",
      client: "News Dragon",
      year: "2026",
      description:
        "High-density responsive news portal featuring categorization by region, real-time article feeds, and reader authentication.",
      thumbnail: "/images/aurexa/aurexa-project-2.png",
      liveUrl: "https://the-news-dragon-client-8ae38.web.app/",
      canEmbed: true,
      tags: ["React.js", "Express.js", "Bootstrap", "Firebase"],
      published: true,
      order: 8,
      publishedAt: "2026-03-08T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Express.js", "Firebase Auth", "Bootstrap"],
      deliverables: ["Categorized News Feed", "Article Detail View", "Authentication Flow"],
      overview: "An online news publishing application with categorical news routing, breaking news marquees, and responsive reader layouts.",
    },
  ] as PortfolioProject[],

  manifesto: {
    statement:
      "I craft digital media and systems that balance precision, visual rhythm and resilience. Every video edit is approached with storytelling instinct, every line of code with architectural rigor, and every technical operation with dependable craftsmanship.",
    lines: [
      "I craft digital media and systems that balance precision, visual rhythm and resilience.",
      "Every video edit is approached with storytelling instinct, every line of code with architectural rigor,",
      "and every technical operation with dependable craftsmanship.",
    ],
    bio1Html: `Outside of work, I spend time <strong>exploring</strong> visual storytelling and emerging generative techniques that help me <strong>sharpen</strong> and <strong>evolve</strong>. Whether analyzing <strong>cinematic cuts</strong>, studying motion pacing, or refining <strong>AI workflows</strong>, I seek disciplines that bring <strong>depth</strong>. These experiments often become the <strong>inspiration</strong> behind every timeline I cut and every platform I deploy.`,
    bio2Html: `I <strong>believe</strong> great technical work begins with disciplined execution. <strong>Curiosity</strong>, <strong>precision</strong> and continuous <strong>learning</strong> shape the way I approach both <strong>creative post-production</strong> and <strong>IT infrastructure</strong>. Every project adds a new layer to my <strong>expertise</strong>, ensuring digital solutions that are <strong>reliable</strong>, <strong>timeless</strong>, and deeply <strong>valuable</strong> to the organizations that rely on them.`,
    ctaText: "Let's Talk",
    ctaHref: "/contact-us",
    portraitSrc: "/images/Kamrul I.png",
  },

  services: [
    {
      id: "video-editing",
      slug: "video-editing",
      href: "/services/video-editing",
      index: "01",
      category: "VIDEO EDITING",
      title: "Video Editing & Post-Production",
      headline:
        "Crafting high-impact cinematic edits, narrative rhythm, and platform-optimized video productions.",
      description:
        "Comprehensive post-production from raw footage assembly to sound design, noise cleanup, color grading, motion graphics, and multi-platform delivery.",
      introduction:
        "Transforming raw footage into polished, engaging, and purpose-driven video content. From cutting and sequencing to pacing, rhythm, audio synchronization, voice cleanup, color grading, motion graphics, and platform delivery, every edit is executed with narrative instinct and technical discipline.",
      bulletHighlights: [
        "/ Storytelling & Narrative Flow",
        "/ Noise Reduction & Audio Enhancement",
        "/ Motion Graphics & Color Grading",
        "/ Multi-Platform Social Optimization",
      ],
      capabilities: [
        {
          title: "Storytelling & Narrative Flow",
          description:
            "Structuring footage with purposeful rhythm, pacing, timing, and narrative continuity tailored to target audiences and brand voice.",
        },
        {
          title: "Audio Editing & Voice Cleanup",
          description:
            "Precision noise reduction, sound synchronization, audio enhancement, volume balancing, SFX integration, and dialogue clarity.",
        },
        {
          title: "Color Correction & Color Grading",
          description:
            "Balancing exposure, contrast, tone matching, and creating cinematic grades for compelling visual mood and consistency.",
        },
        {
          title: "Motion Graphics & Animated Text",
          description:
            "Designing dynamic titles, lower thirds, callouts, text overlays, kinetic typography, and graphic compositing.",
        },
        {
          title: "Visual Effects & Compositing",
          description:
            "Keyframing, masking, compositing, aspect-ratio reframing, speed ramping, and visual cleanup for polished productions.",
        },
        {
          title: "Social Media Video Optimization",
          description:
            "Formatting for vertical reels, shorts, landscape broadcasts, high-CTR thumbnail creation, and platform-specific exports.",
        },
      ],
      tools: [
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "DaVinci Resolve",
        "CapCut",
        "Final Cut Pro",
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe Podcast",
        "Audacity",
      ],
      workflow: [
        {
          step: "01",
          title: "Ingestion & Narrative Assembly",
          description:
            "Reviewing raw footage, selecting hero takes, and building the fundamental story arc and timeline pacing.",
        },
        {
          step: "02",
          title: "Audio Surgery & Sound Design",
          description:
            "Eliminating background noise, balancing levels, synchronizing multi-track audio, and layering SFX and music.",
        },
        {
          step: "03",
          title: "Color Grading & Visual Tone",
          description:
            "Matching shot exposures, correcting white balance, and crafting consistent chromatic mood and depth.",
        },
        {
          step: "04",
          title: "Motion Graphics & Kinetic Polish",
          description:
            "Integrating animated text, lower thirds, captions, custom graphics, and subtle visual transitions.",
        },
        {
          step: "05",
          title: "Mastering & Platform Delivery",
          description:
            "Final quality control, aspect-ratio formatting (9:16, 16:9, 1:1), and high-fidelity rendering.",
        },
      ],
      experience: [
        {
          role: "Video Editor",
          organization: "B&F Corporate",
          period: "1 Year",
          summary:
            "Led commercial video editing, post-production audio mixing, color grading, motion graphics, and social media publishing across corporate channels.",
        },
      ],
      projects: [
        {
          title: "Biqolpo",
          client: "Biqolpo",
          role: "AI-Assisted Video Editing & Content Creation",
          summary:
            "Visual storytelling, creative editing, AI-generated asset integration, and final content refinement.",
          image: "/images/work-1-biqolpo.png",
        },
        {
          title: "Syston Autos Ltd",
          client: "Syston Autos Ltd",
          role: "Social Media Video Editing",
          summary:
            "Short-form automotive promotional content, social-first editing, pacing, transitions, and platform delivery.",
          image: "/images/work-2-syston.png",
        },
        {
          title: "B&F Cars",
          client: "B&F Cars",
          role: "Automotive Promotional Content",
          summary:
            "Commercial vehicle showcases, short-form editing, visual presentation, and social media optimization.",
          image: "/images/work-5-bfcars.png",
        },
      ],
      images: [
        "/images/work-1-biqolpo.png",
        "/images/work-2-syston.png",
        "/images/work-5-bfcars.png",
      ],
      image: "/images/work-1-biqolpo.png",
    },
    {
      id: "ai-assisted-content",
      slug: "ai-assisted-content",
      href: "/services/ai-assisted-content",
      index: "02",
      category: "AI CONTENT CREATION",
      title: "AI-Assisted Content Creation",
      headline:
        "Augmenting creative workflows with advanced AI video synthesis, prompt engineering, and hybrid post-production refinement.",
      description:
        "End-to-end AI creative pipeline: concept generation, scriptwriting, scene planning, AI asset synthesis, and timeline integration.",
      introduction:
        "Leveraging cutting-edge generative AI models to conceptualize, generate, and assemble creative assets into polished productions. Combining algorithmic generation with manual editing rigor ensures that synthetic footage, scenes, voiceovers, and imagery meet strict narrative continuity and quality standards.",
      bulletHighlights: [
        "/ AI Video & Scene Generation",
        "/ Prompt-Based Creative Concepting",
        "/ Synthetic Voice & Audio Design",
        "/ Hybrid Asset Blending & Editing",
      ],
      capabilities: [
        {
          title: "AI Video & Scene Generation",
          description:
            "Prompt-based generation of realistic and stylistic scenes, character actions, and cinematic camera movements using state-of-the-art video models.",
        },
        {
          title: "AI Image & Asset Synthesis",
          description:
            "Generating tailored backgrounds, key visuals, textures, and bespoke creative assets for video compositing and digital platforms.",
        },
        {
          title: "Script Writing & Scene Planning",
          description:
            "Translating briefs into structured scripts, scene breakdowns, shot lists, and prompt architectures designed for generative models.",
        },
        {
          title: "AI Voiceover & Audio Synthesis",
          description:
            "Generating natural, expressive synthetic voiceovers, narration, and background elements, followed by audio cleanup and timing alignment.",
        },
        {
          title: "Hybrid Asset Blending & Editing",
          description:
            "Seamlessly merging AI-generated visuals with real-world footage, graphics, titles, and sound design in professional NLE timelines.",
        },
        {
          title: "Iterative Prompt Refinement",
          description:
            "Fine-tuning prompt structures, negative prompts, camera directives, and style tokens to maintain aesthetic consistency across scenes.",
        },
      ],
      tools: [
        "Gemini Omni Flash",
        "Google Veo",
        "ChatGPT Sora",
        "Kling 3.0",
        "Google Nano Banana",
        "ChatGPT Image 2",
        "Higgsfield Soul",
        "Kling",
        "Adobe Premiere Pro",
        "CapCut",
      ],
      workflow: [
        {
          step: "01",
          title: "Creative Concept & Story Direction",
          description:
            "Defining the creative vision, target tone, narrative arc, and selecting appropriate generative models.",
        },
        {
          step: "02",
          title: "Script & Prompt Architecture",
          description:
            "Writing scene-by-scene scripts, camera instructions, lighting directives, and prompt matrices.",
        },
        {
          step: "03",
          title: "Generative Asset Synthesis",
          description:
            "Executing multi-pass generation of video sequences, keyframe imagery, and synthetic voiceovers.",
        },
        {
          step: "04",
          title: "Timeline Integration & Assembly",
          description:
            "Ingesting synthetic assets into NLE software, cutting to rhythm, and harmonizing colors across shots.",
        },
        {
          step: "05",
          title: "Post-Processing & Quality Polish",
          description:
            "Applying audio enhancement, title cards, motion blur, and final platform encoding.",
        },
      ],
      experience: [
        {
          role: "AI-Assisted Video Editor & Content Creator",
          organization: "B&F Corporate & Client Engagements",
          period: "1+ Years",
          summary:
            "Developed AI-assisted video workflows, prompt engineering systems, and blended synthetic scenes with commercial footage.",
        },
      ],
      projects: [
        {
          title: "Biqolpo AI Production",
          client: "Biqolpo",
          role: "AI-Assisted Content Production",
          summary:
            "Generative video workflows, prompt design, AI asset integration, and timeline narrative assembly.",
          image: "/images/hero-card-1.png",
        },
        {
          title: "Visual Narrative Concepting",
          client: "Creative Experiments",
          role: "Concept & Asset Synthesis",
          summary:
            "Exploration of hybrid AI visual techniques, motion consistency, and prompt-driven scene composition.",
          image: "/images/hero-card-2.png",
        },
      ],
      images: [
        "/images/hero-card-1.png",
        "/images/hero-card-2.png",
        "/images/work-4-it.png",
      ],
      image: "/images/hero-card-1.png",
    },
    {
      id: "web-development",
      slug: "web-development",
      href: "/services/web-development",
      index: "03",
      category: "WEB DEVELOPMENT",
      title: "Web Development",
      headline:
        "Engineering performant, responsive web applications, modern React ecosystems, and tailored WordPress platforms.",
      description:
        "Modern front-end and full-stack development with React, Next.js, TypeScript, Tailwind CSS, Node.js, and dedicated WordPress/Elementor capabilities.",
      introduction:
        "Building modern, fast, and accessible digital products from responsive single-page web apps to scalable full-stack platforms and customizable CMS websites. Bridging design vision with clean, modular code, robust backend integration, and dependable deployment pipelines.",
      bulletHighlights: [
        "/ React.js, Next.js & TypeScript",
        "/ Modern Tailwind CSS Architecture",
        "/ Full-Stack MERN & REST APIs",
        "/ WordPress & Elementor Pro Customization",
      ],
      capabilities: [
        {
          title: "Front-End Engineering",
          description:
            "Developing responsive interfaces using HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, and TypeScript with clean modular architecture.",
        },
        {
          title: "Modern UI Styling & Design Systems",
          description:
            "Crafting responsive design systems with Tailwind CSS, Shadcn/UI, DaisyUI, and Bootstrap with faithful Figma-to-interface translation.",
        },
        {
          title: "Full-Stack & REST API Integration",
          description:
            "Connecting front-ends to Node.js, Express.js, MongoDB, Supabase (PostgreSQL), Firebase, and secure RESTful endpoints with JWT authentication.",
        },
        {
          title: "WordPress & Elementor Development",
          description:
            "Building, customizing, and maintaining WordPress sites using Elementor & Elementor Pro, bespoke child themes, and tailored plugins.",
        },
        {
          title: "CMS Maintenance & Security Hardening",
          description:
            "Routine plugin updates, file/database backup routines, performance caching, malware cleanup, and basic WordPress security maintenance.",
        },
        {
          title: "Deployment & Version Control",
          description:
            "Deploying production apps on Vercel and Netlify, collaborative Git/GitHub branching workflows, and cPanel/GoDaddy hosting administration.",
        },
      ],
      tools: [
        "React.js",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6)",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Supabase",
        "WordPress",
        "Elementor Pro",
        "Git / GitHub",
        "Vercel",
        "Figma",
      ],
      workflow: [
        {
          step: "01",
          title: "Architecture & Requirement Scoping",
          description:
            "Analyzing functional requirements, data models, UI component hierarchies, and hosting infrastructure.",
        },
        {
          step: "02",
          title: "UI Implementation & Component Building",
          description:
            "Translating design mockups into modular, accessible, responsive React components with Tailwind CSS.",
        },
        {
          step: "03",
          title: "Backend & API Integration",
          description:
            "Connecting state management, form validation, dynamic data endpoints, and authentication tokens.",
        },
        {
          step: "04",
          title: "Testing, Cross-Browser QA & Optimization",
          description:
            "Auditing responsive breakpoints, optimizing asset loading, and verifying cross-browser performance.",
        },
        {
          step: "05",
          title: "CI/CD Deployment & Domain Setup",
          description:
            "Deploying on Vercel/Netlify or cPanel, configuring SSL/DNS records, and establishing maintenance schedules.",
        },
      ],
      experience: [
        {
          role: "Front-End Developer",
          organization: "Velocity Digital Inc.",
          period: "1.5 Years",
          summary:
            "Built responsive web applications, converted Figma designs into reusable React components, and integrated REST APIs.",
        },
        {
          role: "WordPress Developer",
          organization: "JobMatchingBD.com",
          period: "1 Year",
          summary:
            "Maintained corporate job portal, managed listings, resolved functional bugs, and optimized WordPress speed and plugin compatibility.",
        },
        {
          role: "Web Development & Management",
          organization: "B&F Corporate",
          period: "2 Years",
          summary:
            "Developed new web platforms, managed company domains, hosting, SSL certificates, and cPanel Webmail systems.",
        },
      ],
      projects: [
        {
          title: "Enterprise Web Platforms",
          client: "B&F Corporate & Velocity Digital",
          role: "Front-End & Full-Stack Development",
          summary:
            "Responsive web applications, component engineering, performance tuning, and CMS architecture.",
          image: "/images/work-3-web.png",
        },
        {
          title: "Job Portal Platform",
          client: "JobMatchingBD.com",
          role: "WordPress Developer",
          summary:
            "Custom WordPress development, listing automation, performance optimization, and routine maintenance.",
          image: "/images/hero-card-4.png",
        },
      ],
      images: [
        "/images/work-3-web.png",
        "/images/hero-card-4.png",
        "/images/hero-card-5.png",
      ],
      image: "/images/work-3-web.png",
    },
    {
      id: "it-support",
      slug: "it-support",
      href: "/services/it-support",
      index: "04",
      category: "IT INFRASTRUCTURE",
      title: "IT Support & Digital Infrastructure",
      headline:
        "Delivering dependable workstation maintenance, secure network environments, hosting management, and CCTV monitoring.",
      description:
        "End-to-end technical support: Windows & hardware troubleshooting, network & VPN configuration, cPanel hosting, DNS & SSL lifecycle, and CCTV systems.",
      introduction:
        "Providing reliable technical operations and digital infrastructure support for businesses. From hardware diagnostics, Windows OS configuration, and Outlook mail troubleshooting to cPanel hosting maintenance, domain DNS resolution, SSL lifecycle, and CCTV surveillance monitoring.",
      bulletHighlights: [
        "/ Office PC & Hardware Troubleshooting",
        "/ Network, Wi-Fi & VPN Management",
        "/ cPanel, DNS, SSL & Webmail Hosting",
        "/ CCTV Camera Setup & Security Monitoring",
      ],
      capabilities: [
        {
          title: "Workstation & OS Support",
          description:
            "Windows setup, installation, driver configuration, system optimization, software licensing, and hardware diagnostics.",
        },
        {
          title: "Office 365 & Outlook Management",
          description:
            "Configuring employee email accounts, Outlook data file synchronization, troubleshooting email delivery, and user support.",
        },
        {
          title: "Network, LAN & VPN Administration",
          description:
            "Setting up office Wi-Fi, Ethernet cabling, router configuration, LAN troubleshooting, and secure remote VPN access.",
        },
        {
          title: "Web Hosting, DNS & SSL Management",
          description:
            "cPanel and GoDaddy administration, DNS records (A, MX, CNAME, TXT), SSL certificate provisioning, and hosting renewals.",
        },
        {
          title: "Website Security & Malware Scanning",
          description:
            "Routine malware scans, website cleanup, vulnerability assessment, form testing, and availability monitoring.",
        },
        {
          title: "CCTV Setup & Monitoring",
          description:
            "Basic security camera installation, DVR/NVR configuration, remote video feeds, footage archiving, and monitoring.",
        },
      ],
      tools: [
        "Windows OS",
        "Microsoft Outlook",
        "Office 365",
        "cPanel",
        "GoDaddy",
        "DNS & SSL",
        "VPN Clients",
        "CCTV Systems",
        "LAN / Wi-Fi Tools",
        "Data Backup Tools",
      ],
      workflow: [
        {
          step: "01",
          title: "Issue Intake & Diagnostics",
          description:
            "Logging technical issue reports, assessing hardware/software status, and prioritizing resolution severity.",
        },
        {
          step: "02",
          title: "Troubleshooting & Root Cause Isolation",
          description:
            "Testing network routes, driver conflicts, OS logs, DNS propagation, or hardware failures.",
        },
        {
          step: "03",
          title: "Configuration & Implementation",
          description:
            "Applying system updates, reinstalling software, configuring Outlook/VPN, or replacing physical components.",
        },
        {
          step: "04",
          title: "Verification & Connectivity Testing",
          description:
            "Confirming email delivery, network throughput, SSL validity, and system stability under user workflow.",
        },
        {
          step: "05",
          title: "Documentation & Preventative Maintenance",
          description:
            "Recording incident resolutions, scheduling automated backups, and updating hardware maintenance logs.",
        },
      ],
      experience: [
        {
          role: "Assistant IT Manager",
          organization: "B&F Corporate",
          period: "2 Years (Promoted from IT Executive)",
          summary:
            "Managed office IT technical operations, employee workstations, VPN access, website hosting, cPanel Webmail, and CCTV systems.",
        },
        {
          role: "Technical Customer Support",
          organization: "Robi Helpline & Banglalink Helpline",
          period: "4 Years",
          summary:
            "Diagnosed customer technical issues, internet/network escalations, and CRM case tracking.",
        },
      ],
      projects: [
        {
          title: "Enterprise IT & Hosting Operations",
          client: "B&F Corporate",
          role: "Assistant IT Manager",
          summary:
            "Workstation fleet maintenance, domain renewals, cPanel hosting, SSL installations, and CCTV surveillance.",
          image: "/images/work-4-it.png",
        },
      ],
      images: [
        "/images/work-4-it.png",
        "/images/hero-card-3.png",
        "/images/work-1-biqolpo.png",
      ],
      image: "/images/work-4-it.png",
    },
  ] as ServiceItem[],

  milestones: [
    {
      year: "2026",
      organization: "B&F Corporate",
      role: "Assistant IT Manager",
      highlight: "Promoted after 1 year of service · Leading digital infrastructure, enterprise web & IT operations",
      slug: "bf-corporate-assistant-it-manager",
      type: "experience",
      period: "2 Years — Present (Joined as IT Executive, Promoted after 1 year)",
      details: {
        overview:
          "Overseeing enterprise digital infrastructure, corporate web management, domain/hosting architecture, workstation security, employee IT technical operations, and creative documentation across B&F Corporate.",
        responsibilities: [
          "Monitor, troubleshoot, and maintain company websites to ensure proper functionality, 24/7 availability, and optimal performance.",
          "Test website interactive forms and verify successful submission and delivery through cPanel Webmail.",
          "Perform malware scanning, threat detection, removal, and proactive website security hardening.",
          "Manage DNS configurations (A, MX, CNAME, TXT records) and ensure seamless domain resolution.",
          "Monitor SSL certificates, install TLS certificates, and enforce HTTPS security protocols.",
          "Monitor domain and hosting expiration dates and manage timely renewals across cPanel and GoDaddy.",
          "Develop new websites according to specific business requirements and organizational needs.",
          "Manage cPanel and cPanel Webmail access, including credential provisioning and password updates.",
          "Troubleshoot and resolve hardware, software, operating system, and general technical issues on office PCs.",
          "Install, configure, and activate Microsoft Office applications and troubleshoot Microsoft Outlook email, file synchronization, and access issues.",
          "Manage employee VPN access, including account provisioning, setup, troubleshooting, and license renewal management.",
          "Troubleshoot and resolve internet, LAN, and Wi-Fi connectivity issues affecting office users.",
          "Manage office printers and provide day-to-day printing support for official documentation.",
          "Create and edit visual materials using Adobe Photoshop and Illustrator, including company logos, ID cards, lanyards, posters, and banners.",
        ],
        tools: [
          "cPanel",
          "GoDaddy",
          "DNS & SSL Management",
          "Windows OS",
          "Microsoft Outlook",
          "Office 365",
          "VPN Clients",
          "CCTV Systems",
          "Adobe Photoshop",
          "Adobe Illustrator",
        ],
        achievements: [
          "Promoted from IT Executive to Assistant IT Manager within 1 year in recognition of operational dependability.",
          "Maintained 99.9% uptime across corporate web properties, email servers, and network connectivity.",
          "Streamlined office technical onboarding with automated VPN and Outlook configuration profiles.",
        ],
      },
    },
    {
      year: "2025",
      organization: "B&F Corporate",
      role: "Video Editor",
      highlight: "Commercial video post-production, narrative pacing, audio sweetening & AI workflows",
      slug: "bf-corporate-video-editor",
      type: "experience",
      period: "1 Year — Present",
      details: {
        overview:
          "Executing end-to-end video editing and post-production for corporate branding, automotive showcases, and social media campaigns, combining cinematic editing instinct with cutting-edge AI-assisted generation.",
        responsibilities: [
          "Edit and assemble raw footage into polished, engaging, and purpose-driven video content.",
          "Perform precision cutting, trimming, sequencing, transitions, and scene arrangement according to narrative flow.",
          "Develop compelling edits through disciplined storytelling, rhythm, timing, and audience-tailored pacing.",
          "Adapt visual styles and presentation according to content type, target demographics, and platform specifications.",
          "Integrate footage, graphics, images, music tracks, voiceovers, and sound effects into cohesive productions.",
          "Perform audio editing, noise cancellation, noise reduction, audio enhancement, voice cleanup, synchronization, volume balancing, and sound mixing.",
          "Perform color correction and color grading to balance exposure, contrast, shot-to-shot consistency, tone, and visual mood.",
          "Design and animate motion graphics, kinetic titles, lower thirds, callouts, overlays, and visual effects.",
          "Develop creative concepts, scripts, scene structures, and prompt architectures for AI-assisted video production.",
          "Generate AI-based video scenes, images, backgrounds, and voiceovers using Google Veo, ChatGPT Sora, and Kling 3.0.",
          "Manage social media video publishing, curate high-CTR thumbnails, and optimize aspect ratios (9:16 vertical, 16:9 widescreen).",
        ],
        tools: [
          "Adobe Premiere Pro",
          "Adobe After Effects",
          "DaVinci Resolve",
          "CapCut",
          "Final Cut Pro",
          "Adobe Photoshop",
          "Adobe Illustrator",
          "Adobe Podcast",
          "Audacity",
          "Google Veo",
          "ChatGPT Sora",
          "Kling 3.0",
        ],
        achievements: [
          "Produced high-impact commercial promotional videos for automotive clients including Syston Autos Ltd and B&F Cars.",
          "Integrated generative AI pipelines to accelerate concept visualization and synthetic B-roll synthesis.",
        ],
      },
    },
    {
      year: "2024",
      organization: "Velocity Digital Inc.",
      role: "Front-End Developer",
      highlight: "Component-driven React.js web interfaces, Figma conversion, Tailwind styling",
      slug: "velocity-digital-frontend-developer",
      type: "experience",
      period: "1.5 Years",
      details: {
        overview:
          "Developed modern, responsive, and component-driven web interfaces using React.js and modern styling ecosystems, translating high-fidelity Figma designs into production-ready web applications.",
        responsibilities: [
          "Develop responsive and user-friendly web interfaces based on project requirements and design specifications.",
          "Build modern web pages and interactive interfaces using HTML5, CSS3, JavaScript (ES6+), and React.js.",
          "Implement responsive layouts and consistent user experiences across desktop, tablet, and mobile screens.",
          "Convert UI/UX and Figma designs into functional, reusable, and responsive front-end components.",
          "Develop reusable component libraries and maintain structured, modular, and maintainable front-end codebases.",
          "Implement modern UI styling using Tailwind CSS, Bootstrap, DaisyUI, and Shadcn/UI.",
          "Integrate front-end interfaces with REST APIs and back-end services with comprehensive error handling.",
          "Handle client-side forms, input validation, user interactions, dynamic content, and client routing.",
          "Optimize websites and web applications for performance, usability, responsiveness, and cross-browser compatibility.",
          "Perform testing, debugging, and code reviews using browser developer tools and Git/GitHub collaborative workflows.",
        ],
        tools: [
          "React.js",
          "JavaScript (ES6)",
          "HTML5 & CSS3",
          "Tailwind CSS",
          "Bootstrap",
          "DaisyUI",
          "Shadcn/UI",
          "REST APIs",
          "Git / GitHub",
          "Figma",
          "VS Code",
        ],
        achievements: [
          "Delivered multiple client web applications with 100% responsive fidelity across desktop, tablet, and mobile.",
          "Accelerated development velocity by creating modular component design systems with Tailwind CSS.",
        ],
      },
    },
    {
      year: "2023",
      organization: "JobMatchingBD.com",
      role: "WordPress Developer",
      highlight: "Job portal administration, Elementor development, plugins and security maintenance",
      slug: "jobmatchingbd-wordpress-developer",
      type: "experience",
      period: "1 Year — Internship & Full-Time",
      details: {
        overview:
          "Managed, customized, and maintained the company’s WordPress-based recruitment portal, ensuring high availability, continuous listing updates, and robust security practices.",
        responsibilities: [
          "Managed and maintained the company’s WordPress-based job portal website.",
          "Published, updated, and managed job listings and other website content through WordPress.",
          "Conducted daily website checks to identify and resolve functional, content, and technical issues.",
          "Managed routine WordPress maintenance, plugin updates, and compatibility-related issues.",
          "Kept the website updated with relevant WordPress technologies, features, and maintenance practices.",
          "Performed ongoing website updates, troubleshooting, Elementor customizations, and general WordPress administration.",
        ],
        tools: [
          "WordPress",
          "Elementor",
          "Elementor Pro",
          "cPanel",
          "GoDaddy",
          "PHP",
          "MySQL",
        ],
        achievements: [
          "Maintained smooth operations for thousands of active job listings and employer postings.",
          "Protected platform stability through proactive plugin audits, database optimizations, and regular backups.",
        ],
      },
    },
    {
      year: "2021",
      organization: "Port City International University",
      role: "BSc in Computer Science & Engineering",
      highlight: "Major in Web Development · Deep grounding in software architecture and algorithms",
      slug: "bsc-cse",
      type: "education",
      period: "Graduated: 2021",
      details: {
        institution: "Port City International University",
        department: "Natural Science",
        subject: "Computer Science & Engineering",
        major: "Web Development",
        passingYear: "2021",
        overview:
          "Completed Bachelor of Science program in Computer Science & Engineering with a focused major in Web Development, gaining rigorous grounding in software engineering, algorithms, database systems, and web architecture.",
        coursework: [
          "Web Development & Distributed Systems",
          "Data Structures & Algorithm Design",
          "Object-Oriented Programming (OOP)",
          "Database Management Systems (RDBMS & SQL)",
          "Computer Networks, Protocols & Security",
          "Software Engineering & System Analysis",
        ],
        achievements: [
          "Specialized in modern web technologies, building scalable web platforms as final academic deliverables.",
          "Gained deep theoretical and practical mastery of computational problem-solving and software architecture.",
        ],
      },
    },
    {
      year: "2020",
      organization: "Robi & Banglalink Helplines",
      role: "Customer Service & Technical Support",
      highlight: "High-volume technical issue resolution, CRM management, customer satisfaction excellence",
      slug: "robi-banglalink-customer-service",
      type: "experience",
      period: "4 Years Combined Experience",
      details: {
        overview:
          "Delivered professional technical support and customer relationship management across two leading telecom networks, diagnosing service disruptions and resolving complex customer queries.",
        responsibilities: [
          "Handled incoming customer calls, listening attentively to user concerns, service requests, and technical issues.",
          "Identified customer needs and provided accurate and appropriate solutions based on reported issues.",
          "Managed customer accounts, service-related cases, and technical details through enterprise CRM interfaces.",
          "Escalated network, internet, data package, and connectivity issues to backend technical engineering teams.",
          "Maintained a solution-oriented, customer-focused approach when managing challenging requests.",
          "Promoted relevant telecom products and services, performing eligible upselling based on customer usage.",
          "Prepared daily operational and performance reports, maintaining accurate technical logs.",
          "Maintained continuous familiarity with the latest telecom packages, network policies, and system updates.",
        ],
        tools: ["Telecom CRM Software", "Technical Ticketing Portals", "Network Status Dashboard", "Performance Reporting Tools"],
        achievements: [
          "Consistently achieved top-tier First Call Resolution (FCR) and customer satisfaction scores over 4 years.",
          "Recognized for empathetic communication, rapid diagnostics, and dependable problem resolution.",
        ],
      },
    },
    {
      year: "2018",
      organization: "Pizza Hut",
      role: "Customer Service Representative & Server",
      highlight: "Dine-in, takeaway, POS, Foodpanda order processing, daily sales & inventory reporting",
      slug: "pizza-hut-customer-service",
      type: "experience",
      period: "2 Years Combined Experience",
      details: {
        overview:
          "Managed front-of-house customer relations, order processing, POS payments, online food delivery channels (Foodpanda), inventory reconciliation, and restaurant hygiene standards.",
        responsibilities: [
          "Warmly greeted customers and provided welcoming, professional dine-in and takeaway service.",
          "Determined customer requirements, answered menu questions, and processed orders accurately through the POS system.",
          "Managed Foodpanda online orders: confirmation, preparation synchronization, and courier dispatch.",
          "Coordinated food service sequence, monitored guest satisfaction, and handled billings and payments accurately.",
          "Prepared and submitted daily sales and cash reconciliation reports.",
          "Conducted weekly and monthly inventory audits, reconciled stock levels, and submitted verified reports to management.",
          "Maintained high standards of dining room hygiene, bar setup, and food safety regulations.",
        ],
        tools: ["POS System", "Foodpanda Merchant Portal", "Inventory Tracking Spreadsheets", "Cash Reconciliation Systems"],
        achievements: [
          "Maintained 100% billing and inventory accuracy across peak service shifts.",
          "Successfully coordinated high-volume delivery operations with zero dispatch delays.",
        ],
      },
    },
    {
      year: "2015",
      organization: "Sitakund University College",
      role: "Higher Secondary Certificate (HSC) — Science",
      highlight: "Chittagong Board · Passing Year: 2015 · GPA: 3.50 (Out of 5.00)",
      slug: "hsc",
      type: "education",
      period: "2015",
      details: {
        institution: "Sitakund University College",
        group: "Science",
        board: "Chittagong",
        passingYear: "2015",
        gpa: "3.50 (Out of 5.00)",
        overview:
          "Completed Higher Secondary Certificate (HSC) education in the Science stream under the Board of Intermediate and Secondary Education, Chittagong, developing foundational expertise in physics, chemistry, higher mathematics, and scientific methodology.",
        coursework: ["Physics", "Chemistry", "Higher Mathematics", "Biology", "English", "Bangla"],
        achievements: [
          "Successfully earned Higher Secondary Certificate (HSC) in Science under Chittagong Education Board.",
          "Built solid analytical and mathematical foundations preparing for higher studies in Computer Science & Engineering.",
        ],
      },
    },
    {
      year: "2013",
      organization: "Mahamudabad High School",
      role: "Secondary School Certificate (SSC) — Science",
      highlight: "Chittagong Board · Passing Year: 2013 · GPA: 4.81 (Out of 5.00) with Distinction",
      slug: "ssc",
      type: "education",
      period: "2013",
      details: {
        institution: "Mahamudabad High School",
        group: "Science",
        board: "Chittagong",
        passingYear: "2013",
        gpa: "4.81 (Out of 5.00)",
        overview:
          "Completed Secondary School Certificate (SSC) with distinction in the Science stream under the Board of Intermediate and Secondary Education, Chittagong, achieving an outstanding GPA of 4.81 out of 5.00.",
        coursework: ["General Science", "Physics", "Chemistry", "General Mathematics", "Higher Mathematics", "English", "Bangla"],
        achievements: [
          "Graduated with distinction with a GPA of 4.81 out of 5.00.",
          "Consistently ranked near the top of the graduating Science cohort.",
        ],
      },
    },
  ] as MilestoneItem[],

  counters: [
    { target: 18, suffix: "+", label: "Published Video Projects" },
    { target: 5, suffix: "+", label: "Years in IT & Operations" },
    { target: 100, suffix: "%", label: "Project Delivery Rate" },
  ] as StatItem[],

  faq: {
    badge: "FAQ",
    title: "Have Questions?",
    subtitle:
      "Direct insights into my post-production pipeline, technical toolchains, AI workflows, and project collaboration.",
    contactCard: {
      name: "Talk with Kamrul",
      role: "Lead Video Editor, Web Developer & IT Specialist",
      ctaText: "Get in touch",
      ctaHref: "/contact-us",
      email: "inquiry.kamrul@gmail.com",
      status: "Available for select freelance & full-time roles",
      avatarSrc: "/images/Kamrul I.png",
    },
    items: [
      {
        id: "faq-video-editing",
        question: "What types of video editing can you handle?",
        answer:
          "I specialize in end-to-end commercial and brand video editing, including promotional reels, corporate overviews, automotive showcase videos, social-first short-form content, and documentary-style narratives. My editing workflow covers pacing, narrative cuts, dynamic motion graphics, color grading, sound design, and custom title integration.",
      },
      {
        id: "faq-audio-enhancement",
        question: "Do you provide audio enhancement and noise reduction?",
        answer:
          "Yes. Clean, balanced audio is an integral part of my post-production workflow. I handle dialogue isolation, background noise reduction, vocal clarity EQ, ambient sound staging, and loudness normalization across YouTube, broadcast, and social delivery standards using Adobe Audition and DaVinci Resolve Fairlight.",
      },
      {
        id: "faq-ai-content",
        question: "Can you create AI-assisted video and visual content?",
        answer:
          "Yes. I integrate state-of-the-art generative tools—including Runway, Midjourney, and ElevenLabs—to produce synthetic B-roll, concept storyboards, photorealistic environments, and specialized voiceovers, blending them seamlessly with traditional cinematic footage.",
      },
      {
        id: "faq-social-media",
        question: "Can you prepare videos for social media platforms?",
        answer:
          "Absolutely. I deliver platform-optimized edits tailored for TikTok, Instagram Reels, YouTube Shorts (9:16 vertical), and standard widescreen YouTube (16:9). This includes high-retention pacing, engaging captions, animated lower thirds, and custom thumbnail curation.",
      },
      {
        id: "faq-web-dev",
        question: "What web development technologies do you work with?",
        answer:
          "My core front-end stack is React, Next.js, TypeScript, and Tailwind CSS. Backed by a BSc in Computer Science & Engineering, I build responsive, component-driven web applications and portfolios with smooth Framer Motion interactions and solid SEO architecture.",
      },
      {
        id: "faq-wordpress",
        question: "Do you also work with WordPress websites?",
        answer:
          "Yes. I have professional experience managing and building custom WordPress installations, including Elementor-based layouts, child theme development, plugin configuration, database optimization, and secure domain/hosting migrations.",
      },
      {
        id: "faq-it-support",
        question: "What kind of IT support can you provide?",
        answer:
          "With 5+ years across corporate IT management and customer technical support, I manage enterprise DNS records, SSL certificates, business email infrastructure (Google Workspace/cPanel), cloud backups, system maintenance, and workstation troubleshooting.",
      },
      {
        id: "faq-end-to-end",
        question: "Can you work on a project from concept to final delivery?",
        answer:
          "Yes. I frequently manage end-to-end productions—from initial briefing, script breakdown, and visual storyboarding to asset collection, rough assembly cuts, audio mastering, revision rounds, and final export delivery across multiple formats.",
      },
      {
        id: "faq-footage-ai",
        question: "Can you work with existing footage as well as AI-generated assets?",
        answer:
          "Yes. Many of my projects involve taking raw client-provided camera footage or screen captures and elevating them with generative backgrounds, AI-enhanced audio, kinetic typography, and motion overlays to achieve a cohesive, high-budget aesthetic.",
      },
      {
        id: "faq-focus",
        question: "What kind of projects are you most focused on?",
        answer:
          "My primary focus is on high-impact video editing, commercial brand storytelling, and interactive digital experiences that combine creative post-production with modern front-end engineering.",
      },
    ] as FaqItem[],
  },

  footer: {
    navLinks: [
      { label: "WORK", href: "#works" },
      { label: "ABOUT", href: "#about" },
      { label: "EXPERTISE", href: "#expertise" },
      { label: "CONTACT", href: "/contact-us" },
    ],
    copyright: "© 2026 Kamrul Islam. All rights reserved.",
    locationNote: "Based in Chittagong, Bangladesh · Available Worldwide",
  },
};
