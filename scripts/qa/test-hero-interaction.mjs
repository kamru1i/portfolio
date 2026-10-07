import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/hero-test");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

// 1. Desktop Test (1440x900)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4000); // Allow intro curtain to completely exit

  // Capture initial hero state
  await page.screenshot({ path: path.join(outDir, "hero-1440-initial.png") });
  console.log("Captured hero-1440-initial.png");

  // Get cylinder container
  const container = page.locator("#hero-3d-cylinder");
  const box = await container.boundingBox();
  console.log("Cylinder BoundingBox:", box);

  if (box) {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Simulate drag gesture to the left (rotate right)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(startX - 220, startY, { steps: 12 });
    await page.waitForTimeout(50);

    // Capture dragging state
    await page.screenshot({ path: path.join(outDir, "hero-1440-dragging.png") });
    console.log("Captured hero-1440-dragging.png");

    // Release mouse and let momentum coast
    await page.mouse.up();
    await page.waitForTimeout(400); // Check momentum glide
    await page.screenshot({ path: path.join(outDir, "hero-1440-momentum.png") });
    console.log("Captured hero-1440-momentum.png");
  }

  await page.close();
}

// 2. Mobile Test (390x844)
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: path.join(outDir, "hero-390-initial.png") });
  console.log("Captured hero-390-initial.png");

  // Simulate touch drag
  const container = page.locator("#hero-3d-cylinder");
  const box = await container.boundingBox();
  if (box) {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 140, startY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "hero-390-dragged.png") });
    console.log("Captured hero-390-dragged.png");
  }

  await page.close();
}

await browser.close();
console.log("QA test script finished successfully!");
