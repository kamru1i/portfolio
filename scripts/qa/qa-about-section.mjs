import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = "d:/Web Dev/Portfolio/scripts/qa/output-about";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1024", width: 1024, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    
    // Locate the About section
    const aboutSection = page.locator("#about");
    await aboutSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    
    // Screenshot whole about section
    await aboutSection.screenshot({
      path: path.join(OUT_DIR, `${vp.name}-about-section.png`),
    });
    
    // Scroll a little more to see scroll illumination
    await page.evaluate(() => window.scrollBy(0, 350));
    await page.waitForTimeout(500);
    await aboutSection.screenshot({
      path: path.join(OUT_DIR, `${vp.name}-about-illuminated.png`),
    });
    
    // Measure image dimensions and text layout
    const imgInfo = await page.evaluate(() => {
      const img = document.querySelector("#about img");
      const h2 = document.querySelector("#about h2");
      return {
        img: img ? {
          src: img.currentSrc || img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: img.clientWidth,
          renderedHeight: img.clientHeight,
          alt: img.getAttribute("alt"),
        } : null,
        h2Text: h2 ? h2.textContent.trim().replace(/\s+/g, " ") : null,
        h2Lines: h2 ? h2.getClientRects().length : null,
      };
    });
    
    console.log(`${vp.name} Details:`, JSON.stringify(imgInfo, null, 2));
    await page.close();
  }
  
  await browser.close();
  console.log("Done! Screenshots saved to:", OUT_DIR);
}

run().catch(console.error);
