import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(process.cwd(), ".qa/hybrid-refinements");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "1920-desktop", width: 1920, height: 1080 },
  { name: "1440-laptop", width: 1440, height: 900 },
  { name: "1024-small-laptop", width: 1024, height: 800 },
  { name: "768-tablet", width: 768, height: 1024 },
  { name: "390-mobile", width: 390, height: 844 },
];

async function main() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // 1. SERVICES SECTION
    const servicesSection = page.locator("#services");
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Capture idle state of services
    await servicesSection.screenshot({
      path: path.join(OUT_DIR, `${vp.name}-services-idle.png`),
    });
    console.log(`Saved ${vp.name}-services-idle.png`);

    // Hover over service 01 (Desktop / Laptop / Tablet)
    if (vp.width >= 768) {
      const row1 = servicesSection.locator("a[aria-label*='Video Editing']").first();
      await row1.hover();
      await page.waitForTimeout(500);
      await servicesSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-services-hover-video.png`),
      });
      console.log(`Saved ${vp.name}-services-hover-video.png`);
      
      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);
    }

    // 2. MILESTONES & RECOGNITIONS SECTION
    const recognitionsSection = page.locator("#recognitions");
    await recognitionsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Capture idle state of milestones
    await recognitionsSection.screenshot({
      path: path.join(OUT_DIR, `${vp.name}-milestones-idle.png`),
    });
    console.log(`Saved ${vp.name}-milestones-idle.png`);

    // Hover over milestone 01
    if (vp.width >= 768) {
      const milestoneRows = recognitionsSection.locator(".group");
      if (await milestoneRows.count() > 0) {
        await milestoneRows.first().hover();
        await page.waitForTimeout(400);
        await recognitionsSection.screenshot({
          path: path.join(OUT_DIR, `${vp.name}-milestones-hover.png`),
        });
        console.log(`Saved ${vp.name}-milestones-hover.png`);
      }
    }

    await page.close();
  }

  // 3. Test Navigation Click on Services
  console.log("\nTesting Service row click navigation...");
  const navPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await navPage.goto("http://localhost:3000/#services", { waitUntil: "networkidle" });
  await navPage.waitForTimeout(1000);
  const serviceLink = navPage.locator("a[aria-label*='Video Editing']").first();
  await serviceLink.click();
  await navPage.waitForURL("**/services/video-editing", { timeout: 10000 });
  await navPage.waitForTimeout(500);
  console.log("Successfully navigated to /services/video-editing! URL:", navPage.url());
  await navPage.close();

  await browser.close();
  console.log("\nAll hybrid QA tests completed successfully!");
}

main().catch(console.error);
