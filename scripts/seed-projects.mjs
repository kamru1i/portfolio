// Node.js script to seed projects using the Supabase client
// Run with: node scripts/seed-projects.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// Load environment variables from .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration.");
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or publishable key) in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initialProjects = [
  {
    type: "video",
    title: "Biqolpo — Latent Stories",
    slug: "biqolpo-latent-stories",
    client_name: "Biqolpo",
    year: "2024–2026",
    description: "Experimental generative narratives blending synthetic visual concept art with cinematic pacing, AI voiceover mastering, and temporal motion synthesis.",
    preview_image_url: "/images/work-1-biqolpo.png",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    video_provider: "local",
    aspect_ratio: "16:9",
    tags: ["Google Veo", "Runway Gen-2", "DaVinci Resolve", "AI Compositing"],
    is_published: true,
    sort_order: 1,
    published_at: "2026-03-01T10:00:00Z",
  },
  {
    type: "video",
    title: "Syston Autos Cinema",
    slug: "syston-autos-cinema",
    client_name: "Syston Autos Ltd",
    year: "2024–2025",
    description: "High-energy automotive showcase series with precision cut pacing, engine audio enhancement, cinematic color grading, and dynamic motion graphics across 6 episodes.",
    preview_image_url: "/images/work-2-syston.png",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    video_provider: "local",
    aspect_ratio: "16:9",
    tags: ["Premiere Pro", "After Effects", "Sound Design", "Color Grading"],
    is_published: true,
    sort_order: 2,
    published_at: "2026-03-02T10:00:00Z",
  },
  {
    type: "video",
    title: "Kinetic Motion & Type System",
    slug: "kinetic-motion-type-system",
    client_name: "Creative Studio",
    year: "2024",
    description: "Expressive kinetic typography showcase exploring tempo modulation, bold typographic layouts, synchronized beat drops, and geometric motion design.",
    preview_image_url: "/images/work-3-web.png",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    video_provider: "local",
    aspect_ratio: "16:9",
    tags: ["After Effects", "Kinetic Typography", "Motion Graphics", "Beat Sync"],
    is_published: true,
    sort_order: 3,
    published_at: "2026-03-03T10:00:00Z",
  },
  {
    type: "video",
    title: "Nocturne Cinema & Soundscapes",
    slug: "nocturne-cinema-soundscapes",
    client_name: "Independent Cinema",
    year: "2023–2024",
    description: "Moody atmospheric narrative piece emphasizing dialogue clarity, layered ambient foley, tonal color grades, and evocative textural cuts.",
    preview_image_url: "/images/work-4-it.png",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    video_provider: "local",
    aspect_ratio: "16:9",
    tags: ["DaVinci Resolve", "Sound Design", "Atmospheric Foley", "Color Grading"],
    is_published: true,
    sort_order: 4,
    published_at: "2026-03-04T10:00:00Z",
  },
  {
    type: "video",
    title: "B&F Cars Automotive",
    slug: "bf-cars-automotive",
    client_name: "B&F Cars",
    year: "2024–2025",
    description: "Fast-paced social media reels and showroom presentations featuring speed ramping, kinetic typography, vehicle feature highlights, and multi-platform vertical exports.",
    preview_image_url: "/images/work-5-bfcars.png",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    video_provider: "local",
    aspect_ratio: "9:16",
    tags: ["CapCut Pro", "Premiere Pro", "Motion Graphics", "9:16 Vertical Reel"],
    is_published: true,
    sort_order: 5,
    published_at: "2026-03-05T10:00:00Z",
  },
  {
    type: "web",
    title: "Flux Capital",
    slug: "flux-capital",
    client_name: "Emblem",
    year: "2026",
    description: "Flux Capital empowers innovative startups with strategic funding and expert guidance for digital success.",
    preview_image_url: "/images/aurexa/aurexa-project-1.png",
    live_url: "https://react.dev",
    github_url: "https://github.com/kamrul-islam-dev",
    can_embed: false,
    aspect_ratio: "16:9",
    tags: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    is_published: true,
    sort_order: 1,
    published_at: "2026-03-06T10:00:00Z",
  },
  {
    type: "web",
    title: "Boltshift X",
    slug: "boltshift-x",
    client_name: "Boltshift",
    year: "2026",
    description: "Boltshift X empowers brands with innovative design solutions to enhance their digital presence and achieve remarkable growth.",
    preview_image_url: "/images/aurexa/aurexa-project-2.png",
    live_url: "https://kamrulislam.bd",
    github_url: "https://github.com/kamru1i/portfolio",
    can_embed: true,
    aspect_ratio: "16:9",
    tags: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    is_published: true,
    sort_order: 2,
    published_at: "2026-03-07T10:00:00Z",
  },
  {
    type: "web",
    title: "Flux Labs",
    slug: "flux-labs",
    client_name: "Flux Studio",
    year: "2026",
    description: "Flux Labs specializes in innovative design solutions that empower brands to thrive and distinguish themselves online.",
    preview_image_url: "/images/aurexa/aurexa-project-3.png",
    live_url: "https://wordpress.org",
    github_url: null,
    can_embed: false,
    aspect_ratio: "16:9",
    tags: ["WordPress", "PHP / MySQL", "Elementor Pro", "DNS / SSL"],
    is_published: true,
    sort_order: 3,
    published_at: "2026-03-08T10:00:00Z",
  },
  {
    type: "web",
    title: "Orbital Systems",
    slug: "orbital-systems",
    client_name: "Orbital",
    year: "2024",
    description: "Orbital Systems delivers unified design engineering, precision design tokens, and robust digital ecosystems for enterprise brands.",
    preview_image_url: "/images/aurexa/aurexa-project-4.png",
    live_url: "https://cloudflare.com",
    github_url: "https://github.com/kamrul-islam-dev",
    can_embed: false,
    aspect_ratio: "16:9",
    tags: ["Cloudflare", "DNS Routing", "SSL/TLS", "Security Shield"],
    is_published: true,
    sort_order: 4,
    published_at: "2026-03-09T10:00:00Z",
  },
  {
    type: "web",
    title: "Flora & Fauna",
    slug: "flora-fauna",
    client_name: "Flora",
    year: "2026",
    description: "Flora & Fauna delivers bespoke e-commerce architecture and immersive product storytelling tailored for modern lifestyle brands.",
    preview_image_url: "/images/aurexa/aurexa-project-5.png",
    live_url: "https://react.dev",
    github_url: "https://github.com/kamrul-islam-dev",
    can_embed: false,
    aspect_ratio: "16:9",
    tags: ["Next.js", "E-Commerce", "Stripe", "Tailwind CSS"],
    is_published: true,
    sort_order: 5,
    published_at: "2026-03-10T10:00:00Z",
  },
  {
    type: "web",
    title: "Solaris Energy",
    slug: "solaris-energy",
    client_name: "Emblem",
    year: "2026",
    description: "Solaris Energy harnesses the sun's power to provide sustainable, innovative solutions for a brighter future.",
    preview_image_url: "/images/aurexa/aurexa-project-6.png",
    live_url: "https://react.dev",
    github_url: "https://github.com/kamrul-islam-dev",
    can_embed: false,
    aspect_ratio: "16:9",
    tags: ["Clean Energy", "UI Systems", "TypeScript", "Performance"],
    is_published: true,
    sort_order: 6,
    published_at: "2026-03-11T10:00:00Z",
  },
];

async function seed() {
  console.log(`🚀 Seeding ${initialProjects.length} projects into Supabase...`);
  for (const project of initialProjects) {
    const { error } = await supabase.from("projects").upsert(project, { onConflict: "slug" });
    if (error) {
      console.error(`❌ Error seeding ${project.title}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${project.title} (${project.type})`);
    }
  }
  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
