import fs from "fs";
import path from "path";

const OUT = path.resolve("public/images");
fs.mkdirSync(OUT, { recursive: true });

// Helper to write SVG
function writeSvg(filename, content) {
  fs.writeFileSync(path.join(OUT, filename), content.trim());
  console.log(`wrote ${filename}`);
}

// 1. Biqolpo - AI Video Storytelling (moody cinematic noir / orange glow like reference hero)
writeSvg(
  "project-biqolpo.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <radialGradient id="g1" cx="60%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#ff5500" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#661100" stop-opacity="0.6"/>
      <stop offset="85%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0"/>
      <feComposite in2="SourceGraphic" in="glitch" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="#09090b"/>
  <circle cx="480" cy="460" r="320" fill="url(#g1)"/>
  <!-- Silhouette Figure -->
  <g fill="#000" opacity="0.9">
    <ellipse cx="440" cy="380" rx="42" ry="54"/>
    <path d="M 390 440 Q 440 430 490 440 L 520 720 L 360 720 Z"/>
    <path d="M 440 440 Q 580 470 680 500 L 640 540 Q 540 500 440 470 Z" opacity="0.6"/>
  </g>
  <!-- Technical Monospace Overlay -->
  <g font-family="monospace" font-size="14" fill="#ffffff" opacity="0.75" letter-spacing="2">
    <text x="50" y="80">BIQOLPO // AI LAB</text>
    <text x="50" y="105" opacity="0.5">MODEL: VEO + KLING 3.0</text>
    <text x="50" y="900">SCENE 03 : LATENT CHRONICLES</text>
    <text x="50" y="925" opacity="0.5">FRAME RATE: 24.0 FPS CINEMATIC</text>
    <text x="650" y="80" text-anchor="end">4K RAW</text>
  </g>
  <!-- Framing Hairlines -->
  <line x1="50" y1="130" x2="750" y2="130" stroke="#ffffff" stroke-opacity="0.15"/>
  <line x1="50" y1="860" x2="750" y2="860" stroke="#ffffff" stroke-opacity="0.15"/>
</svg>`
);

// 2. Syston Autos - High-Octane Automotive Cinema (warm vintage poster art style like MATCH POINT)
writeSvg(
  "project-syston.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="sg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1613"/>
      <stop offset="50%" stop-color="#8c3e1e"/>
      <stop offset="100%" stop-color="#d97736"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="#0c0a09"/>
  <!-- Bold Geometric Backdrop like Match Point -->
  <circle cx="850" cy="450" r="340" fill="#a0441d"/>
  <circle cx="400" cy="450" r="280" fill="#36312a" opacity="0.8"/>
  <rect x="520" y="160" width="160" height="580" rx="80" fill="#d97736" opacity="0.85"/>
  <circle cx="340" cy="280" r="140" fill="#e5dfd4" opacity="0.9"/>
  <!-- Dynamic Car Silhouette Vector -->
  <g fill="#090807" transform="translate(180, 320)">
    <path d="M 50 240 C 90 220, 180 200, 300 150 C 440 100, 600 95, 750 150 C 820 180, 870 210, 920 240 L 920 290 C 890 290, 860 260, 800 260 C 740 260, 710 290, 680 290 L 300 290 C 270 290, 240 260, 180 260 C 120 260, 90 290, 60 290 Z"/>
    <circle cx="180" cy="270" r="50" fill="#1a1816"/>
    <circle cx="180" cy="270" r="30" fill="#78716c"/>
    <circle cx="750" cy="270" r="50" fill="#1a1816"/>
    <circle cx="750" cy="270" r="30" fill="#78716c"/>
  </g>
  <!-- Editorial Monospace Labels -->
  <g font-family="monospace" font-size="16" fill="#f5f5f4" letter-spacing="3">
    <text x="80" y="100">SYSTON AUTOS LTD // 06 EPISODES</text>
    <text x="80" y="820" opacity="0.7">SHORT-FORM VIRAL REELS · PACING &amp; SOUND DESIGN</text>
    <text x="1120" y="100" text-anchor="end">2024–2025</text>
  </g>
</svg>`
);

