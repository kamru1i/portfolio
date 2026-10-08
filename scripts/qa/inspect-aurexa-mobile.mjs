import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/aurexa-study");

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Take screenshot at scroll = 0 on mobile
  await page.screenshot({ path: path.join(outDir, "mobile-scroll-0.png") });

  const initialMobile = await page.evaluate(() => {
    const nav = document.querySelector(".framer-2bq3am-container") || document.querySelector("header");
    const svg = nav ? nav.querySelector("svg") : null;
    return {
      svgRect: svg ? svg.getBoundingClientRect() : null,
      navRect: nav ? nav.getBoundingClientRect() : null,
    };
  });
  console.log("Mobile Initial (scroll 0):", JSON.stringify(initialMobile, null, 2));

  // Scroll to 250 on mobile
  await page.evaluate(() => window.scrollTo(0, 250));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "mobile-scroll-250.png") });

  const scrolledMobile = await page.evaluate(() => {
    const nav = document.querySelector(".framer-2bq3am-container") || document.querySelector("header");
    const svg = nav ? nav.querySelector("svg") : null;
    return {
      svgRect: svg ? svg.getBoundingClientRect() : null,
      navRect: nav ? nav.getBoundingClientRect() : null,
    };
  });
  console.log("Mobile Scrolled (scroll 250):", JSON.stringify(scrolledMobile, null, 2));

  await browser.close();
}

main().catch(console.error);
