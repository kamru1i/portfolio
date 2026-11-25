import { DEFAULT_CONTACT_CARD } from "./brand-config";

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

export interface HomeServiceSummary {
  id: string;
  slug: string;
  href: string;
  index: string;
  category: string;
  title: string;
  images: string[];
  image: string;
}

export interface HomeMilestoneSummary {
  year: string;
  organization: string;
  role: string;
  highlight: string;
  slug: string;
  type: "experience" | "education";
}

export const HERO_CONFIG = {
  wordmark: "KAMRUL ISLAM",
  subtitle:
    "Crafting high-impact video edits, AI-assisted visual narratives, modern web platforms, and resilient IT infrastructure.",
};

export const WORKS_HEADER = {
  title: "Projects & Works",
  statementHtml: `A <strong>curated body</strong> of <strong>high-impact video edits</strong>, <strong>AI-assisted productions</strong>, <strong>full-stack web interfaces</strong>, and <strong>enterprise IT systems</strong> engineered for <strong>clarity</strong>, <strong>rhythm</strong>, and <strong>dependability</strong>.`,
};

export const MANIFESTO_DATA = {
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
  portraitSrc: "/images/Kamrul-I.webp",
};

export const HOME_SERVICES_SUMMARY: HomeServiceSummary[] = [
  {
    id: "video-editing",
    slug: "video-editing",
    href: "/services/video-editing",
    index: "01",
    category: "VIDEO EDITING",
    title: "Video Editing & Post-Production",
    images: [
      "/images/services/video-editing-hero.webp",
      "/images/hero-gallery/hero-card-2.webp",
      "/images/hero-gallery/hero-card-1.webp",
    ],
    image: "/images/services/video-editing-hero.webp",
  },
  {
    id: "ai-assisted-content",
    slug: "ai-assisted-content",
    href: "/services/ai-assisted-content",
    index: "02",
    category: "AI CONTENT CREATION",
    title: "AI-Assisted Content Creation",
    images: [
      "/images/services/ai-content-hero.webp",
      "/images/hero-gallery/hero-card-3.webp",
      "/images/services/ai-content-2.webp",
    ],
    image: "/images/services/ai-content-hero.webp",
  },
  {
    id: "web-development",
    slug: "web-development",
    href: "/services/web-development",
    index: "03",
    category: "WEB DEVELOPMENT",
    title: "Web Development",
    images: [
      "/images/services/web-dev-hero.webp",
      "/images/hero-gallery/hero-card-4.webp",
      "/images/hero-gallery/hero-card-5.webp",
      "/images/services/web-dev-2.webp",
    ],
    image: "/images/services/web-dev-hero.webp",
  },
  {
    id: "it-support",
    slug: "it-support",
    href: "/services/it-support",
    index: "04",
    category: "IT INFRASTRUCTURE",
    title: "IT Support & Digital Infrastructure",
    images: [
      "/images/services/it-infra-hero.webp",
      "/images/services/it-infra-2.webp",
      "/images/services/it-infra-3.webp",
    ],
    image: "/images/services/it-infra-hero.webp",
  },
];

export const HOME_MILESTONES_SUMMARY: HomeMilestoneSummary[] = [
  {
    year: "Current",
    organization: "Independent Client Projects",
    role: "Web Development & Video Editing",
    highlight:
      "Current — Project-Based Client Work · Collaborating with local clients on web development and video editing briefs",
    slug: "independent-client-projects",
    type: "experience",
  },
  {
    year: "2 Years",
    organization: "B&F Corporate",
    role: "Assistant IT Manager",
    highlight:
      "2 Years — Previous Employment · Joined as IT Executive; promoted after one year · Web, hosting & office IT operations",
    slug: "bf-corporate-assistant-it-manager",
    type: "experience",
  },
  {
    year: "1 Year",
    organization: "B&F Corporate",
    role: "Video Editor",
    highlight:
      "1 Year — Previous Employment (Concurrent with IT responsibilities) · Video editing, post-production, AI workflows & social publishing",
    slug: "bf-corporate-video-editor",
    type: "experience",
  },
  {
    year: "1.5 Years",
    organization: "Velocity Digital Inc.",
    role: "Front-end Developer",
    highlight:
      "1.5 Years — Previous Employment · Responsive React.js interfaces, Figma conversion, REST APIs & Tailwind CSS",
    slug: "velocity-digital-frontend-developer",
    type: "experience",
  },
  {
    year: "1 Year",
    organization: "JobMatchingBD.com",
    role: "WordPress Developer",
    highlight:
      "1 Year — Internship & Full-Time · WordPress job portal management, daily checks & plugin maintenance",
    slug: "jobmatchingbd-wordpress-developer",
    type: "experience",
  },
  {
    year: "BSc",
    organization: "Port City International University",
    role: "Bachelor of Science (BSc) — Computer Science & Engineering",
    highlight:
      "Department of Natural Science · Subject: Computer Science & Engineering · Major: Web Development",
    slug: "bsc-cse",
    type: "education",
  },
  {
    year: "3 Years",
    organization: "Robi Helpline & Banglalink Helpline",
    role: "Customer Service",
    highlight:
      "3 Years Combined Experience · Customer support, CRM case management, technical escalations & reporting",
    slug: "robi-banglalink-customer-service",
    type: "experience",
  },
  {
    year: "2 Years",
    organization: "Pizza Hut",
    role: "Customer Service Representative & Server",
    highlight:
      "2 Years Combined Experience · Dine-in, takeaway, POS, Foodpanda order coordination & inventory reporting",
    slug: "pizza-hut-customer-service",
    type: "experience",
  },
  {
    year: "2015",
    organization: "Sitakund University College",
    role: "Higher Secondary Certificate (H.S.C) — Science",
    highlight: "Chittagong Board · Passing Year: 2015 · GPA: 3.50 (Out of 5.00)",
    slug: "hsc",
    type: "education",
  },
  {
    year: "2013",
    organization: "Mahamudabad High School",
    role: "Secondary School Certificate (S.S.C) — Science",
    highlight: "Chittagong Board · Passing Year: 2013 · GPA: 4.81 (Out of 5.00)",
    slug: "ssc",
    type: "education",
  },
];

export const HOME_COUNTERS: StatItem[] = [
  { target: 13, suffix: "+", label: "Published Portfolio Works" },
  { target: 4, suffix: "+", label: "Years in Web, IT & Media" },
  { target: 4, suffix: "", label: "Core Practice Pillars" },
];

export const HOME_FAQ_DATA = {
  badge: "FAQ",
  title: "Have Questions?",
  subtitle:
    "Direct insights into my post-production pipeline, technical toolchains, AI workflows, and project collaboration.",
  contactCard: DEFAULT_CONTACT_CARD,
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
};