// 3. Velocity Digital - Type Specimen & Web Interface Grid (monochrome brutalist like SO! SO! SO!)
writeSvg(
  "project-web.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <rect width="1200" height="900" fill="#d4d4d8"/>
  <!-- Giant Bold Typography Blocks -->
  <text x="600" y="300" font-family="sans-serif" font-weight="900" font-size="280" fill="#18181b" text-anchor="middle" letter-spacing="-10">DEV!</text>
  <line x1="80" y1="360" x2="1120" y2="360" stroke="#18181b" stroke-width="3"/>
  <g font-family="monospace" font-size="14" fill="#27272a">
    <text x="100" y="410">FRAMEWORK: NEXT.JS 15</text>
    <text x="500" y="410">STACK: REACT / TYPESCRIPT</text>
    <text x="900" y="410">STYLE: TAILWIND CSS</text>
  </g>
  <line x1="80" y1="440" x2="1120" y2="440" stroke="#18181b" stroke-width="3"/>
  <text x="600" y="690" font-family="sans-serif" font-weight="900" font-size="280" fill="#18181b" text-anchor="middle" letter-spacing="-10">CODE</text>
  <line x1="80" y1="740" x2="1120" y2="740" stroke="#18181b" stroke-width="3"/>
  <g font-family="monospace" font-size="14" fill="#27272a">
    <text x="100" y="785">API: REST + GRAPHQL</text>
    <text x="500" y="785">STATE: MODULAR REACT</text>
    <text x="900" y="785">VELOCITY DIGITAL INC.</text>
  </g>
</svg>`
);

// 4. B&F Corporate IT Infrastructure (high-tech blueprint / technical network schema like Nocturne Heart)
writeSvg(
  "project-it.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="bgIt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bgIt)"/>
  <!-- Server Topology Grid -->
  <g stroke="#38bdf8" stroke-opacity="0.25" stroke-width="1" fill="none">
    <circle cx="600" cy="450" r="180"/>
    <circle cx="600" cy="450" r="280" stroke-dasharray="6 6"/>
    <circle cx="600" cy="450" r="380"/>
    <line x1="100" y1="450" x2="1100" y2="450"/>
    <line x1="600" y1="100" x2="600" y2="800"/>
    <line x1="250" y1="200" x2="950" y2="700"/>
    <line x1="250" y1="700" x2="950" y2="200"/>
  </g>
  <!-- Node Circles & Indicators -->
  <g fill="#38bdf8">
    <circle cx="600" cy="450" r="12"/>
    <circle cx="420" cy="450" r="8"/>
    <circle cx="780" cy="450" r="8"/>
    <circle cx="600" cy="270" r="8"/>
    <circle cx="600" cy="630" r="8"/>
    <circle cx="350" cy="270" r="6" fill="#34d399"/>
    <circle cx="850" cy="270" r="6" fill="#34d399"/>
    <circle cx="350" cy="630" r="6" fill="#34d399"/>
    <circle cx="850" cy="630" r="6" fill="#34d399"/>
  </g>
  <!-- Architecture Labels -->
  <g font-family="monospace" font-size="13" fill="#bae6fd" letter-spacing="2">
    <text x="620" y="445">CORE: cPanel HOSTING &amp; DNS CLUSTER</text>
    <text x="440" y="440">SSL CERT AUTO-RENEW</text>
    <text x="790" y="440">OFFICE LAN / VPN</text>
    <text x="60" y="80">B&amp;F CORPORATE INFRASTRUCTURE</text>
    <text x="60" y="105" fill="#34d399">STATUS: 99.98% UPTIME</text>
    <text x="1140" y="80" text-anchor="end">SYSADMIN 2024–2026</text>
  </g>
</svg>`
);

