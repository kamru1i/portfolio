import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "4k-3840x2160", width: 3840, height: 2160 },
  { name: "2k-2560x1440", width: 2560, height: 1440 },
  { name: "fhd-1920x1080", width: 1920, height: 1080 },
  { name: "laptop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

async function main() {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    // Wait for IntroCurtain to finish
    await page.waitForTimeout(3500);

    const heroSection = page.locator("section").first();
    const box = await heroSection.boundingBox();

    const title = page.locator("h1[aria-label='KAMRUL ISLAM']");
    const titleBox = await title.boundingBox();

    const cylinder = page.locator("text=Architectural Editorial Portrait").locator("xpath=ancestor::div[contains(@style, 'perspective')] | xpath=ancestor::div[contains(@style, 'preserve-3d')]").first();
    let cylinderBox = null;
    try {
      cylinderBox = await cylinder.boundingBox();
    } catch (e) {}

    console.log(`Section bbox: y=${box?.y}, h=${box?.height}`);
    console.log(`Title bbox: y=${titleBox?.y}, h=${titleBox?.height}`);
    console.log(`Viewport Height: ${vp.height}`);
    if (titleBox && box) {
      const topSpace = titleBox.y;
      const bottomSpace = vp.height - (box.y + box.height);
      console.log(`Top Space from Viewport Top: ${topSpace.toFixed(1)}px (${((topSpace / vp.height) * 100).toFixed(1)}%)`);
      console.log(`Section Height vs Viewport: ${box.height.toFixed(1)}px (${((box.height / vp.height) * 100).toFixed(1)}%)`);
    }

    await page.screenshot({
      path: `scripts/qa/hero-current-${vp.name}.png`,
    });

    await page.close();
  }

  await browser.close();
  console.log("\nFinished inspecting viewports.");
}

main().catch(console.error);
