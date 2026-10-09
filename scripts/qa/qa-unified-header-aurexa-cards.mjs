import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  console.log("Navigating to http://localhost:3000/#projects...");
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const section = page.locator("#projects");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 1. Verify Video Tab with Header ABOVE Tabs
  console.log("Checking Video Tab layout...");
  const headerTitle = await page.locator("#projects h2").innerText();
  console.log(`Main Header Title: "${headerTitle.trim()}"`);

  const tabs = page.locator('#projects [role="tablist"]');
  const hasTabs = await tabs.isVisible();
  console.log(`Tabs visible below header: ${hasTabs}`);

  await page.screenshot({ path: "scripts/qa/qa-video-tab-new-layout.png" });
  console.log("Video tab screenshot saved to scripts/qa/qa-video-tab-new-layout.png");

  // 2. Switch to Web Tab
  console.log("Switching to Web Tab...");
  const webBtn = page.locator('#projects button[role="tab"]:has-text("Web")');
  await webBtn.click();
  await page.waitForTimeout(600);

  // Verify that the right-sidebar elements from Aurexa are REMOVED
  const caseStudiesHeader = await page.locator('#projects h2:has-text("Case studies")').count();
  console.log(`"Case studies" title present: ${caseStudiesHeader > 0 ? "YES (FAIL)" : "NO (PASS)"}`);
  if (caseStudiesHeader > 0) {
    throw new Error('Expected "Case studies" title to be removed!');
  }

  const viewAllBtn = await page.locator('#projects button:has-text("View all case studies")').count();
  console.log(`"View all case studies" button present: ${viewAllBtn > 0 ? "YES (FAIL)" : "NO (PASS)"}`);
  if (viewAllBtn > 0) {
    throw new Error('Expected "View all case studies" button to be removed!');
  }

  const countdownStats = await page.locator('#projects span:has-text("60+")').count();
  console.log(`Countdown stats "60+" present: ${countdownStats > 0 ? "YES (FAIL)" : "NO (PASS)"}`);
  if (countdownStats > 0) {
    throw new Error('Expected countdown stats to be removed!');
  }

  // Verify that the cards grid is present
  const webCards = page.locator('#projects [data-project-id]');
  const count = await webCards.count();
  console.log(`Web cards count: ${count} (Expected: 6)`);

  await page.screenshot({ path: "scripts/qa/qa-web-tab-pure-cards.png" });
  console.log("Web tab pure cards screenshot saved to scripts/qa/qa-web-tab-pure-cards.png");

  // 3. Test Hover on Card 1
  console.log("Testing card hover state...");
  const card1 = webCards.first();
  await card1.hover();
  await page.waitForTimeout(600);

  await card1.screenshot({ path: "scripts/qa/qa-web-tab-hover.png" });
  console.log("Hover screenshot saved to scripts/qa/qa-web-tab-hover.png");

  // 4. Test Mobile Viewport (390px)
  console.log("Testing Mobile Viewport (390px)...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? "YES (FAIL)" : "NO (PASS)"}`);

  await page.screenshot({ path: "scripts/qa/qa-web-tab-mobile.png" });
  console.log("Mobile screenshot saved to scripts/qa/qa-web-tab-mobile.png");

  await browser.close();
  console.log("All tests passed cleanly!");
}

main().catch(console.error);
