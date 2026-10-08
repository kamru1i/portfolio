import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const card5 = page.locator('#projects [data-project-id="bf-cars-video"]');
  await card5.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take screenshot of Card 5 directly
  await card5.screenshot({ path: "scripts/qa/card-5-fixed.png" });
  console.log("Card 5 screenshot saved to scripts/qa/card-5-fixed.png");

  // Also take screenshot of Row 3 with Card 4, Card 5, and Explore More
  const row3 = page.locator("#projects .grid.grid-cols-1.md\\:grid-cols-12").last();
  await row3.screenshot({ path: "scripts/qa/row-3-fixed.png" });
  console.log("Row 3 screenshot saved to scripts/qa/row-3-fixed.png");

  await browser.close();
}

main().catch(console.error);
