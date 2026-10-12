import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const publicImagesDir = path.join(projectRoot, 'public', 'images');

function getBase64Image(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const ext = path.extname(filePath).replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const portraitBase64 = getBase64Image(path.join(publicImagesDir, 'Kamrul I.png'));
const studioBgBase64 = getBase64Image(path.join(publicImagesDir, 'og-studio-bg.jpg'));

// Template: Creative Studio Suite (Refined based on user feedback)
const htmlStudioRefined = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #080a12;
      color: #fff;
      position: relative;
    }
    .bg {
      position: absolute;
      inset: 0;
      background-image: url('${studioBgBase64}');
      background-size: cover;
      background-position: center;
      opacity: 0.82;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(8,10,18,0.97) 0%, rgba(8,10,18,0.88) 48%, rgba(8,10,18,0.4) 78%, rgba(8,10,18,0.2) 100%);
    }
    .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 75% 50%, transparent 45%, rgba(6,7,12,0.7) 100%);
    }
    .content {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 65px;
    }
    .left {
      width: 610px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 7px 16px;
      border-radius: 9999px;
      width: fit-content;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }
    .badge-text {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #34d399;
      text-transform: uppercase;
    }
    .title {
      font-size: 56px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }
    .role-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      line-height: 1.4;
    }
    .role-item {
      color: #38bdf8;
      text-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
    }
    .role-sep {
      color: #c084fc;
      font-weight: 900;
    }
    .desc {
      font-size: 16px;
      line-height: 1.5;
      color: #cbd5e1;
      max-width: 580px;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-top: 3px;
    }
    .pill {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.22);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
      color: #f1f5f9;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .footer-url {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 8px 18px;
      border-radius: 9999px;
      width: fit-content;
      margin-top: 5px;
    }
    .footer-url svg {
      width: 15px;
      height: 15px;
      fill: #38bdf8;
    }
    .footer-url span {
      font-size: 13.5px;
      font-weight: 600;
      color: #f8fafc;
      letter-spacing: 0.5px;
    }
    .right {
      position: relative;
      width: 450px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-wrap {
      position: relative;
      width: 450px;
      height: 550px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-glow {
      position: absolute;
      width: 410px;
      height: 410px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 75%);
      filter: blur(45px);
      border-radius: 50%;
      z-index: 1;
    }
    .portrait-img {
      position: relative;
      z-index: 2;
      width: 440px;
      height: 440px;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.95));
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="vignette"></div>
  <div class="content">
    <div class="left">
      <div class="badge">
        <div class="badge-dot"></div>
        <span class="badge-text">Kamrul I • Portfolio</span>
      </div>
      <h1 class="title">KAMRUL ISLAM</h1>
      <div class="role-container">
        <span class="role-item">Video Editor</span>
        <span class="role-sep">•</span>
        <span class="role-item">AI-Assisted Content Creator</span>
        <span class="role-sep">•</span>
        <span class="role-item">Web Developer</span>
        <span class="role-sep">•</span>
        <span class="role-item">IT Specialist</span>
      </div>
      <p class="desc">
        Cinematic video storytelling, AI-assisted content creation, high-performance web engineering, and enterprise IT infrastructure.
      </p>
      <div class="pills">
        <span class="pill">🎬 Video Production</span>
        <span class="pill">🤖 AI Content Creation</span>
        <span class="pill">💻 Full-Stack Web Dev</span>
        <span class="pill">🛠️ Systems Engineering</span>
        <span class="pill">⚡ IT Infrastructure</span>
      </div>
      <div class="footer-url">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <span>kamrulislam-bd.netlify.app</span>
      </div>
    </div>
    <div class="right">
      <div class="portrait-wrap">
        <div class="portrait-glow"></div>
        <img class="portrait-img" src="${portraitBase64}" alt="Kamrul Islam" />
      </div>
    </div>
  </div>
</body>
</html>
`;

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });

  await page.setContent(htmlStudioRefined, { waitUntil: 'networkidle' });

  // Save the refined card to og-card-studio
  const jpgPath = path.join(publicImagesDir, 'og-card-studio.jpg');
  const pngPath = path.join(publicImagesDir, 'og-card-studio.png');
  await page.screenshot({ path: pngPath, type: 'png' });
  await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });

  // Also update primary og images so this becomes the default active card
  const primaryJpg = path.join(publicImagesDir, 'og-card-vibrant.jpg');
  const primaryPng = path.join(publicImagesDir, 'og-card-vibrant.png');
  const fallbackJpg = path.join(publicImagesDir, 'og-image.jpg');
  const fallbackKamrulJpg = path.join(publicImagesDir, 'og-kamrul-islam.jpg');

  fs.copyFileSync(jpgPath, primaryJpg);
  fs.copyFileSync(pngPath, primaryPng);
  fs.copyFileSync(jpgPath, fallbackJpg);
  fs.copyFileSync(jpgPath, fallbackKamrulJpg);

  const jpgSize = fs.statSync(jpgPath).size;
  console.log(`Successfully generated updated Creative Studio card: ${(jpgSize / 1024).toFixed(1)} KB`);

  await browser.close();
}

run().catch(console.error);
