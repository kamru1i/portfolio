import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  console.log("Navigating to http://localhost:3000/#projects...");
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Switch to Web Tab
  console.log("Switching to Web Tab...");
  const webBtn = page.locator('#projects button[role="tab"]:has-text("Web")');
  await webBtn.click();
  await page.waitForTimeout(800);

  // Verify that there are 6 web cards
  const webCards = page.locator('#projects [data-project-id]');
  const count = await webCards.count();
  console.log(`Web cards count: ${count} (Expected: 6)`);

  // Check positions of the cards to verify 3 per row on 1440px
  const bboxes = [];
  for (let i = 0; i < count; i++) {
    const box = await webCards.nth(i).boundingBox();
    bboxes.push({ index: i, ...box });
  }

  console.log("Card bounding boxes (Y coordinate reveals row grouping):");
  bboxes.forEach((b) => {
    console.log(`Card ${b.index + 1}: x=${Math.round(b.x)}, y=${Math.round(b.y)}, width=${Math.round(b.width)}, height=${Math.round(b.height)}`);
  });

  // Verify row 1 has 3 cards (same or nearly identical y) and row 2 has 3 cards
  const row1Y = bboxes[0].y;
  const row1Cards = bboxes.filter(b => Math.abs(b.y - row1Y) < 10);
  console.log(`Row 1 has ${row1Cards.length} cards (Expected: 3)`);

  const row2Y = bboxes[3].y;
  const row2Cards = bboxes.filter(b => Math.abs(b.y - row2Y) < 10);
  console.log(`Row 2 has ${row2Cards.length} cards (Expected: 3)`);

  await page.screenshot({ path: "scripts/qa/qa-web-3-per-line-desktop.png", fullPage: false });
  console.log("Saved screenshot to scripts/qa/qa-web-3-per-line-desktop.png");

  // Hover on first card
  await webCards.first().hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scripts/qa/qa-web-3-per-line-hover.png" });

  await browser.close();
  console.log("Verification finished successfully!");
}

main().catch(console.error);
