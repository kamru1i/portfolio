import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/current-nav-test");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // wait for intro curtain

  for (const y of [0, 100, 250, 500]) {
    await page.evaluate((sc) => window.scrollTo(0, sc), y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `current-scroll-${y}.png`) });
    const navVisible = await page.evaluate(() => {
      const header = document.querySelector("header");
      return header ? {
        rect: header.getBoundingClientRect(),
        transform: window.getComputedStyle(header).transform,
        opacity: window.getComputedStyle(header).opacity,
        y: window.scrollY
      } : null;
    });
    console.log(`Scroll ${y}:`, JSON.stringify(navVisible));
  }

  await browser.close();
}

main().catch(console.error);
