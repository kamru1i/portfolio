import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const qaDir = path.resolve(process.cwd(), ".qa/services-final-qa");
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/#services...");
  await page.goto("http://localhost:3000/#services", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Scroll to services
  await page.evaluate(() => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(800);

  console.log("Capturing 1-services-idle.png...");
  await page.screenshot({ path: path.join(qaDir, "1-services-idle.png") });

  // 1. Hover Service 01 (Video Editing)
  console.log("Hovering Service 01...");
  const row1 = page.locator("a[aria-label*='Video Editing']").first();
  await row1.hover();
  await page.waitForTimeout(600);
  console.log("Capturing 2-hover-video-editing.png...");
  await page.screenshot({ path: path.join(qaDir, "2-hover-video-editing.png") });

  // Move mouse across row 1
  const box1 = await row1.boundingBox();
  if (box1) {
    await page.mouse.move(box1.x + box1.width * 0.7, box1.y + box1.height * 0.5);
    await page.waitForTimeout(300);
  }

  // 2. Hover Service 02 (AI-Assisted Content)
  console.log("Hovering Service 02...");
  const row2 = page.locator("a[aria-label*='AI-Assisted Content']").first();
  await row2.hover();
  await page.waitForTimeout(600);
  console.log("Capturing 3-hover-ai-content.png...");
  await page.screenshot({ path: path.join(qaDir, "3-hover-ai-content.png") });

  // 3. Hover Service 03 (Web Development)
  console.log("Hovering Service 03...");
  const row3 = page.locator("a[aria-label*='Web Development']").first();
  await row3.hover();
  await page.waitForTimeout(600);
  console.log("Capturing 4-hover-web-dev.png...");
  await page.screenshot({ path: path.join(qaDir, "4-hover-web-dev.png") });

  // 4. Hover Service 04 (IT Support)
  console.log("Hovering Service 04...");
  const row4 = page.locator("a[aria-label*='IT Support']").first();
  await row4.hover();
  await page.waitForTimeout(600);
  console.log("Capturing 5-hover-it-support.png...");
  await page.screenshot({ path: path.join(qaDir, "5-hover-it-support.png") });

  // 5. Test Click on Service 01 (Video Editing Detail Page)
  console.log("Clicking Service 01 to open detail page...");
  await row1.click();
  await page.waitForURL("**/services/video-editing", { timeout: 15000 });
  await page.waitForTimeout(1000);
  console.log("Capturing 6-detail-video-editing.png...");
  await page.screenshot({ path: path.join(qaDir, "6-detail-video-editing.png") });

  // Scroll down detail page
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await page.waitForTimeout(600);
  console.log("Capturing 7-detail-video-editing-scrolled.png...");
  await page.screenshot({ path: path.join(qaDir, "7-detail-video-editing-scrolled.png") });

  // 6. Navigate to Service 02 (AI-Assisted Content Detail Page)
  console.log("Navigating to /services/ai-assisted-content...");
  await page.goto("http://localhost:3000/services/ai-assisted-content", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  console.log("Capturing 8-detail-ai-content.png...");
  await page.screenshot({ path: path.join(qaDir, "8-detail-ai-content.png") });

  // 7. Navigate to Service 03 (Web Development Detail Page)
  console.log("Navigating to /services/web-development...");
  await page.goto("http://localhost:3000/services/web-development", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  console.log("Capturing 9-detail-web-dev.png...");
  await page.screenshot({ path: path.join(qaDir, "9-detail-web-dev.png") });

  // 8. Navigate to Service 04 (IT Support Detail Page)
  console.log("Navigating to /services/it-support...");
  await page.goto("http://localhost:3000/services/it-support", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  console.log("Capturing 10-detail-it-support.png...");
  await page.screenshot({ path: path.join(qaDir, "10-detail-it-support.png") });

  // 9. Mobile Viewport Check (390x844)
  console.log("Testing Mobile Viewport on Services...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/#services", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(600);
  console.log("Capturing 11-mobile-services.png...");
  await page.screenshot({ path: path.join(qaDir, "11-mobile-services.png") });

  await browser.close();
  console.log("QA script finished successfully!");
}

main().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
