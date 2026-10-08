import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Switch to Web Tab
  console.log("Switching to Web Tab...");
  const webTab = page.locator('#projects button[role="tab"]:has-text("Web")');
  await webTab.click();
  await page.waitForTimeout(800);

  // Scroll into view of #projects
  const section = page.locator("#projects");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 1. Verify 2-Column Grid of 6 Aurexa Cards
  const cards = page.locator('#projects [data-project-id]');
  const count = await cards.count();
  console.log(`Web Cards found: ${count} (Expected: 6)`);

  // Verify Right Sticky Header Block
  const heading = page.locator('#projects h2:has-text("Case studies")');
  const hasHeading = await heading.isVisible();
  console.log(`Sticky Heading "Case studies" visible: ${hasHeading}`);

  const badge = page.locator('#projects div:has-text("PROJECTS")').first();
  const hasBadge = await badge.isVisible();
  console.log(`Badge "PROJECTS" visible: ${hasBadge}`);

  const viewAllBtn = page.locator('#projects button:has-text("View all case studies")');
  const hasBtn = await viewAllBtn.isVisible();
  console.log(`Button "View all case studies" visible: ${hasBtn}`);

  const stats = page.locator('#projects span:has-text("60+")').first();
  const hasStats = await stats.isVisible();
  console.log(`Stats "60+" visible: ${hasStats}`);

  // Take screenshot of the complete Web Tab section (matching Image 1)
  await section.screenshot({ path: "scripts/qa/aurexa-web-full-layout.png" });
  console.log("Full layout screenshot saved to scripts/qa/aurexa-web-full-layout.png");

  // 2. Hover over Card 1 to test Hover State (matching Image 2)
  console.log("Testing card hover state...");
  const card1 = cards.first();
  await card1.hover();
  await page.waitForTimeout(600);

  // Take screenshot of hovered card
  await card1.screenshot({ path: "scripts/qa/aurexa-web-card-hover.png" });
  console.log("Card hover screenshot saved to scripts/qa/aurexa-web-card-hover.png");

  // 3. Test Mobile Viewport (390px)
  console.log("Testing Mobile Viewport (390px)...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? "YES (FAIL)" : "NO (PASS)"}`);

  await section.screenshot({ path: "scripts/qa/aurexa-web-mobile-390.png" });
  console.log("Mobile layout screenshot saved to scripts/qa/aurexa-web-mobile-390.png");

  await browser.close();
  console.log("Aurexa verification completed successfully!");
}

main().catch(console.error);
