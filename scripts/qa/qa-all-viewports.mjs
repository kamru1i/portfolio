import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = process.env.PORT || "3001";
const OUT = path.resolve(".qa/comparison");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

async function scrollPageGradually(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 250) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(40);
  }
  await sleep(600);
}

const WIDTHS = [1440, 1920, 1024, 768, 390];

for (const w of WIDTHS) {
  const vh = w <= 430 ? 844 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: vh } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await sleep(3200); // curtain complete

  // Scroll through page to trigger animations
  await scrollPageGradually(page);

  // Return to top and settle
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);

  // Take full page screenshot
  await page.screenshot({ path: path.join(OUT, `local-${w}-full.png`), fullPage: true });

  if (w === 1440) {
    // 1. Hero
    await page.screenshot({
      path: path.join(OUT, "local-1440-hero.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    // 2. Works
    await page.evaluate(() => document.querySelector("#works")?.scrollIntoView());
    await sleep(800);
    await page.screenshot({
      path: path.join(OUT, "local-1440-works.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    // 3. Manifesto
    await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
    await sleep(800);
    await page.screenshot({
      path: path.join(OUT, "local-1440-manifesto.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    // 4. Expertise & Services
    await page.evaluate(() => document.querySelector("#expertise")?.scrollIntoView());
    await sleep(800);
    await page.screenshot({
      path: path.join(OUT, "local-1440-expertise.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });

    // Test service hover
    const serviceSection = await page.$("#expertise");
    if (serviceSection) {
      const box = await serviceSection.boundingBox();
      // Move mouse to row 2
      await page.mouse.move(box.x + 600, box.y + 160);
      await sleep(400);
      await page.screenshot({
        path: path.join(OUT, "local-1440-expertise-hover.png"),
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });
    }

    // 5. Counters
    const counters = await page.$("section:last-of-type");
    if (counters) {
      await counters.scrollIntoViewIfNeeded();
      await sleep(1000);
      await page.screenshot({
        path: path.join(OUT, "local-1440-counters.png"),
        clip: { x: 0, y: 0, width: 1440, height: 900 },
      });
    }

    // 6. Footer reveal at bottom
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate((h) => window.scrollTo(0, h), docH);
    await sleep(1200);
    await page.screenshot({
      path: path.join(OUT, "local-1440-footer-reveal.png"),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
  }

  await ctx.close();
  console.log(`Captured ${w}px viewport`);
}

await browser.close();
console.log("All viewports QA captures complete!");
