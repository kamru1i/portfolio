import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(".qa/comparison");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();

// 1. Capture Desktop 1440
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await sleep(3000); // Allow curtain to exit
  await page.screenshot({ path: path.join(OUT, "local-1440-full.png"), fullPage: true });

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

  await ctx.close();
}

// 2. Capture Mobile 390
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await sleep(3000);
  await page.screenshot({ path: path.join(OUT, "local-390-full.png"), fullPage: true });
  await ctx.close();
}

await browser.close();
console.log("Comparison captures complete!");
