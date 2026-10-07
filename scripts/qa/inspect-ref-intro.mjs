import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Record network and DOM changes
console.log("Navigating to reference...");
const start = Date.now();

// Capture frames at short intervals right from start
const frames = [];
let frameIdx = 0;

page.on("load", () => console.log("Page load event fired at", Date.now() - start, "ms"));
page.on("domcontentloaded", () => console.log("DOMContentLoaded at", Date.now() - start, "ms"));

await page.goto("https://patrickjane.framer.website/", { waitUntil: "commit" });

// Poll every 100ms for 3.5s to see exact visual progression and DOM states
for (let i = 0; i < 35; i++) {
  const t = Date.now() - start;
  const snapshot = await page.evaluate(() => {
    // Check loading overlay
    const allDivs = Array.from(document.querySelectorAll("div"));
    // Look for elements with fixed or absolute covering screen or containing "PATRICK JANE"
    const texts = Array.from(document.querySelectorAll("h1, h2, p, span, div"))
      .filter(el => el.textContent && el.textContent.includes("PATRICK JANE"))
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        style: el.getAttribute("style"),
        rect: el.getBoundingClientRect(),
        opacity: window.getComputedStyle(el).opacity,
        transform: window.getComputedStyle(el).transform,
      }));

    // Find any overlay or loader
    const loaders = Array.from(document.querySelectorAll('[data-framer-name*="Load"], [class*="load"], [style*="z-index"]'))
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        style: el.getAttribute("style"),
        zIndex: window.getComputedStyle(el).zIndex,
        rect: el.getBoundingClientRect(),
      }));

    // Find grain
    const grain = Array.from(document.querySelectorAll('[class*="grain"], [class*="noise"], svg, [style*="grain"], [style*="noise"]'))
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        style: el.getAttribute("style"),
      }));

    return { texts, loaders: loaders.slice(0, 5), grain };
  });

  if (i % 5 === 0 || i === 0) {
    await page.screenshot({ path: `.qa/ref-frame-${i}.png` });
    console.log(`t = ${t}ms, Frame ${i} captured. Texts found:`, snapshot.texts.length);
  }
  await page.waitForTimeout(100);
}

await page.waitForTimeout(1000);
await page.screenshot({ path: ".qa/ref-final.png" });
console.log("Captured ref-final.png");

await browser.close();
