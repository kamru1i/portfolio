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
  for (let y = 0; y <= h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(60);
  }
  await sleep(500);
}

// 1. Capture Desktop 1440
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await sleep(3200); // Allow curtain to exit

  // Hero clip
  await page.screenshot({
    path: path.join(OUT, "local-1440-hero.png"),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // Scroll to works
  await page.evaluate(() => document.querySelector("#works")?.scrollIntoView());
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUT, "local-1440-works.png"),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // Scroll to manifesto
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUT, "local-1440-manifesto.png"),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // Scroll to expertise
  await page.evaluate(() => document.querySelector("#expertise")?.scrollIntoView());
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUT, "local-1440-expertise.png"),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // Scroll to bottom (footer reveal)
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h), docH);
  await sleep(1200);
  await page.screenshot({
    path: path.join(OUT, "local-1440-footer-reveal.png"),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  // Full page screenshot after scrolling through
  await page.evaluate(() => window.scrollTo(0, 0));
  await scrollPageGradually(page);
  await page.screenshot({ path: path.join(OUT, "local-1440-full.png"), fullPage: true });

  await ctx.close();
}

// 2. Capture Mobile 390
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await sleep(3200);
  await scrollPageGradually(page);
  await page.screenshot({ path: path.join(OUT, "local-390-full.png"), fullPage: true });
  await ctx.close();
}

await browser.close();
console.log("Comparison captures complete!");
