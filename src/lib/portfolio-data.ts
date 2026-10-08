// Source of truth: Kamrul Islam CV and Professional Portfolio documents
// Priority: Video Editing & Post-Production -> AI-Assisted Content -> Web Development -> IT Operations

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

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  tools: string[];
  image: string;
}

export interface MilestoneItem {
  year: string;
  organization: string;
  role: string;
  highlight: string;
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
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
    email: "kamrulislamabk@gmail.com",
    phone: "(+880) 1839 00 6867",
    socials: [
      { label: "LI", name: "LinkedIn", url: "https://linkedin.com/in/kamrul-islam-dev" },
      { label: "GH", name: "GitHub", url: "https://github.com/kamrul-islam-dev" },
      { label: "X", name: "X", url: "https://x.com" },
      { label: "YT", name: "YouTube", url: "https://youtube.com" },
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
  },

  worksHeader: {
    title: "Selected Works",
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

  manifesto: {
    lines: [
      "I craft digital media and systems that balance",
      "precision, visual rhythm and resilience. Every video",
      "edit is approached with storytelling instinct,",
      "every line of code with architectural rigor, and every",
      "technical operation with dependable craftsmanship.",
    ],
    bio1Html: `Outside of work, I spend time <strong>exploring</strong> visual storytelling and emerging generative techniques that help me <strong>sharpen</strong> and <strong>evolve</strong>. Whether analyzing <strong>cinematic cuts</strong>, studying motion pacing, or refining <strong>AI workflows</strong>, I seek disciplines that bring <strong>depth</strong>. These experiments often become the <strong>inspiration</strong> behind every timeline I cut and every platform I deploy.`,
    bio2Html: `I <strong>believe</strong> great technical work begins with disciplined execution. <strong>Curiosity</strong>, <strong>precision</strong> and continuous <strong>learning</strong> shape the way I approach both <strong>creative post-production</strong> and <strong>IT infrastructure</strong>. Every project adds a new layer to my <strong>expertise</strong>, ensuring digital solutions that are <strong>reliable</strong>, <strong>timeless</strong>, and deeply <strong>valuable</strong> to the organizations that rely on them.`,
    ctaText: "Let's Talk",
    ctaHref: "mailto:kamrulislamabk@gmail.com",
    portraitSrc: "/images/kamrul-portrait.jpg",
  },

  services: [
    {
      id: "video",
      index: "01",
      title: "VIDEO EDITING & POST-PRODUCTION",
      description:
        "Storytelling, narrative flow, rhythm, noise reduction, audio mixing, color correction & grading, motion graphics, and platform delivery.",
      tools: ["Premiere Pro", "DaVinci Resolve", "After Effects", "CapCut", "Audacity"],
      image: "/images/service-1.png",
    },
    {
      id: "ai",
      index: "02",
      title: "AI-ASSISTED CONTENT CREATION",
      description:
        "Concept design, script writing, scene planning, AI video & image generation, voiceover synthesis, asset blending, and post-refinement.",
      tools: ["Gemini Omni Flash", "Google Veo", "ChatGPT Sora", "Kling 3.0", "Higgsfield Soul"],
      image: "/images/service-2.png",
    },
    {
      id: "web",
      index: "03",
      title: "FULL-STACK & WEB DEVELOPMENT",
      description:
        "Responsive UI engineering, React.js, Next.js, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Supabase, and WordPress/Elementor.",
      tools: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Node.js", "WordPress"],
      image: "/images/service-3.png",
    },
    {
      id: "it",
      index: "04",
      title: "IT OPERATIONS & INFRASTRUCTURE",
      description:
        "cPanel hosting administration, domain & DNS configuration, SSL lifecycle, enterprise email, VPN management, LAN troubleshooting, and CCTV.",
      tools: ["cPanel", "GoDaddy", "DNS / SSL", "Outlook", "Office 365", "VPN / LAN"],
      image: "/images/service-4.png",
    },
    {
      id: "motion",
      index: "05",
      title: "MOTION GRAPHICS & SOUND DESIGN",
      description:
        "Kinetic typography, multi-layered visual effects, speed ramping, sound design synthesis, audio restoration, and broadcast finishing.",
      tools: ["After Effects", "DaVinci Fairlight", "Audition", "Cinema 4D"],
      image: "/images/service-5.png",
    },
  ] as ServiceItem[],

  milestones: [
    {
      year: "2026",
      organization: "B&F Corporate",
      role: "Assistant IT Manager & Lead Video Editor",
      highlight: "Promoted after 1 year of service · Leading digital infrastructure and video production",
    },
    {
      year: "2025",
      organization: "B&F Corporate",
      role: "IT Executive → Assistant IT Manager",
      highlight: "Enterprise web management, DNS/SSL maintenance, and automotive video campaigns",
    },
    {
      year: "2024",
      organization: "Velocity Digital Inc.",
      role: "Front-End Developer (1.5 Years)",
      highlight: "Component-driven React.js web interfaces, Figma conversion, Tailwind styling",
    },
    {
      year: "2023",
      organization: "JobMatchingBD.com",
      role: "WordPress Developer (1 Year)",
      highlight: "Job portal administration, Elementor development, plugins and security maintenance",
    },
    {
      year: "2021",
      organization: "Port City Int. University",
      role: "BSc in Computer Science & Engineering",
      highlight: "Major in Web Development · Deep grounding in software architecture and algorithms",
    },
    {
      year: "2020",
      organization: "Robi & Banglalink Helplines",
      role: "Customer Service & Technical Support (4 Yrs)",
      highlight: "High-volume technical issue resolution, CRM management, customer satisfaction excellence",
    },
  ] as MilestoneItem[],

  counters: [
    { target: 18, suffix: "+", label: "Published Video Projects" },
    { target: 5, suffix: "+", label: "Years in IT & Operations" },
    { target: 100, suffix: "%", label: "Project Delivery Rate" },
  ] as StatItem[],

  footer: {
    navLinks: [
      { label: "WORK", href: "#works" },
      { label: "ABOUT", href: "#about" },
      { label: "EXPERTISE", href: "#expertise" },
      { label: "CONTACT", href: "mailto:kamrulislamabk@gmail.com" },
    ],
    copyright: "© 2026 Kamrul Islam. All rights reserved.",
    locationNote: "Based in Chittagong, Bangladesh · Available Worldwide",
  },
};