// 5. B&F Cars - Automotive Social Campaign (purple & black angular duotone like Cutform Portraits)
writeSvg(
  "project-bfcars.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <rect width="800" height="1000" fill="#090514"/>
  <!-- Angular Geometric Purple Slices -->
  <polygon points="120,80 680,180 580,820 80,720" fill="#6b21a8" opacity="0.6"/>
  <polygon points="200,160 740,240 640,880 140,800" fill="#a855f7" opacity="0.3"/>
  <!-- Dynamic Typographic Cut -->
  <text x="400" y="520" font-family="sans-serif" font-weight="900" font-size="120" fill="#ffffff" text-anchor="middle" letter-spacing="4">B&amp;F CARS</text>
  <text x="400" y="580" font-family="monospace" font-size="18" fill="#e9d5ff" text-anchor="middle" letter-spacing="6">AUTOMOTIVE EDITORIAL</text>
  <g font-family="monospace" font-size="13" fill="#ffffff" opacity="0.8">
    <text x="60" y="90">CAMPAIGN // SOCIAL</text>
    <text x="60" y="940">PACING · AUDIO FX · COLOR GRADE</text>
    <text x="740" y="940" text-anchor="end">05 REELS</text>
  </g>
</svg>`
);

// 6. Service Preview Thumbnails (for floating row hovers)
writeSvg(
  "service-video.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <rect width="400" height="240" fill="#18181b"/>
  <rect x="20" y="20" width="360" height="130" rx="8" fill="#27272a"/>
  <!-- Audio & Video Multi-track -->
  <line x1="30" y1="170" x2="370" y2="170" stroke="#f97316" stroke-width="4"/>
  <line x1="30" y1="190" x2="370" y2="190" stroke="#38bdf8" stroke-width="4"/>
  <line x1="30" y1="210" x2="370" y2="210" stroke="#a855f7" stroke-width="4"/>
  <polygon points="190,70 230,85 190,100" fill="#f97316"/>
  <text x="30" y="50" font-family="monospace" font-size="12" fill="#ffffff">POST-PRODUCTION // EDIT</text>
</svg>`
);

writeSvg(
  "service-ai.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <rect width="400" height="240" fill="#0c1222"/>
  <circle cx="200" cy="120" r="70" fill="#0284c7" opacity="0.6"/>
  <circle cx="230" cy="110" r="50" fill="#38bdf8" opacity="0.8"/>
  <text x="200" y="125" font-family="monospace" font-size="14" fill="#ffffff" text-anchor="middle">PROMPT → LATENT</text>
  <text x="20" y="35" font-family="monospace" font-size="12" fill="#7dd3fc">GENERATIVE VIDEO LAB</text>
</svg>`
);

writeSvg(
  "service-web.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <rect width="400" height="240" fill="#052e16"/>
  <rect x="30" y="40" width="340" height="160" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1"/>
  <text x="50" y="80" font-family="monospace" font-size="14" fill="#86efac">&lt;React.Component /&gt;</text>
  <text x="50" y="115" font-family="monospace" font-size="12" fill="#bbf7d0">const [ui, setUI] = useState();</text>
  <text x="50" y="150" font-family="monospace" font-size="12" fill="#4ade80">NEXT.JS 15 + TAILWIND</text>
</svg>`
);

writeSvg(
  "service-it.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <rect width="400" height="240" fill="#1e1b4b"/>
  <g stroke="#818cf8" stroke-width="2" fill="none">
    <rect x="40" y="40" width="320" height="40" rx="4"/>
    <rect x="40" y="100" width="320" height="40" rx="4"/>
    <rect x="40" y="160" width="320" height="40" rx="4"/>
  </g>
  <circle cx="70" cy="60" r="5" fill="#22c55e"/>
  <circle cx="70" cy="120" r="5" fill="#22c55e"/>
  <circle cx="70" cy="180" r="5" fill="#22c55e"/>
  <text x="95" y="65" font-family="monospace" font-size="12" fill="#c7d2fe">SERVER NODE 01 : HOSTING / DNS</text>
  <text x="95" y="125" font-family="monospace" font-size="12" fill="#c7d2fe">SERVER NODE 02 : VPN GATEWAY</text>
  <text x="95" y="185" font-family="monospace" font-size="12" fill="#c7d2fe">SERVER NODE 03 : MAIL / CCTV</text>
</svg>`
);
