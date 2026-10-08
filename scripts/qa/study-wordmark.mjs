import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/wordmark-study");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Let's create an HTML page testing multiple high-fidelity SVG wordmark approaches
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
            font-weight: 900;
          }
          body {
            background-color: #050505;
            color: #fff;
            padding: 40px;
            font-family: sans-serif;
          }
          .title { color: #888; font-size: 13px; font-family: monospace; margin-bottom: 12px; }
          .row { margin-bottom: 50px; padding-bottom: 30px; border-bottom: 1px solid #222; }
        </style>
      </head>
      <body>

        <!-- OPTION A: Wide Geometric Block Wordmark with Aurexa Architectural Cuts -->
        <div class="row">
          <div class="title">OPTION A: GEOMETRIC EXTENDED ARCHITECTURAL WORDMARK (520x78)</div>
          <svg width="520" height="78" viewBox="0 0 520 78" fill="none">
            <!-- K -->
            <path d="M0 0H20V78H0V0Z" fill="#FFFFFF"/>
            <path d="M18 42L56 0H82L38 46L82 78H55L18 48V42Z" fill="#FFFFFF"/>
            <!-- A -->
            <path d="M86 78L122 0H144L180 78H158L151 61H115L108 78H86ZM121 46H145L133 18L121 46Z" fill="#FFFFFF"/>
            <!-- M -->
            <path d="M186 0H207L226 50L245 0H266V78H247V25L232 64H220L205 25V78H186V0Z" fill="#FFFFFF"/>
            <!-- R with extended architectural top bridge over U -->
            <path d="M274 0H332C346 0 355 9 355 24C355 35 348 42 338 45L357 78H334L317 48H294V78H274V0ZM294 17V33H330C334 33 336 30 336 25C336 20 334 17 330 17H294Z" fill="#FFFFFF"/>
            <!-- U -->
            <path d="M362 0H382V56C382 61 385 64 391 64C397 64 400 61 400 56V0H420V56C420 71 408 78 391 78C374 78 362 71 362 56V0Z" fill="#FFFFFF"/>
            <!-- L with extended base connecting towards I -->
            <path d="M428 0H448V62H476V78H428V0Z" fill="#FFFFFF"/>
            <!-- I -->
            <path d="M486 0H506V78H486V0Z" fill="#FFFFFF"/>
            <!-- (R) -->
            <circle cx="516" cy="12" r="8" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
            <text x="516" y="15" font-size="8" font-family="sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">R</text>
          </svg>
        </div>

        <!-- OPTION B: Wider proportions with custom aerodynamic cut -->
        <div class="row">
          <div class="title">OPTION B: WIDE BRUTALIST WORDMARK WITH CONNECTING TOP ACCENT (AUREXA STYLE)</div>
          <svg width="539" height="78" viewBox="0 0 539 78" fill="none">
            <!-- Architectural top connecting bridge -->
            <path d="M0 0H24V78H0V0Z" fill="#FFFFFF"/>
            <path d="M20 40L62 0H90L42 44L90 78H62L20 45V40Z" fill="#FFFFFF"/>
            <!-- A -->
            <path d="M96 78L132 0H156L192 78H167L160 61H127L120 78H96ZM133 46H154L144 19L133 46Z" fill="#FFFFFF"/>
            <!-- M -->
            <path d="M198 0H220L239 48L258 0H280V78H260V24L245 61H233L218 24V78H198V0Z" fill="#FFFFFF"/>
            <!-- R -->
            <path d="M288 0H344C358 0 367 9 367 24C367 35 360 42 350 45L369 78H345L328 48H308V78H288V0ZM308 17V33H341C345 33 348 30 348 25C348 20 345 17 341 17H308Z" fill="#FFFFFF"/>
            <!-- U -->
            <path d="M374 0H394V54C394 61 397 64 403 64C409 64 412 61 412 54V0H432V54C432 70 421 78 403 78C385 78 374 70 374 54V0Z" fill="#FFFFFF"/>
            <!-- L -->
            <path d="M440 0H460V62H490V78H440V0Z" fill="#FFFFFF"/>
            <!-- I -->
            <path d="M498 0H518V78H498V0Z" fill="#FFFFFF"/>
            <!-- R mark -->
            <circle cx="530" cy="11" r="7" stroke="#888" stroke-width="1.2" fill="none"/>
            <text x="530" y="13.5" font-size="7" font-family="sans-serif" font-weight="900" fill="#888" text-anchor="middle">R</text>
          </svg>
        </div>

        <!-- OPTION C: High-contrast Gambarino Display Vectorized -->
        <div class="row">
          <div class="title">OPTION C: MASSIVE GAMBARINO EDITORIAL DISPLAY (539x78)</div>
          <div style="font-family: 'Gambarino', serif; font-size: 78px; line-height: 1; letter-spacing: -0.02em; text-transform: uppercase; display: flex; align-items: baseline; gap: 8px;">
            KAMRUL I <span style="font-size: 20px; font-family: monospace; color: #888;">®</span>
          </div>
        </div>

      </body>
    </html>
  `);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "wordmark-comparison.png") });
  console.log("Wordmark comparison captured.");
  await browser.close();
}

main().catch(console.error);
