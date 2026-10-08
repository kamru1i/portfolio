import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/logo-comparison");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Render a minimal test page with both fonts
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @font-face {
            font-family: "Gambarino";
            src: url("http://localhost:3000/fonts/gambarino.woff2") format("woff2");
          }
          @font-face {
            font-family: "Inter";
            src: url("http://localhost:3000/fonts/inter-500.woff2") format("woff2");
            font-weight: 700 900;
          }
          body {
            background-color: #000;
            color: #fff;
            padding: 40px;
            font-family: sans-serif;
          }
          .title { color: #888; font-size: 14px; margin-bottom: 8px; font-family: monospace; }
          .sample-box { margin-bottom: 50px; border-bottom: 1px solid #222; padding-bottom: 30px; }
          .option-aurexa-sans {
            font-family: "Inter", -apple-system, sans-serif;
            font-weight: 900;
            font-size: 46px;
            letter-spacing: -0.04em;
            text-transform: uppercase;
            line-height: 1;
          }
          .option-gambarino-serif {
            font-family: "Gambarino", serif;
            font-size: 52px;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            line-height: 0.95;
          }
          .option-editorial-hybrid {
            font-family: "Gambarino", serif;
            font-size: 46px;
            letter-spacing: -0.01em;
            text-transform: uppercase;
            line-height: 1;
            display: inline-flex;
            align-items: baseline;
            gap: 4px;
          }
          .trademark {
            font-size: 16px;
            font-family: monospace;
            vertical-align: super;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="sample-box">
          <div class="title">OPTION 1: AUREXA-STYLE EXTENDED ULTRA-BOLD SANS</div>
          <div class="option-aurexa-sans">KAMRUL I <span class="trademark">®</span></div>
        </div>

        <div class="sample-box">
          <div class="title">OPTION 2: GAMBARINO EDITORIAL DISPLAY SERIF (Matches Hero Wordmark)</div>
          <div class="option-gambarino-serif">KAMRUL I</div>
        </div>

        <div class="sample-box">
          <div class="title">OPTION 3: GAMBARINO WITH SUBTLE TRADEMARK BADGE</div>
          <div class="option-editorial-hybrid">KAMRUL I <span class="trademark">®</span></div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "logo-options.png") });
  console.log("Logo options captured.");

  await browser.close();
}

main().catch(console.error);
