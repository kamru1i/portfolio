import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/#projects ...");
  await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const section = page.locator("#projects");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // 1. Verify Header & Badge
  const badgeText = await page.locator("#projects [data-section-badge]").innerText();
  console.log("Badge text:", badgeText.trim());

  const headingText = await page.locator("#projects h2").innerText();
  console.log("Heading text:", headingText.trim());

  // 2. VIDEO TAB VERIFICATION
  console.log("--- Testing VIDEO Tab (Patrick Jane) ---");
  const videoButton = page.locator('#projects button[role="tab"]:has-text("Video")');
  console.log("Video tab selected:", await videoButton.getAttribute("aria-selected"));

  // Check 3 video cards
  const videoCards = page.locator("#projects [data-project-id]");
  const videoCardCount = await videoCards.count();
  console.log("Video card count:", videoCardCount);

  // Capture Video tab layout screenshot
  await page.screenshot({ path: "scripts/qa/video-tab-desktop.png", clip: await section.boundingBox() });
  console.log("Video tab screenshot saved to scripts/qa/video-tab-desktop.png");

  // Click first video project (Biqolpo) to test VideoPlayerModal
  console.log("Opening VideoPlayerModal for first card...");
  await page.locator('#projects [data-project-id="biqolpo-ai-video"]').click();
  await page.waitForTimeout(600);

  const videoModal = page.locator('div[role="dialog"][aria-label*="Video Player"]');
  const modalVisible = await videoModal.isVisible();
  console.log("Video modal visible:", modalVisible);

  await page.screenshot({ path: "scripts/qa/video-modal-desktop.png" });
  console.log("Video modal screenshot saved to scripts/qa/video-modal-desktop.png");

  // Press ESC to close video modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  console.log("Video modal dismissed, visible:", await videoModal.isVisible());

  // Test 9:16 vertical video (B&F Cars)
  console.log("Opening VideoPlayerModal for 9:16 reel (bf-cars-video)...");
  await page.locator('#projects [data-project-id="bf-cars-video"]').click();
  await page.waitForTimeout(600);
  console.log("B&F Cars modal visible:", await videoModal.isVisible());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 3. WEB TAB VERIFICATION (Aurexa Case Studies)
  console.log("--- Testing WEB Tab (Aurexa Case Studies) ---");
  const webTabButton = page.locator('#projects button[role="tab"]:has-text("Web")');
  await webTabButton.click();
  await page.waitForTimeout(800);
  console.log("Web tab selected:", await webTabButton.getAttribute("aria-selected"));

  // Screenshot Web Tab Layout
  await page.screenshot({ path: "scripts/qa/web-tab-desktop.png", clip: await section.boundingBox() });
  console.log("Web tab screenshot saved to scripts/qa/web-tab-desktop.png");

  // Hover on first web card (Velocity) to verify Aurexa hover overlay
  const velocityCard = page.locator('#projects div:has-text("Velocity Interface System")').first();
  await velocityCard.scrollIntoViewIfNeeded();
  await velocityCard.hover();
  await page.waitForTimeout(500);

  await page.screenshot({ path: "scripts/qa/web-card-hover.png" });
  console.log("Web card hover screenshot saved to scripts/qa/web-card-hover.png");

  // Verify GitHub & Live Site buttons on Velocity
  const velocityGH = await page.locator('a[aria-label*="Velocity Interface System source on GitHub"]').count();
  const velocityLive = await page.locator('button[aria-label*="Velocity Interface System"]').count();
  console.log("Velocity has GitHub button:", velocityGH > 0, "and Live Site button:", velocityLive > 0);

  // Verify JobMatchingBD (no GitHub URL in data, should NOT render GitHub button)
  const jmCard = page.locator('#projects div:has-text("JobMatchingBD Career Portal")').first();
  await jmCard.hover();
  await page.waitForTimeout(400);
  const jmGH = await page.locator('a[aria-label*="JobMatchingBD Career Portal source on GitHub"]').count();
  const jmLive = await page.locator('button[aria-label*="JobMatchingBD Career Portal"]').count();
  console.log("JobMatchingBD has NO fake GitHub button:", jmGH === 0, "and has Live button:", jmLive > 0);

  // Click Live Site on Architectural Portfolio to verify ProjectPreviewModal
  console.log("Testing ProjectPreviewModal for Architectural Portfolio...");
  const archLiveBtn = page.locator('button[aria-label*="Architectural Portfolio"]').first();
  await archLiveBtn.click();
  await page.waitForTimeout(600);

  const previewModal = page.locator('div[role="dialog"][aria-label*="Architectural Portfolio Preview"]');
  console.log("ProjectPreviewModal visible:", await previewModal.isVisible());
  await page.screenshot({ path: "scripts/qa/web-preview-modal.png" });
  console.log("Preview modal screenshot saved to scripts/qa/web-preview-modal.png");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  console.log("Preview modal dismissed, visible:", await previewModal.isVisible());

  // 4. MOBILE VIEWPORT VERIFICATION (390px)
  console.log("--- Testing Mobile Viewport (390px) ---");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);

  // Switch back to Video tab
  await page.locator('#projects button[role="tab"]:has-text("Video")').click();
  await page.waitForTimeout(600);

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log("Mobile Video tab has horizontal overflow:", mobileOverflow);

  // Screenshot Video tab mobile
  await page.screenshot({ path: "scripts/qa/video-tab-mobile.png" });
  console.log("Video tab mobile screenshot saved to scripts/qa/video-tab-mobile.png");

  // Switch to Web tab on mobile
  await page.locator('#projects button[role="tab"]:has-text("Web")').click();
  await page.waitForTimeout(600);

  const mobileWebOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log("Mobile Web tab has horizontal overflow:", mobileWebOverflow);

  await page.screenshot({ path: "scripts/qa/web-tab-mobile.png" });
  console.log("Web tab mobile screenshot saved to scripts/qa/web-tab-mobile.png");

  await browser.close();
  console.log("All QA checks completed successfully!");
}

main().catch(err => {
  console.error("QA error:", err);
  process.exit(1);
});
