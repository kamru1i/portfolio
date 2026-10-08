import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/scramble-test");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to page...");
  await page.goto("http://localhost:3000", { waitUntil: "commit" });

  // 1. Wait for curtain exit to start (at ~1.8s)
  await page.waitForTimeout(1850);
  await page.screenshot({ path: path.join(outDir, "1-scramble-initial-active.png") });
  const text1 = await page.evaluate(() => document.querySelector("main h1")?.innerText);
  console.log("Frame 1 (~1.85s): Text =", JSON.stringify(text1));

  // 2. Mid-way resolution (at ~2.3s)
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(outDir, "2-scramble-mid-resolution.png") });
  const text2 = await page.evaluate(() => document.querySelector("main h1")?.innerText);
  console.log("Frame 2 (~2.3s): Text =", JSON.stringify(text2));

  // 3. Title fully resolved & Subtitle scrambling (at ~2.8s)
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "3-scramble-subtitle-active.png") });
  const text3 = await page.evaluate(() => document.querySelector("main h1")?.innerText);
  const sub3 = await page.evaluate(() => document.querySelector("main p")?.innerText);
  console.log("Frame 3 (~2.8s): Title =", JSON.stringify(text3));
  console.log("               Subtitle =", JSON.stringify(sub3));

  // 4. Fully settled Hero (at ~3.8s)
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "4-hero-settled-final.png") });
  const text4 = await page.evaluate(() => document.querySelector("main h1")?.innerText);
  const sub4 = await page.evaluate(() => document.querySelector("main p")?.innerText);
  console.log("Frame 4 (~3.8s): Final Title =", JSON.stringify(text4));
  console.log("               Final Subtitle =", JSON.stringify(sub4));

  await browser.close();
}

main().catch(console.error);
