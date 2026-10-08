import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const outDir = path.resolve(process.cwd(), ".qa/wordmark-qa");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // HTML test page with the new KAMRUL wordmark
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background: #000;
      color: #fff;
      font-family: sans-serif;
      padding: 40px;
      margin: 0;
    }
    .test-box {
      margin-bottom: 50px;
      background: #080808;
      border: 1px solid #222;
      padding: 30px;
      border-radius: 8px;
    }
    h2 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #888;
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div class="test-box">
    <h2>1. Full Large Wordmark (440x78) - KAMRUL</h2>
    <svg viewBox="0 0 440 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 539px; height: auto;">
      <!-- K -->
      <path d="M0 0H24V78H0V0Z" fill="#fff" />
      <path d="M22 41L64 0H92L44 45L92 78H64L22 47V41Z" fill="#fff" />

      <!-- A -->
      <path d="M88 78L120 0H144L176 78H151L145 61H119L113 78H88ZM125 45H139L132 20L125 45Z" fill="#fff" />

      <!-- M with right stem at 228-250 -->
      <path d="M170 0H192L210 46L228 0H250V78H228V24L216 58H204L190 24V78H170V0Z" fill="#fff" />

      <!-- R: Shared stem at 228-250, loop branches at 250, leg kicks to 308 -->
      <path d="M248 0H286C299 0 307 9 307 23C307 33 300 41 290 43L308 78H284L268 46H248V0ZM248 15V31H282C286 31 288 28 288 23C288 18 286 15 282 15H248Z" fill="#fff" />

      <!-- U (starts at 316, width 60 -> ends at 376) -->
      <path d="M316 0H338V54C338 61 341 64 346 64C351 64 354 61 354 54V0H376V54C376 70 365 78 346 78C327 78 316 70 316 54V0Z" fill="#fff" />

      <!-- L (starts at 384, width 52 -> ends at 436) -->
      <path d="M384 0H406V62H436V78H384V0Z" fill="#fff" />
    </svg>
  </div>

  <div class="test-box">
    <h2>2. Compact Navbar Size (~226px wide, ~40px high)</h2>
    <svg viewBox="0 0 440 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 226px; height: 40px;">
      <!-- K -->
      <path d="M0 0H24V78H0V0Z" fill="#fff" />
      <path d="M22 41L64 0H92L44 45L92 78H64L22 47V41Z" fill="#fff" />

      <!-- A -->
      <path d="M88 78L120 0H144L176 78H151L145 61H119L113 78H88ZM125 45H139L132 20L125 45Z" fill="#fff" />

      <!-- M with right stem at 228-250 -->
      <path d="M170 0H192L210 46L228 0H250V78H228V24L216 58H204L190 24V78H170V0Z" fill="#fff" />

      <!-- R -->
      <path d="M248 0H286C299 0 307 9 307 23C307 33 300 41 290 43L308 78H284L268 46H248V0ZM248 15V31H282C286 31 288 28 288 23C288 18 286 15 282 15H248Z" fill="#fff" />

      <!-- U -->
      <path d="M316 0H338V54C338 61 341 64 346 64C351 64 354 61 354 54V0H376V54C376 70 365 78 346 78C327 78 316 70 316 54V0Z" fill="#fff" />

      <!-- L -->
      <path d="M384 0H406V62H436V78H384V0Z" fill="#fff" />
    </svg>
  </div>

  <div class="test-box">
    <h2>3. Close-up on M-R Junction (Zoomed In)</h2>
    <svg viewBox="160 0 160 78" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 500px; height: 240px; background: #111;">
      <!-- M -->
      <path d="M170 0H192L210 46L228 0H250V78H228V24L216 58H204L190 24V78H170V0Z" fill="#fff" />

      <!-- R -->
      <path d="M248 0H288C301 0 309 9 309 23C309 34 302 41 292 44L310 78H286L270 46H248V0ZM248 16V32H283C287 32 289 29 289 24C289 19 287 16 283 16H248Z" fill="#fff" />
    </svg>
  </div>
</body>
</html>`;

  const htmlPath = path.join(outDir, "test.html");
  fs.writeFileSync(htmlPath, htmlContent);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto("file://" + htmlPath.replace(/\\/g, "/"));
  const screenshotPath = path.join(outDir, "wordmark-test.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  console.log("Screenshot saved to", screenshotPath);
}

main().catch(console.error);
