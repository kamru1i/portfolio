import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const publicImagesDir = path.join(projectRoot, 'public', 'images');

// Read assets as base64 for reliable standalone rendering in Playwright
function getBase64Image(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const ext = path.extname(filePath).replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const portraitBase64 = getBase64Image(path.join(publicImagesDir, 'Kamrul I.png'));
const vibrantBgBase64 = getBase64Image(path.join(publicImagesDir, 'og-vibrant-bg.jpg'));
const studioBgBase64 = getBase64Image(path.join(publicImagesDir, 'og-studio-bg.jpg'));

// Template A: Vibrant Cyber-Studio (Timeline + Neon Glow + Perfect Portrait Spacing)
const htmlOptionA = `
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
      background: #090b10;
      color: #fff;
      position: relative;
    }
    .bg {
      position: absolute;
      inset: 0;
      background-image: url('${vibrantBgBase64}');
      background-size: cover;
      background-position: center;
      opacity: 0.85;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(7,9,15,0.95) 0%, rgba(7,9,15,0.85) 45%, rgba(7,9,15,0.3) 75%, rgba(7,9,15,0.1) 100%);
    }
    .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 75% 50%, transparent 40%, rgba(5,6,10,0.7) 100%);
    }
    .content {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 70px;
    }
    .left {
      width: 580px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 8px 16px;
      border-radius: 9999px;
      width: fit-content;
    }
    .brand-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }
    .brand-text {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #34d399;
      text-transform: uppercase;
    }
    .title {
      font-size: 58px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }
    .role {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 1.5px;
      color: #38bdf8;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .role span {
      color: #818cf8;
    }
    .desc {
      font-size: 17px;
      line-height: 1.5;
      color: #94a3b8;
      max-width: 520px;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
    }
    .pill {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #cbd5e1;
    }
    .footer-url {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 8px 18px;
      border-radius: 9999px;
      width: fit-content;
      margin-top: 10px;
    }
    .footer-url svg {
      width: 16px;
      height: 16px;
      fill: #38bdf8;
    }
    .footer-url span {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.5px;
    }
    .right {
      position: relative;
      width: 460px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-wrap {
      position: relative;
      width: 460px;
      height: 550px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-glow {
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 75%);
      filter: blur(40px);
      border-radius: 50%;
      z-index: 1;
    }
    .portrait-img {
      position: relative;
      z-index: 2;
      width: 440px;
      height: 440px;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.9));
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="vignette"></div>
  <div class="content">
    <div class="left">
      <div class="brand-badge">
        <div class="brand-dot"></div>
        <span class="brand-text">Kamrul I • Portfolio</span>
      </div>
      <h1 class="title">KAMRUL ISLAM</h1>
      <div class="role">
        Video Editor <span>•</span> AI Creator <span>•</span> Web Dev
      </div>
      <p class="desc">
        Crafting cinematic video stories, AI-assisted visual media, and high-performance digital experiences.
      </p>
      <div class="pills">
        <span class="pill">🎬 Commercial Edits</span>
        <span class="pill">⚡ Motion Graphics</span>
        <span class="pill">🤖 AI Content</span>
        <span class="pill">💻 Web Development</span>
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

// Template B: Creative Studio Suite (Studio Backdrop + Neon Atmosphere)
const htmlOptionB = `
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
      background: #080a11;
      color: #fff;
      position: relative;
    }
    .bg {
      position: absolute;
      inset: 0;
      background-image: url('${studioBgBase64}');
      background-size: cover;
      background-position: center;
      opacity: 0.8;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(8,10,17,0.96) 0%, rgba(8,10,17,0.85) 50%, rgba(8,10,17,0.4) 80%, rgba(8,10,17,0.2) 100%);
    }
    .content {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 70px;
    }
    .left {
      width: 580px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 8px 16px;
      border-radius: 9999px;
      width: fit-content;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 10px #38bdf8;
    }
    .badge-text {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #7dd3fc;
      text-transform: uppercase;
    }
    .title {
      font-size: 58px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }
    .role {
      font-size: 21px;
      font-weight: 700;
      color: #f43f5e;
      letter-spacing: 1px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .role span {
      color: #a855f7;
    }
    .desc {
      font-size: 17px;
      line-height: 1.5;
      color: #cbd5e1;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .pill {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(148, 163, 184, 0.2);
      padding: 8px 15px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .footer-url {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.4);
      padding: 8px 18px;
      border-radius: 9999px;
      width: fit-content;
      margin-top: 10px;
    }
    .footer-url svg {
      width: 16px;
      height: 16px;
      fill: #c084fc;
    }
    .footer-url span {
      font-size: 14px;
      font-weight: 600;
      color: #f8fafc;
      letter-spacing: 0.5px;
    }
    .right {
      position: relative;
      width: 460px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-wrap {
      position: relative;
      width: 460px;
      height: 550px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-glow {
      position: absolute;
      width: 420px;
      height: 420px;
      background: radial-gradient(circle, rgba(244, 63, 94, 0.35) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 75%);
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
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.9));
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="left">
      <div class="badge">
        <div class="badge-dot"></div>
        <span class="badge-text">Creative Studio • Portfolio</span>
      </div>
      <h1 class="title">KAMRUL ISLAM</h1>
      <div class="role">
        Video Editor <span>•</span> AI Content <span>•</span> Web Dev
      </div>
      <p class="desc">
        Specialized in viral commercial storytelling, high-end YouTube production, AI workflows, and modern web systems.
      </p>
      <div class="pills">
        <span class="pill">🎥 Video Production</span>
        <span class="pill">✨ AI Media</span>
        <span class="pill">⚡ Full-Stack Code</span>
        <span class="pill">🛠️ Systems Engineering</span>
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

// Template C: Modern Tech Dark with Clean Padding & Subtle Waveforms
const htmlOptionC = `
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
      background: #0a0d14;
      color: #fff;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.18) 0%, transparent 60%),
        radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
    }
    .border-frame {
      position: absolute;
      inset: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      pointer-events: none;
    }
    .content {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 70px;
    }
    .left {
      width: 580px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 7px 15px;
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
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #34d399;
      text-transform: uppercase;
    }
    .title {
      font-size: 58px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.05;
      color: #ffffff;
    }
    .role {
      font-size: 19px;
      font-weight: 600;
      letter-spacing: 1.2px;
      color: #38bdf8;
      text-transform: uppercase;
    }
    .desc {
      font-size: 17px;
      line-height: 1.5;
      color: #94a3b8;
    }
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .pill {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #cbd5e1;
    }
    .footer-url {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 8px 18px;
      border-radius: 9999px;
      width: fit-content;
      margin-top: 10px;
    }
    .footer-url svg {
      width: 16px;
      height: 16px;
      fill: #38bdf8;
    }
    .footer-url span {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.5px;
    }
    .right {
      position: relative;
      width: 460px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-wrap {
      position: relative;
      width: 460px;
      height: 550px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portrait-glow {
      position: absolute;
      width: 410px;
      height: 410px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 75%);
      filter: blur(40px);
      border-radius: 50%;
      z-index: 1;
    }
    .portrait-img {
      position: relative;
      z-index: 2;
      width: 440px;
      height: 440px;
      object-fit: contain;
      filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.9));
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="border-frame"></div>
  <div class="content">
    <div class="left">
      <div class="badge">
        <div class="badge-dot"></div>
        <span class="badge-text">Kamrul I • Portfolio</span>
      </div>
      <h1 class="title">KAMRUL ISLAM</h1>
      <div class="role">Video Editor • AI Content • Web Dev</div>
      <p class="desc">
        Explore projects in cinematic video editing, AI media creation, full-stack web applications, and IT infrastructure.
      </p>
      <div class="pills">
        <span class="pill">Creative Storytelling</span>
        <span class="pill">AI Visual Media</span>
        <span class="pill">Web Apps & WordPress</span>
        <span class="pill">IT Support</span>
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

async function generateCards() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });

  const cards = [
    { name: 'og-card-vibrant', html: htmlOptionA },
    { name: 'og-card-studio', html: htmlOptionB },
    { name: 'og-card-clean', html: htmlOptionC }
  ];

  for (const card of cards) {
    await page.setContent(card.html, { waitUntil: 'networkidle' });
    
    // Save PNG
    const pngPath = path.join(publicImagesDir, `${card.name}.png`);
    await page.screenshot({ path: pngPath, type: 'png' });
    
    // Save optimized JPEG (< 200KB for WhatsApp compatibility)
    const jpgPath = path.join(publicImagesDir, `${card.name}.jpg`);
    await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
    
    const pngSize = fs.statSync(pngPath).size;
    const jpgSize = fs.statSync(jpgPath).size;
    console.log(`Generated ${card.name}: PNG = ${(pngSize/1024).toFixed(1)} KB, JPG = ${(jpgSize/1024).toFixed(1)} KB`);
  }

  await browser.close();
}

generateCards().catch(console.error);
