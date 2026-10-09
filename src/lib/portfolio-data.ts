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

export interface PortfolioProject {
  id: string;
  type: "video" | "web";
  title: string;
  category?: string;
  client?: string;
  year: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  videoType?: "local" | "youtube" | "vimeo";
  format?: "16:9" | "9:16";
  aspect?: "small" | "large" | "medium";
  githubUrl?: string;
  liveUrl?: string;
  canEmbed?: boolean;
  featured?: boolean;
  tags: string[];
  published: boolean;
  order: number;
  publishedAt?: string;
  createdAt?: string;
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
  },

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
      type: "video",
      format: "9:16",
      aspect: "small",
      title: "How I Edited a Car Dealership Promo | Audi Q5",
      category: "Social Media • Automotive Video",
      client: "Audi Dealership",
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
    },
    {
      id: "youtube-video-4",
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
    },
    {
      id: "youtube-video-3",
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
    },
    {
      id: "youtube-video-2",
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
    },
    {
      id: "youtube-video-1",
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
    },
    {
      id: "kamrul-portfolio-web",
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
    },
    {
      id: "photocard-design-web",
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
      tags: ["React.js", "Canvas API", "Tailwind CSS", "Vercel"],
      published: true,
      order: 2,
      publishedAt: "2026-03-14T10:00:00Z",
    },
    {
      id: "web-wing",
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
      canEmbed: true,
      tags: ["Full Stack", "TypeScript", "Tailwind CSS", "Next.js"],
      published: true,
      order: 3,
      publishedAt: "2026-03-13T10:00:00Z",
    },
    {
      id: "japanese-master-chef",
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
    },
    {
      id: "rhythmverse-dance",
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
    },
    {
      id: "talent-hub",
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
