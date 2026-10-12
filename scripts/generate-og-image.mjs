import sharp from "sharp";
import fs from "fs";
import path from "path";

async function generateOgImage() {
  const WIDTH = 1200;
  const HEIGHT = 630;

  console.log("Reading photo from public/images/Kamrul I.png...");
  const photoPath = path.resolve("public/images/Kamrul I.png");
  const photoBuf = fs.readFileSync(photoPath);

  // Subject bounding box in original 2610x2610:
  // left: 363, top: 115, width: 1885, height: 2415
  const croppedPhoto = await sharp(photoBuf)
    .extract({
      left: 360,
      top: 110,
      width: 1890,
      height: 2420,
    })
    .resize({
      height: 580,
      fit: "contain",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();

  const photoMeta = await sharp(croppedPhoto).metadata();
  console.log("Processed photo size:", photoMeta.width, "x", photoMeta.height);

  // We'll place the photo on the right:
  const photoLeft = WIDTH - photoMeta.width - 32; // ~715
  const photoTop = HEIGHT - photoMeta.height;     // 50 (sits flush at canvas bottom 630)

  // Construct SVG overlay for background elements, frames, glowing spots, and typography
  const svgOverlay = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background base gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#08080a" />
        <stop offset="50%" stop-color="#0d0d11" />
        <stop offset="100%" stop-color="#050507" />
      </linearGradient>

      <!-- Soft ambient radial behind portrait -->
      <radialGradient id="portraitGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#2a2836" stop-opacity="0.65" />
        <stop offset="50%" stop-color="#181722" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0d0d11" stop-opacity="0" />
      </radialGradient>

      <!-- Subtle ambient radial behind text -->
      <radialGradient id="textGlow" cx="20%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#1c1f2e" stop-opacity="0.45" />
        <stop offset="60%" stop-color="#11131a" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#08080a" stop-opacity="0" />
      </radialGradient>

      <!-- Divider line gradient -->
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
      </linearGradient>
    </defs>

    <!-- Base Canvas Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" />

    <!-- Ambient Spotlights -->
    <ellipse cx="280" cy="240" rx="420" ry="320" fill="url(#textGlow)" />
    <ellipse cx="940" cy="340" rx="360" ry="320" fill="url(#portraitGlow)" />

    <!-- Subtle Editorial Grid / Dots pattern -->
    <g opacity="0.12">
      <circle cx="80" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="160" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="240" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="320" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="400" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="480" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="560" cy="80" r="1.5" fill="#ffffff" />
      <circle cx="640" cy="80" r="1.5" fill="#ffffff" />

      <circle cx="80" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="160" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="240" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="320" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="400" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="480" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="560" cy="550" r="1.5" fill="#ffffff" />
      <circle cx="640" cy="550" r="1.5" fill="#ffffff" />
    </g>

    <!-- Outer Architectural Hairline Frame -->
    <rect x="28" y="28" width="1144" height="574" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

    <!-- Refined Corner Crosshairs -->
    <path d="M 22 28 L 34 28 M 28 22 L 28 34" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />
    <path d="M 1166 28 L 1178 28 M 1172 22 L 1172 34" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />
    <path d="M 22 602 L 34 602 M 28 596 L 28 608" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />
    <path d="M 1166 602 L 1178 602 M 1172 596 L 1172 608" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />

    <!-- ============================================================ -->
    <!-- LEFT CONTENT AREA: Typography and Badges                     -->
    <!-- ============================================================ -->

    <!-- 1. Top Brand Pill -->
    <g transform="translate(76, 76)">
      <rect x="0" y="0" width="224" height="34" rx="17" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      <!-- Green pulse dot -->
      <circle cx="18" cy="17" r="4.5" fill="#22c55e" />
      <circle cx="18" cy="17" r="7.5" fill="#22c55e" opacity="0.25" />
      <text x="32" y="22" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.8" fill="#e4e4e7">KAMRUL I  ·  PORTFOLIO</text>
    </g>

    <!-- 2. Primary Name: KAMRUL ISLAM -->
    <!-- Large, commanding editorial serif / display title -->
    <text x="76" y="200" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5" fill="#ffffff">
      KAMRUL ISLAM
    </text>

    <!-- 3. Professional Roles Banner -->
    <!-- Clear, highly legible, professional titles -->
    <text x="78" y="248" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="18.5" font-weight="600" letter-spacing="1.2" fill="#a1a1aa">
      VIDEO EDITOR  ·  AI CONTENT CREATOR  ·  WEB DEVELOPER
    </text>

    <!-- 4. Subtle Hairline Divider -->
    <rect x="78" y="280" width="540" height="1" fill="url(#lineGrad)" />

    <!-- 5. Supporting Value Statement -->
    <text x="78" y="325" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="17" font-weight="400" letter-spacing="0.2" fill="#d4d4d8">
      Creative Storytelling  ·  AI-Assisted Content  ·  Digital Solutions
    </text>

    <!-- 6. Four Core Pillars / Capability Tags -->
    <g transform="translate(78, 362)">
      <!-- Pillar 1: Video Post-Production -->
      <rect x="0" y="0" width="138" height="30" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="14" y="19" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" letter-spacing="0.4">Commercial Edits</text>

      <!-- Pillar 2: Generative AI -->
      <rect x="148" y="0" width="128" height="30" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="162" y="19" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" letter-spacing="0.4">AI Visual Media</text>

      <!-- Pillar 3: Web Engineering -->
      <rect x="286" y="0" width="134" height="30" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="300" y="19" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" letter-spacing="0.4">Web Development</text>

      <!-- Pillar 4: IT Operations -->
      <rect x="430" y="0" width="124" height="30" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
      <text x="444" y="19" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" fill="#a1a1aa" letter-spacing="0.4">IT Management</text>
    </g>

    <!-- 7. Bottom Website Domain Anchor -->
    <g transform="translate(78, 510)">
      <rect x="0" y="0" width="310" height="42" rx="21" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.16)" stroke-width="1" />
      <!-- Globe icon SVG -->
      <g transform="translate(18, 11)" stroke="#e4e4e7" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10" cy="10" r="8" />
        <line x1="2" y1="10" x2="18" y2="10" />
        <path d="M10 2a13 13 0 0 1 0 16 13 13 0 0 1 0-16z" />
      </g>
      <text x="48" y="26" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="14.5" font-weight="600" letter-spacing="0.6" fill="#ffffff">
        kamrulislam-bd.netlify.app
      </text>
    </g>

    <!-- Subtle vertical hairline separator between text and photo -->
    <line x1="680" y1="100" x2="680" y2="540" stroke="rgba(255, 255, 255, 0.06)" stroke-width="1" stroke-dasharray="4 6" />
  </svg>
  `;

  // Composite the SVG base and the photo
  console.log("Compositing layers with sharp...");
  const compositeImage = await sharp(Buffer.from(svgOverlay))
    .composite([
      {
        input: croppedPhoto,
        top: photoTop,
        left: photoLeft,
      },
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  const outputPathPng = path.resolve("public/images/og-kamrul-islam.png");
  fs.writeFileSync(outputPathPng, compositeImage);
  console.log("Saved PNG to:", outputPathPng);
  console.log("File size (KB):", Math.round(compositeImage.length / 1024));

  // Also save a lightweight JPG version (~120KB) which is universally supported across WhatsApp, Messenger, etc.
  const compositeJpg = await sharp(compositeImage)
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  const outputPathJpg = path.resolve("public/images/og-kamrul-islam.jpg");
  fs.writeFileSync(outputPathJpg, compositeJpg);
  console.log("Saved JPG to:", outputPathJpg);
  console.log("File size (KB):", Math.round(compositeJpg.length / 1024));
}

generateOgImage().catch(console.error);
