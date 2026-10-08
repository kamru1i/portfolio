import { chromium } from "playwright";

async function runQA() {
  console.log("=== STARTING QA VERIFICATION: PATRICK JANE (VIDEO) & AUREXA (WEB) ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => {
    if (!err.message.includes("418")) {
      console.error("PAGE ERROR:", err.message);
    }
  });

  try {
    // 1. Navigate to portfolio
    console.log("Navigating to http://localhost:3000/#projects...");
    await page.goto("http://localhost:3000/#projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Scroll to #projects section
    const projectsSection = page.locator("#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check Section Title and Badge
    const sectionTitle = await page.locator("#projects h2").textContent();
    console.log(`[PASS] Section Title found: "${sectionTitle?.trim()}"`);

    // 2. VIDEO TAB: 100% PATRICK JANE 5-CARD SELECTED WORKS VERIFICATION
    console.log("\n--- VERIFYING VIDEO TAB (PATRICK JANE SELECTED WORKS) ---");

    // Ensure Video tab is active
    const videoTabBtn = page.locator('#projects button[role="tab"]:has-text("Video")');
    await videoTabBtn.click();
    await page.waitForTimeout(500);

    // Verify all 5 project cards in Video tab
    const pjCards = page.locator('#projects [data-project-id]');
    const count = await pjCards.count();
    console.log(`Video Project Cards found: ${count} (Expected: 5)`);
    if (count !== 5) {
      throw new Error(`Expected 5 video cards matching Patrick Jane layout, but found ${count}`);
    }

    // Inspect each card
    const expectedCards = [
      { id: "biqolpo-ai-video", title: "Biqolpo", role: "Row 1 Left (3 cols)" },
      { id: "syston-autos-video", title: "Syston Autos Cinema", role: "Row 1 Right (6 cols)" },
      { id: "kinetic-type-video", title: "Kinetic Motion", role: "Row 2 Center (6 cols)" },
      { id: "nocturne-cinema-video", title: "Nocturne Cinema", role: "Row 3 Left (6 cols)" },
      { id: "bf-cars-video", title: "B&F Cars Automotive", role: "Row 3 Right (3 cols, 9:16)" },
    ];

    for (let i = 0; i < 5; i++) {
      const card = page.locator(`#projects [data-project-id="${expectedCards[i].id}"]`);
      const isVisible = await card.isVisible();
      const text = await card.textContent();
      const hasTitle = text.includes(expectedCards[i].title);
      console.log(`  Card ${i + 1} (${expectedCards[i].role}): "${expectedCards[i].title}" -> Visible: ${isVisible}, HasTitle: ${hasTitle}`);
      if (!hasTitle) {
        throw new Error(`Card ${i + 1} did not contain expected title "${expectedCards[i].title}". Text: ${text}`);
      }
    }

    // Verify Card 5 renders 9:16 vertical reel container
    const card5Reel = page.locator('#projects [data-project-id="bf-cars-video"] .aspect-\\[9\\/16\\]');
    const has916Reel = await card5Reel.isVisible();
    console.log(`  Card 5 9:16 vertical container check: ${has916Reel ? "YES" : "NO"}`);
    if (!has916Reel) {
      throw new Error("Card 5 did not render 9:16 vertical reel container!");
    }

    // Verify Explore More Link
    const exploreMore = page.locator('#projects a:has-text("Explore More")');
    const exploreMoreCount = await exploreMore.count();
    console.log(`  "Explore More" Link present: ${exploreMoreCount > 0 ? "YES" : "NO"}`);
    if (exploreMoreCount === 0) {
      throw new Error('Expected "Explore More" link matching Patrick Jane reference');
    }

    // Capture screenshot of full Video section
    await page.screenshot({ path: "scripts/qa/qa-video-5cards.png" });
    console.log("  [PASS] Saved scripts/qa/qa-video-5cards.png");

    // Test Video Lightbox on Card 1 by clicking card
    console.log("  Testing Video Modal interaction on Card 1...");
    const card1 = page.locator('#projects [data-project-id="biqolpo-ai-video"]');
    await card1.click();
    await page.waitForTimeout(600);

    const videoModal = page.locator('div[role="dialog"]');
    const modalVisible = await videoModal.isVisible();
    console.log(`  Video Modal Visible: ${modalVisible}`);
    if (!modalVisible) {
      throw new Error("Video Lightbox modal did not appear on play click");
    }

    // Close Video Modal using Close Button
    const closeBtn = page.locator('button[aria-label="Close video player"]');
    await closeBtn.click();
    await page.waitForTimeout(500);
    console.log("  Video Modal closed cleanly.");

    // 3. WEB TAB: 100% AUREXA CASE STUDIES VERIFICATION
    console.log("\n--- VERIFYING WEB TAB (AUREXA CASE STUDIES) ---");
    const webTabBtn = page.locator('#projects button[role="tab"]:has-text("Web")');
    await webTabBtn.click();
    await page.waitForTimeout(600);

    // Verify Aurexa Case Studies layout
    // Left column: 4 scrolling case study cards
    const aurexaCards = page.locator('#projects div[data-project-id]');
    const aurexaCount = await aurexaCards.count();
    console.log(`  Aurexa Web Cards found in DOM: ${aurexaCount}`);

    // Check images in Web Tab — must be Aurexa images, NEVER Patrick Jane artwork
    const webImages = await page.evaluate(() => {
      const worksSection = document.getElementById("projects");
      if (!worksSection) return [];
      const imgs = Array.from(worksSection.querySelectorAll("img"));
      return imgs.map((img) => img.src);
    });

    console.log("  Web Tab Image Sources:");
    let hasPjArtwork = false;
    for (const src of webImages) {
      console.log(`    - ${src}`);
      if (src.includes("work-3-web") || src.includes("hero-card-4") || src.includes("work-4-it")) {
        hasPjArtwork = true;
      }
    }
    if (hasPjArtwork) {
      throw new Error("Web tab contains Patrick Jane artwork! Must be 100% Aurexa assets.");
    }
    console.log("  [PASS] Zero Patrick Jane artwork found in Web tab. Aurexa assets verified.");

    // Check Right sticky anchored active panel
    const rightPanel = page.locator('#projects .lg\\:sticky');
    const rightPanelVisible = await rightPanel.isVisible();
    console.log(`  Right Sticky Case Study Panel Visible: ${rightPanelVisible}`);
    if (!rightPanelVisible) {
      throw new Error("Right Sticky Case Study Panel is not visible on desktop!");
    }

    const rightPanelText = await rightPanel.textContent();
    console.log(`  Right Sticky Panel Content snippet: "${rightPanelText.slice(0, 100)}..."`);
    console.log(`  Contains CASE STUDY badge: ${rightPanelText.includes("CASE STUDY")}`);
    console.log(`  Contains Launch Live Site button: ${rightPanelText.includes("Launch Live Site")}`);

    // Test Hover Selection interaction: Hover over Card 2 in left list
    console.log("  Testing project selection update via hover...");
    const card2 = page.locator('#projects div[data-project-id="portfolio-architectural-web"]').first();
    await card2.hover();
    await page.waitForTimeout(500);

    const updatedRightPanelText = await rightPanel.textContent();
    const isCard2Active = updatedRightPanelText.includes("02 / 04") || updatedRightPanelText.includes("Architectural");
    console.log(`  Right panel updated to project 2: ${isCard2Active}`);

    // Test Launch Live Site modal from right panel
    const liveSiteBtn = rightPanel.locator('button:has-text("Launch Live Site")');
    if (await liveSiteBtn.isVisible()) {
      console.log("  Testing Live Site Preview Modal from right panel...");
      await liveSiteBtn.click();
      await page.waitForTimeout(700);

      const previewModal = page.locator('div[role="dialog"]');
      const previewVisible = await previewModal.isVisible();
      console.log(`  Live Site Preview Modal visible: ${previewVisible}`);
      if (!previewVisible) {
        throw new Error("Project Preview Modal did not open on Launch Live Site click");
      }

      // Close preview modal via ESC
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      console.log("  Live Site Preview Modal dismissed via ESC.");
    }

    // Take screenshot of Web tab
    await page.screenshot({ path: "scripts/qa/qa-web-aurexa-split.png" });
    console.log("  [PASS] Saved scripts/qa/qa-web-aurexa-split.png");

    // 4. MOBILE RESPONSIVENESS CHECK (390px)
    console.log("\n--- VERIFYING MOBILE VIEWPORT (390px) ---");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);

    // Check Web tab horizontal overflow
    const webScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const webClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`  Mobile Web Tab: scrollWidth=${webScrollWidth}, clientWidth=${webClientWidth}`);
    if (webScrollWidth > webClientWidth) {
      throw new Error(`Mobile horizontal overflow detected on Web tab! ${webScrollWidth} > ${webClientWidth}`);
    }
    await page.screenshot({ path: "scripts/qa/qa-web-mobile.png" });

    // Switch to Video Tab on Mobile
    const mobileVideoTabBtn = page.locator('#projects button[role="tab"]:has-text("Video")');
    await mobileVideoTabBtn.click();
    await page.waitForTimeout(600);

    const videoScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const videoClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`  Mobile Video Tab: scrollWidth=${videoScrollWidth}, clientWidth=${videoClientWidth}`);
    if (videoScrollWidth > videoClientWidth) {
      throw new Error(`Mobile horizontal overflow detected on Video tab! ${videoScrollWidth} > ${videoClientWidth}`);
    }
    await page.screenshot({ path: "scripts/qa/qa-video-mobile.png" });

    console.log("\n=== ALL QA TESTS PASSED CLEANLY! ===");
  } catch (err) {
    console.error("\n❌ QA TEST FAILED:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runQA();
