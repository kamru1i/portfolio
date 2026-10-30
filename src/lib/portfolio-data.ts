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
  id?: string;
  year: string;
  organization: string;
  role: string;
  highlight: string;
  slug: string;
  type: "experience" | "education";
  period?: string;
  order?: number;
  details?: {
    overview?: string;
    responsibilities?: string[];
    achievements?: string[];
    tools?: string[];
    skills?: string[];
    institution?: string;
    board?: string;
    authority?: string;
    group?: string;
    fieldOfStudy?: string;
    gpa?: string;
    result?: string;
    grade?: string;
    passingYear?: string;
    department?: string;
    subject?: string;
    major?: string;
    degree?: string;
    qualificationName?: string;
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
    domain: "kamrulislam.me",
    title: "Video Editor | AI Content Creator | Web Developer | IT Professional",
    location: "Chittagong, Bangladesh",
    timezone: "Asia/Dhaka", // UTC+6
    email: "hello@kamrulislam.me",
    phone: "(+880) 1839 00 6867",
    whatsapp: "(+880) 1839 00 6867",
    whatsappUrl: "https://wa.me/8801839006867",
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
      year: "",
      discipline: "ai",
      summary:
        "End-to-end AI video production, prompt engineering, scene composition, and post-production refinement using Google Veo, ChatGPT Sora, Kling 3.0, and DaVinci Resolve.",
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
      year: "",
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
      year: "",
      discipline: "web",
      summary:
        "Modular, component-driven web interfaces built in React.js, Tailwind CSS, and JavaScript (ES6) with responsive layouts and REST API integrations.",
      aspect: "large",
      colSpan: "col-span-12 md:col-span-8 md:col-start-3",
      image: "/images/work-3-web.png",
      tags: ["React.js", "JavaScript (ES6)", "Tailwind CSS", "REST APIs"],
      links: [{ label: "View Architecture", url: "#" }],
    },
    {
      id: "bf-corporate-infra",
      title: "B&F Corporate Infrastructure",
      category: "IT Operations & Website Management",
      client: "B&F Corporate",
      year: "",
      discipline: "it",
      summary:
        "Multi-domain web hosting administration, DNS/SSL management, cPanel Webmail and Outlook support, VPN setup, malware cleanup, and office IT operations.",
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
      year: "",
      discipline: "video",
      summary:
        "Fast-paced promotional video series focused on vehicular presentation, crisp transitions, motion graphics badges, and multi-platform optimization.",
      aspect: "small",
      colSpan: "col-span-12 md:col-span-4",
      image: "/images/work-5-bfcars.png",
      tags: ["CapCut", "Premiere Pro", "Motion Graphics", "Social Format"],
      links: [
        { label: "Video 01", url: "#" },
        { label: "Video 02", url: "#" },
        { label: "Video 03", url: "#" },
      ],
    },
  ] as ProjectItem[],

  // Future-proof, typed project model separating data from presentation (aligned with verified production Supabase records)
  showcaseProjects: [
    {
      id: "youtube-video-1",
      slug: "capcut-professional-video-editing-worthy",
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
      tags: ["CapCut", "Premiere Pro", "Workflow Analysis", "Motion"],
      published: true,
      order: 1,
      publishedAt: "2026-03-15T12:00:00Z",
      role: "Producer, Editor & Technical Analyst",
      tools: ["CapCut", "Adobe Premiere Pro", "Adobe Photoshop"],
      deliverables: ["16:9 Full Breakdown Video", "Comparative Benchmarks", "Custom Graphic Overlays"],
      overview: "A comprehensive deep dive comparing CapCut against industry NLEs. Explores real-world playback performance, export speed, auto-caption accuracy, and post-production bottlenecks.",
    },
    {
      id: "youtube-video-2",
      slug: "Microplastic-BioBag-Kamrul-I",
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
      order: 2,
      publishedAt: "2026-03-14T12:00:00Z",
      role: "Documentary Editor & Colorist",
      tools: ["DaVinci Resolve", "Adobe Podcast", "Adobe Premiere Pro"],
      deliverables: ["16:9 Cinematic Video Essay", "Voice Cleanup & Restoration", "Color Palette Grading"],
      overview: "A documentary raising environmental awareness about plastic pollution life cycles. Emphasizes atmospheric audio design, organic pacing, and rich film-like color curves.",
    },
    {
      id: "youtube-video-3",
      slug: "upside-down-world-Kamrul-I",
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
      id: "youtube-video-4",
      slug: "Mustard-Oil-vs-Refined-Oil",
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
      tags: ["Social Reels", "Motion Graphics", "CapCut", "Voiceover Sync"],
      published: true,
      order: 4,
      publishedAt: "2026-03-12T12:00:00Z",
      role: "Video Editor & Motion Graphics Specialist",
      tools: ["CapCut", "Adobe Premiere Pro", "Adobe Podcast"],
      deliverables: ["9:16 Vertical Documentary", "Kinetic Typography", "Voiceover Synchronization"],
      overview: "A viral-style investigative health documentary examining cooking oil processing. Features dynamic text animation, precision voiceover pacing, and clean sound effects to sustain high retention.",
    },
    {
      id: "youtube-video-5",
      slug: "how-i-edited-a-car-dealership-promo-audi-q5",
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
      order: 5,
      publishedAt: "2026-03-11T12:00:00Z",
      role: "Lead Social Video Editor & Sound Designer",
      tools: ["Adobe Premiere Pro", "Adobe After Effects", "DaVinci Resolve"],
      deliverables: ["9:16 Vertical Reel", "Speed Ramped Teaser", "Audio Mixed Master"],
      overview: "Produced for Syston Autos Ltd to showcase an Audi Q5 dealership inventory piece. Built around high-energy speed ramping, custom exhaust sound design, and sharp color contrast to maximize social engagement.",
    },
    {
      id: "kamrul-portfolio-web",
      slug: "kamrul-islam-portfolio",
      type: "web",
      aspect: "large",
      title: "Personal Portfolio Website",
      category: "Personal Brand • Web Architecture",
      client: "Kamrul Islam",
      year: "2026",
      description:
        "High-performance editorial portfolio engineered with Next.js, Framer Motion, and Supabase integration.",
      thumbnail: "/images/web-projects/web-project-1.png",
      githubUrl: "https://github.com/kamru1i/portfolio",
      liveUrl: "https://kamrulislam.me",
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
      thumbnail: "/images/web-projects/web-project-2.png",
      githubUrl: "https://github.com/kamru1i/photocard",
      liveUrl: "https://photocard-five.vercel.app/",
      canEmbed: true,
      previewMode: "iframe",
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
      slug: "web-wing",
      type: "web",
      aspect: "large",
      title: "Web Wing",
      category: "Agency Platform • Full Stack",
      client: "Web Wing UK",
      year: "2026",
      description:
        "Digital agency platform featuring scalable design architecture, performance optimization, and client management.",
      thumbnail: "/images/web-projects/web-project-3.png",
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
      thumbnail: "/images/web-projects/web-project-4.png",
      liveUrl: "https://japanese-master-chef.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase", "Tailwind CSS", "REST API"],
      published: true,
      order: 4,
      publishedAt: "2026-03-12T10:00:00Z",
      role: "Front-End Engineer",
      tools: ["React.js", "Firebase", "Tailwind CSS", "REST API"],
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
      thumbnail: "/images/web-projects/web-project-5.png",
      liveUrl: "https://rhythmverse-dance-school.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase", "Tailwind CSS", "Express.js"],
      published: true,
      order: 5,
      publishedAt: "2026-03-11T10:00:00Z",
      role: "Full-Stack Web Developer",
      tools: ["React.js", "Firebase", "Express.js", "Tailwind CSS"],
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
      thumbnail: "/images/web-projects/web-project-6.png",
      liveUrl: "https://talent-hub-assignment-09.netlify.app/",
      canEmbed: true,
      tags: ["React.js", "Tailwind CSS", "Netlify", "Job Engine"],
      published: true,
      order: 6,
      publishedAt: "2026-03-10T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Tailwind CSS", "Netlify"],
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
      thumbnail: "/images/web-projects/web-project-1.png",
      liveUrl: "https://babys-toy-out.web.app/",
      canEmbed: true,
      tags: ["React.js", "Firebase", "Tailwind CSS", "MongoDB"],
      published: true,
      order: 7,
      publishedAt: "2026-03-09T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Firebase", "MongoDB", "Tailwind CSS"],
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
      thumbnail: "/images/web-projects/web-project-2.png",
      liveUrl: "https://the-news-dragon-fad1b.web.app/",
      canEmbed: true,
      tags: ["React.js", "Express.js", "Bootstrap", "Firebase"],
      published: true,
      order: 8,
      publishedAt: "2026-03-08T10:00:00Z",
      role: "Front-End Developer",
      tools: ["React.js", "Express.js", "Firebase", "Bootstrap"],
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
    bio1Html: `Through previous corporate roles and <strong>ongoing projects with local clients</strong>, I spend time <strong>exploring</strong> visual storytelling and generative workflows that help me <strong>sharpen</strong> and <strong>evolve</strong>. Whether shaping <strong>narrative cuts</strong>, refining audio and color, or integrating <strong>AI-assisted scenes</strong>, I focus on craft that brings <strong>clarity</strong> and purpose to every timeline and web interface.`,
    bio2Html: `I <strong>believe</strong> dependable creative and technical work begins with disciplined execution. <strong>Problem-solving</strong>, <strong>adaptability</strong>, and continuous <strong>learning</strong> guide how I approach <strong>video post-production</strong>, <strong>modern web development</strong>, and <strong>IT infrastructure</strong>—delivering practical, polished solutions tailored to each brief.`,
    ctaText: "Let's Talk",
    ctaHref: "/contact-us",
    portraitSrc: "/images/Kamrul-I.png",
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
          role: "Video Editing (Project-Based)",
          organization: "Independent Client Projects",
          period: "Current — Project-Based Client Work",
          summary:
            "Collaborating with local clients on video editing projects, applying editing, audio enhancement, color grading, and post-production skills relevant to each brief.",
        },
        {
          role: "Video Editor",
          organization: "B&F Corporate",
          period: "1 Year — Previous Employment (Concurrent with IT responsibilities)",
          summary:
            "Executed video editing, post-production audio cleanup and mixing, color correction and grading, motion graphics, AI-assisted content creation, and social media video publishing.",
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
        "Kling 3",
        "Adobe Premiere Pro",
        "DaVinci Resolve",
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
          role: "Web Development & Video Editing",
          organization: "Independent Client Projects",
          period: "Current — Project-Based Client Work",
          summary:
            "Collaborating with local clients on video editing and creative projects with scope guided by each project brief.",
        },
        {
          role: "Video Editor",
          organization: "B&F Corporate",
          period: "1 Year — Previous Employment (Concurrent with IT responsibilities)",
          summary:
            "Developed creative concepts, scripts, scene structures, and prompts for AI-assisted video production, integrating generated scenes, imagery, and voiceovers into complete edits.",
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
        "HTML5 & CSS3",
        "Tailwind CSS",
        "Shadcn/UI",
        "DaisyUI",
        "Bootstrap",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Supabase (PostgreSQL)",
        "Firebase",
        "JWT",
        "Rust & Tauri v2",
        "WordPress",
        "Elementor Pro",
        "Git / GitHub",
        "Vercel & Netlify",
        "Figma",
        "cPanel & GoDaddy",
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
          role: "Web Development & Video Editing",
          organization: "Independent Client Projects",
          period: "Current — Project-Based Client Work",
          summary:
            "Collaborating with local clients on web development projects with scope guided by each project brief.",
        },
        {
          role: "Assistant IT Manager (Web Development & Website Management)",
          organization: "B&F Corporate",
          period: "2 Years — Previous Employment",
          summary:
            "Developed new websites according to business requirements and managed company domains, DNS, SSL certificates, hosting renewals, website security, and cPanel Webmail.",
        },
        {
          role: "Front-end Developer",
          organization: "Velocity Digital Inc.",
          period: "1.5 Years — Previous Employment",
          summary:
            "Built responsive web interfaces using HTML5, CSS3, JavaScript (ES6), and React.js, converted Figma designs into reusable components, and integrated REST APIs.",
        },
        {
          role: "WordPress Developer",
          organization: "JobMatchingBD.com",
          period: "1 Year — Internship & Full-Time",
          summary:
            "Managed and maintained the company's WordPress-based job portal, published job listings, and handled daily troubleshooting and plugin maintenance.",
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
          title: "Microsoft Office & Outlook Support",
          description:
            "Installing, configuring, and activating Microsoft Word, Excel, PowerPoint, and Outlook, including email setup, file synchronization, and access troubleshooting.",
        },
        {
          title: "Network, LAN & VPN Administration",
          description:
            "Setting up office Wi-Fi, Ethernet cabling, router configuration, LAN troubleshooting, and secure remote VPN access.",
        },
        {
          title: "Web Hosting, DNS & SSL Management",
          description:
            "cPanel and GoDaddy administration, DNS records, SSL certificate configuration, cPanel Webmail support, and domain/hosting renewals.",
        },
        {
          title: "Website Security & Malware Scanning",
          description:
            "Routine malware scanning, detection, removal, basic website security maintenance, form delivery verification, and availability monitoring.",
        },
        {
          title: "Basic CCTV Setup & Monitoring",
          description:
            "Basic CCTV camera setup, configuration, troubleshooting, and day-to-day surveillance monitoring.",
        },
      ],
      tools: [
        "Windows OS",
        "Microsoft Word, Excel & PowerPoint",
        "Microsoft Outlook",
        "cPanel & cPanel Webmail",
        "GoDaddy",
        "DNS & SSL",
        "VPN Access & Setup",
        "Basic CCTV Systems",
        "LAN / Wi-Fi Troubleshooting",
        "System Backup & Data Management",
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
          period: "2 Years — Previous Employment | Joined as IT Executive; promoted after one year",
          summary:
            "Managed office PC troubleshooting, Microsoft Office & Outlook support, employee VPN access, LAN/Wi-Fi connectivity, printers, website operations, DNS/SSL, and cPanel Webmail.",
        },
        {
          role: "Customer Service",
          organization: "Robi Helpline & Banglalink Helpline",
          period: "3 Years Combined Experience",
          summary:
            "Handled incoming customer calls, diagnosed service and connectivity issues through CRM systems, escalated network/internet cases to backend teams, and prepared daily performance reports.",
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
      id: "exp-independent-client-projects",
      year: "Current",
      organization: "Independent Client Projects",
      role: "Web Development & Video Editing",
      highlight:
        "Current — Project-Based Client Work · Collaborating with local clients on web development and video editing briefs",
      slug: "independent-client-projects",
      type: "experience",
      period: "Current — Project-Based Client Work",
      details: {
        overview:
          "Currently collaborate with local clients on web development and video editing projects, with scope guided by each project brief.",
        responsibilities: [
          "Collaborate with local clients on web development and video editing projects, with scope guided by each project brief.",
          "Apply video editing, storytelling, pacing, audio enhancement, color correction and grading, motion graphics, and AI-assisted post-production workflows relevant to each brief.",
          "Develop, customize, and maintain responsive web interfaces, modern web applications, and WordPress websites based on project requirements.",
        ],
        tools: [
          "Adobe Premiere Pro",
          "Adobe After Effects",
          "DaVinci Resolve",
          "CapCut",
          "Adobe Podcast",
          "React.js",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "WordPress",
          "Elementor Pro",
        ],
      },
    },
    {
      id: "exp-bf-corporate-it",
      year: "2 Years",
      organization: "B&F Corporate",
      role: "Assistant IT Manager",
      highlight:
        "2 Years — Previous Employment · Joined as IT Executive; promoted after one year · Web, hosting & office IT operations",
      slug: "bf-corporate-assistant-it-manager",
      type: "experience",
      period: "2 Years — Previous Employment | Joined as IT Executive; promoted after one year",
      details: {
        overview:
          "Managed company website operations, domain/DNS/SSL and hosting renewals, cPanel Webmail, office PC and Microsoft Outlook support, employee VPN access, network troubleshooting, printers, and visual documentation across B&F Corporate.",
        responsibilities: [
          "Monitor, troubleshoot, and maintain company websites to ensure proper functionality, availability, and performance.",
          "Test website forms and verify successful submission and delivery through cPanel Webmail.",
          "Perform malware scanning, detection, removal, and basic website security maintenance.",
          "Manage DNS configurations and ensure proper domain connectivity and resolution.",
          "Monitor SSL certificates and install or configure SSL when required.",
          "Monitor domain and hosting expiration dates and manage timely renewals.",
          "Develop new websites according to specific business requirements and organizational needs.",
          "Manage cPanel and cPanel Webmail access, including password updates and user access support.",
          "Troubleshoot and resolve hardware, software, operating system, and general technical issues on office PCs.",
          "Install, configure, and activate Microsoft Office applications and troubleshoot Microsoft Outlook-related email, file synchronization, and access issues.",
          "Manage employee VPN access, including account setup, login support, troubleshooting, and renewal management.",
          "Troubleshoot and resolve internet, LAN, and connectivity issues affecting office users.",
          "Configure and maintain employee Outlook email access and support account-related issues.",
          "Support cPanel Webmail access for employees following password or account changes.",
          "Manage office printers and provide day-to-day printing support for official documents.",
          "Prepare and edit office documents according to organizational requirements.",
          "Edit images and create visual materials using Adobe Photoshop and Illustrator, including company logos, ID cards, lanyards, posters, and banners.",
        ],
        tools: [
          "cPanel & cPanel Webmail",
          "GoDaddy",
          "DNS & SSL",
          "Windows OS",
          "Microsoft Word, Excel & PowerPoint",
          "Microsoft Outlook",
          "VPN Access & Setup",
          "LAN / Wi-Fi Troubleshooting",
          "Basic CCTV Systems",
          "Adobe Photoshop",
          "Adobe Illustrator",
        ],
        achievements: [
          "Joined as IT Executive and earned promotion to Assistant IT Manager after one year.",
          "Combined company website management, DNS/SSL and hosting renewals, malware cleanup, and day-to-day office IT operations.",
        ],
      },
    },
    {
      id: "exp-bf-corporate-video",
      year: "1 Year",
      organization: "B&F Corporate",
      role: "Video Editor",
      highlight:
        "1 Year — Previous Employment (Concurrent with IT responsibilities) · Video editing, post-production, AI workflows & social publishing",
      slug: "bf-corporate-video-editor",
      type: "experience",
      period: "1 Year — Previous Employment (Concurrent with IT responsibilities)",
      details: {
        overview:
          "Executed video editing, post-production audio cleanup and mixing, color correction and grading, motion graphics, AI-assisted video and content creation, and social media video publishing concurrently with IT responsibilities at B&F Corporate.",
        responsibilities: [
          "Edit and assemble raw footage into polished, engaging, and purpose-driven video content.",
          "Perform cutting, trimming, sequencing, transitions, and scene arrangement according to content requirements.",
          "Develop engaging edits through storytelling, pacing, rhythm, timing, and narrative flow.",
          "Adapt editing style and visual presentation according to content type, target audience, and platform requirements.",
          "Integrate footage, graphics, images, music, voiceovers, and sound effects into complete video projects.",
          "Perform audio editing, noise cancellation, noise reduction, audio enhancement, voice cleanup, synchronization, volume balancing, and basic sound mixing.",
          "Perform color correction and color grading to improve exposure, contrast, consistency, tone, mood, and overall visual quality.",
          "Create and integrate motion graphics, animated text, titles, lower thirds, overlays, subtitles, captions, keyframing, masking, and compositing.",
          "Develop creative concepts, content ideas, scripts, scene structures, and prompts for AI-assisted video production.",
          "Generate AI-based videos, individual scenes, images, illustrations, backgrounds, voiceovers, and narration, and refine them for continuity and pacing.",
          "Manage social media video content, prepare thumbnails, titles, captions, and hashtags, and optimize aspect ratios and formats across platforms.",
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
          "Gemini Omni Flash",
          "Google Veo",
          "ChatGPT Sora",
          "Kling 3.0",
          "Google Nano Banana",
          "ChatGPT Image 2",
          "Higgsfield Soul",
        ],
        achievements: [
          "Delivered end-to-end video editing, audio enhancement, color grading, motion graphics, and multi-platform social publishing concurrently with IT duties.",
          "Applied AI-assisted creative workflows combining generated assets with traditional footage and custom graphics.",
        ],
      },
    },
    {
      id: "exp-velocity-digital",
      year: "1.5 Years",
      organization: "Velocity Digital Inc.",
      role: "Front-end Developer",
      highlight:
        "1.5 Years — Previous Employment · Responsive React.js interfaces, Figma conversion, REST APIs & Tailwind CSS",
      slug: "velocity-digital-frontend-developer",
      type: "experience",
      period: "1.5 Years — Previous Employment",
      details: {
        overview:
          "Developed responsive and user-friendly web interfaces using HTML5, CSS3, JavaScript (ES6), and React.js, converting UI/UX and Figma designs into reusable components and integrating REST APIs.",
        responsibilities: [
          "Develop responsive and user-friendly web interfaces based on project requirements and design specifications.",
          "Build modern web pages and interactive interfaces using HTML5, CSS3, JavaScript (ES6), and React.js.",
          "Implement responsive layouts and consistent user experiences across desktop, tablet, and mobile devices.",
          "Convert UI/UX and Figma designs into functional, reusable, and responsive interfaces.",
          "Develop reusable components and maintain structured, modular, and maintainable front-end code.",
          "Implement modern UI styling using Tailwind CSS, Bootstrap, DaisyUI, and Shadcn/UI where required.",
          "Integrate front-end interfaces with REST APIs and back-end services.",
          "Handle forms, validation, user interactions, dynamic content, navigation, routing, and application interfaces.",
          "Optimize websites and web applications for performance, usability, responsiveness, and cross-browser compatibility.",
          "Troubleshoot and resolve front-end issues involving layout, functionality, responsiveness, JavaScript, and browser compatibility.",
          "Perform testing and debugging using browser developer tools and collaborate with designers and developers using Git/GitHub.",
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
          "Chrome DevTools",
          "VS Code",
        ],
        achievements: [
          "Converted UI/UX and Figma designs into modular, reusable React.js components across desktop, tablet, and mobile devices.",
          "Integrated REST APIs, client-side validation, routing, and Git/GitHub collaborative development workflows.",
        ],
      },
    },
    {
      id: "exp-jobmatchingbd",
      year: "1 Year",
      organization: "JobMatchingBD.com",
      role: "WordPress Developer",
      highlight:
        "1 Year — Internship & Full-Time · WordPress job portal management, daily checks & plugin maintenance",
      slug: "jobmatchingbd-wordpress-developer",
      type: "experience",
      period: "1 Year — Internship & Full-Time",
      details: {
        overview:
          "Managed and maintained the company’s WordPress-based job portal across internship and full-time tenure, handling job listings, daily troubleshooting, plugin updates, and ongoing administration.",
        responsibilities: [
          "Managed and maintained the company’s WordPress-based job portal website.",
          "Published, updated, and managed job listings and other website content through WordPress.",
          "Conducted daily website checks to identify and resolve functional, content, and technical issues.",
          "Managed routine WordPress maintenance, plugin updates, and compatibility-related issues.",
          "Kept the website updated with relevant WordPress technologies, features, and maintenance practices.",
          "Performed ongoing website updates, troubleshooting, and general WordPress administration.",
        ],
        tools: [
          "WordPress",
          "WordPress Admin Dashboard",
          "Elementor",
          "Elementor Pro",
          "cPanel",
          "GoDaddy",
        ],
        achievements: [
          "Transitioned from internship to full-time WordPress Developer maintaining the company’s job portal.",
          "Supported portal stability through daily functional checks, plugin updates, and routine WordPress administration.",
        ],
      },
    },
    {
      id: "edu-bsc-cse",
      year: "BSc",
      organization: "Port City International University",
      role: "Bachelor of Science (BSc) — Computer Science & Engineering",
      highlight:
        "Department of Natural Science · Subject: Computer Science & Engineering · Major: Web Development",
      slug: "bsc-cse",
      type: "education",
      period: "Department of Natural Science · Major in Web Development",
      details: {
        institution: "Port City International University",
        authority: "Port City International University",
        department: "Natural Science",
        subject: "Computer Science & Engineering",
        major: "Web Development",
        fieldOfStudy: "Computer Science & Engineering",
        qualificationName: "Bachelor of Science (BSc) — Computer Science & Engineering",
        overview:
          "University academic background in Computer Science & Engineering under the Department of Natural Science at Port City International University, with a Major in Web Development.",
        coursework: [
          "Web Development",
          "Computer Science & Engineering",
          "Programming & Software Development",
          "Database Systems",
          "Computer Networks",
        ],
        achievements: [
          "Department: Natural Science · Subject: Computer Science & Engineering.",
          "Focused Major in Web Development.",
        ],
      },
    },
    {
      id: "exp-robi-banglalink",
      year: "3 Years",
      organization: "Robi Helpline & Banglalink Helpline",
      role: "Customer Service",
      highlight:
        "3 Years Combined Experience · Customer support, CRM case management, technical escalations & reporting",
      slug: "robi-banglalink-customer-service",
      type: "experience",
      period: "3 Years Combined Experience",
      details: {
        overview:
          "Delivered customer service and technical issue support across Robi Helpline and Banglalink Helpline, managing CRM cases, escalating network and internet issues, and maintaining daily operational reports.",
        responsibilities: [
          "Handle incoming customer calls and listen attentively to customer concerns, service requests, and technical issues.",
          "Identify customer needs and provide accurate and appropriate solutions based on the reported issue.",
          "Manage customer information, service-related cases, and issue details through CRM and dedicated service interfaces.",
          "Escalate network, internet, and other technical service-related issues to appropriate backend/support teams and follow up where necessary.",
          "Resolve customer issues effectively and provide suitable alternative solutions when a direct resolution is unavailable.",
          "Maintain a customer-focused and solution-oriented approach when handling unresolved requests.",
          "Promote relevant company products and services and perform upselling based on customer needs and eligibility.",
          "Prepare daily operational and performance reports and maintain accurate performance records.",
          "Monitor call-handling quality and continuously improve service efficiency and individual performance.",
          "Stay continuously updated with the latest company service information, product details, packages, offers, policies, procedures, and related database/system updates.",
        ],
        tools: [
          "CRM Interfaces",
          "Customer Service Portals",
          "Technical Issue Escalation Workflows",
          "Operational & Performance Reporting",
        ],
        achievements: [
          "3 years of combined customer service experience across Robi Helpline and Banglalink Helpline.",
          "Managed CRM service cases, technical escalations, eligible upselling, and daily performance reporting.",
        ],
      },
    },
    {
      id: "exp-pizza-hut",
      year: "2 Years",
      organization: "Pizza Hut",
      role: "Customer Service Representative & Server",
      highlight:
        "2 Years Combined Experience · Dine-in, takeaway, POS, Foodpanda order coordination & inventory reporting",
      slug: "pizza-hut-customer-service",
      type: "experience",
      period: "2 Years Combined Experience",
      details: {
        overview:
          "Provided dine-in and takeaway customer service, POS order and payment handling, Foodpanda order coordination, daily sales reporting, and weekly/monthly inventory checks.",
        responsibilities: [
          "Warmly greet customers and provide professional and welcoming dine-in and takeaway service.",
          "Process takeaway orders through the POS system, prepare customer bills, process payments, provide receipts, and return change accurately.",
          "Manage Foodpanda orders, including confirmation, processing, preparation coordination, and rider handover.",
          "Welcome dine-in customers, provide menus, receive and reconfirm orders, and monitor customer satisfaction.",
          "Perform daily bar setup and maintain cleanliness, hygiene, and service standards.",
          "Prepare and submit daily sales and inventory reports.",
          "Conduct weekly and monthly inventory checks, reconcile records, and submit verified reports to management.",
        ],
        tools: [
          "POS System",
          "Foodpanda Order Management",
          "Daily Sales & Inventory Reporting",
          "Stock Reconciliation Records",
        ],
        achievements: [
          "2 years of combined customer service and restaurant operations experience across dine-in, takeaway, and Foodpanda channels.",
          "Prepared daily sales reports and supported weekly and monthly inventory checks and record reconciliation.",
        ],
      },
    },
    {
      id: "edu-hsc",
      year: "2015",
      organization: "Sitakund University College",
      role: "Higher Secondary Certificate (H.S.C) — Science",
      highlight: "Chittagong Board · Passing Year: 2015 · GPA: 3.50 (Out of 5.00)",
      slug: "hsc",
      type: "education",
      period: "Passing Year: 2015",
      details: {
        institution: "Sitakund University College",
        group: "Science",
        board: "Chittagong",
        authority: "Chittagong Education Board",
        fieldOfStudy: "Science",
        qualificationName: "Higher Secondary Certificate (H.S.C)",
        passingYear: "2015",
        gpa: "3.50 (Out of 5.00)",
        result: "GPA 3.50 (Out of 5.00)",
        overview:
          "Higher Secondary Certificate (H.S.C) in the Science group from Sitakund University College under the Chittagong Board, completed in 2015 with GPA 3.50 (Out of 5.00).",
        coursework: ["Physics", "Chemistry", "Higher Mathematics", "Biology", "English", "Bangla"],
        achievements: [
          "Higher Secondary Certificate (H.S.C) in Science under Chittagong Board (2015).",
          "Result: GPA 3.50 (Out of 5.00).",
        ],
      },
    },
    {
      id: "edu-ssc",
      year: "2013",
      organization: "Mahamudabad High School",
      role: "Secondary School Certificate (S.S.C) — Science",
      highlight: "Chittagong Board · Passing Year: 2013 · GPA: 4.81 (Out of 5.00)",
      slug: "ssc",
      type: "education",
      period: "Passing Year: 2013",
      details: {
        institution: "Mahamudabad High School",
        group: "Science",
        board: "Chittagong",
        authority: "Chittagong Education Board",
        fieldOfStudy: "Science",
        qualificationName: "Secondary School Certificate (S.S.C)",
        passingYear: "2013",
        gpa: "4.81 (Out of 5.00)",
        result: "GPA 4.81 (Out of 5.00)",
        overview:
          "Secondary School Certificate (S.S.C) in the Science group from Mahamudabad High School under the Chittagong Board, completed in 2013 with GPA 4.81 (Out of 5.00).",
        coursework: ["Science", "Physics", "Chemistry", "Mathematics", "English", "Bangla"],
        achievements: [
          "Secondary School Certificate (S.S.C) in Science under Chittagong Board (2013).",
          "Result: GPA 4.81 (Out of 5.00).",
        ],
      },
    },
  ] as MilestoneItem[],

  counters: [
    { target: 13, suffix: "+", label: "Published Portfolio Works" },
    { target: 4, suffix: "+", label: "Years in Web, IT & Media" },
    { target: 4, suffix: "", label: "Core Practice Pillars" },
  ] as StatItem[],

  faq: {
    badge: "FAQ",
    title: "Have Questions?",
    subtitle:
      "Direct insights into my post-production pipeline, technical toolchains, AI workflows, and project collaboration.",
    contactCard: {
      name: "Talk with Kamrul",
      role: "Video Editor, AI-Assisted Content Creator, Web Developer & IT Professional",
      ctaText: "Get in touch",
      ctaHref: "/contact-us",
      email: "hello@kamrulislam.me",
      status: "Collaborating on client briefs & open to new opportunities",
      avatarSrc: "/images/Kamrul-I.png",
    },
    items: [
      {
        id: "faq-video-editing",
        question: "What types of video editing can you handle?",
        answer:
          "I handle end-to-end commercial, brand, and social media video editing—including promotional reels, automotive showcases, talking-head edits, YouTube narratives, and short-form social content. My workflow covers storytelling, pacing, cutting and sequencing, motion graphics, color correction and grading, captions, and multi-platform delivery using Adobe Premiere Pro, After Effects, DaVinci Resolve, CapCut, and Final Cut Pro.",
      },
      {
        id: "faq-audio-enhancement",
        question: "Do you provide audio enhancement and noise reduction?",
        answer:
          "Yes. Clean, balanced audio is a core part of my post-production workflow. I perform noise cancellation, background noise reduction, voice cleanup, sound synchronization, volume balancing, SFX and music integration, and basic sound mixing using Adobe Podcast, Audacity, Adobe Premiere Pro, and DaVinci Resolve.",
      },
      {
        id: "faq-ai-content",
        question: "Can you create AI-assisted video and visual content?",
        answer:
          "Yes. I develop creative concepts, scripts, scene structures, and prompts for AI-assisted production—generating video scenes, visual assets, backgrounds, and voiceovers with Gemini Omni Flash, Google Veo, ChatGPT Sora, Kling 3.0, Google Nano Banana, ChatGPT Image 2, and Higgsfield Soul, then editing and refining everything on the timeline for continuity and visual quality.",
      },
      {
        id: "faq-social-media",
        question: "Can you prepare videos for social media platforms?",
        answer:
          "Yes. I optimize videos for YouTube, TikTok, Instagram Reels, Facebook, and YouTube Shorts across 16:9, 9:16, 1:1, 4:3, and 5:4 formats—covering pacing, aspect-ratio framing, subtitles and captions, animated lower thirds, thumbnail design, and platform-ready export settings.",
      },
      {
        id: "faq-web-dev",
        question: "What web development technologies do you work with?",
        answer:
          "I build responsive web interfaces and full-stack applications using HTML5, CSS3, JavaScript (ES6), React.js, Next.js, TypeScript, Tailwind CSS, DaisyUI, Shadcn/UI, and Bootstrap, paired with Node.js, Express.js, MongoDB, Supabase (PostgreSQL), Firebase, and JWT, plus desktop/app work with Rust and Tauri v2.",
      },
      {
        id: "faq-wordpress",
        question: "Do you also work with WordPress websites?",
        answer:
          "Yes. I develop, customize, and maintain WordPress websites using Elementor and Elementor Pro—handling WordPress setup, theme customization, plugin installation and updates, backups, performance optimization, troubleshooting, and basic security and malware cleanup.",
      },
      {
        id: "faq-it-support",
        question: "What kind of IT support can you provide?",
        answer:
          "I provide practical office IT and website infrastructure support, including Windows setup and troubleshooting, Microsoft Word/Excel/PowerPoint and Outlook configuration, employee VPN access, LAN/Wi-Fi and printer troubleshooting, cPanel and GoDaddy domain/DNS/SSL and Webmail management, website malware cleanup, and basic CCTV setup and monitoring.",
      },
      {
        id: "faq-end-to-end",
        question: "Can you work on a project from concept to final delivery?",
        answer:
          "Yes. Depending on the project brief, I can take work from initial concept, script or UI planning, and asset preparation through editing or development, quality review, revisions, and final platform delivery or deployment.",
      },
      {
        id: "faq-footage-ai",
        question: "Can you work with existing footage as well as AI-generated assets?",
        answer:
          "Yes. I regularly combine client-supplied camera footage and custom graphics in Photoshop and Illustrator with AI-generated scenes, backgrounds, and audio assets, harmonizing color, timing, and sound so the final video feels cohesive.",
      },
      {
        id: "faq-focus",
        question: "What kind of projects are you most focused on?",
        answer:
          "My primary focus is Video Editing & Post-Production and AI-Assisted Content Creation, alongside responsive Web Development (MERN, Next.js, WordPress) and dependable IT & website operations for local and remote clients.",
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
