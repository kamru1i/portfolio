import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/viewports");
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "ultrawide-1920", width: 1920, height: 1080 },
];

async function main() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    // Wait for intro curtain and scramble to settle
    await page.waitForTimeout(3500);

    // Capture hero
    await page.screenshot({ path: path.join(outDir, `${vp.name}-hero.png`) });

    const titleBox = await page.locator("main h1").boundingBox();
    const subBox = await page.locator("main p").first().boundingBox();
    console.log(`  ${vp.name}: H1 bounds =`, titleBox, `| P bounds =`, subBox);

    await page.close();
  }

  await browser.close();
  console.log("All viewport tests completed successfully.");
}

main().catch(console.error);
