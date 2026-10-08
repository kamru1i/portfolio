import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = "public/test-screenshots/major-refinements";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runQa() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop-1920", width: 1920, height: 1080 },
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "laptop-1024", width: 1024, height: 800 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    console.log(`\n========================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);

    // 1. Test Projects & Works Section
    const projectsSection = page.locator("#projects");
    if (await projectsSection.count() > 0) {
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      // Verify Title
      const titleText = await projectsSection.locator("h2").innerText();
      console.log(`Projects Title: "${titleText}"`);

      // Verify Tabs
      const videoTab = page.locator("button[role='tab']:has-text('Video')");
      const webTab = page.locator("button[role='tab']:has-text('Web')");
      console.log(`Video tab exists: ${await videoTab.count() > 0}, Web tab exists: ${await webTab.count() > 0}`);

      // Capture Video tab screenshot
      await projectsSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-projects-video-tab.png`),
      });

      // Switch to Web tab
      await webTab.click();
      await page.waitForTimeout(600);
      console.log(`Switched to Web tab`);

      // Capture Web tab screenshot
      await projectsSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-projects-web-tab.png`),
      });

      // On desktop, test modals
      if (vp.name === "desktop-1440") {
        console.log(`Testing Web Preview Modal...`);
        const liveBtn = projectsSection.locator("button:has-text('Live Website')").first();
        if (await liveBtn.count() > 0) {
          await liveBtn.click();
          await page.waitForTimeout(600);
          const modal = page.locator("[role='dialog']");
          console.log(`Web preview modal open: ${await modal.count() > 0}`);
          await page.screenshot({
            path: path.join(OUT_DIR, `desktop-1440-web-preview-modal.png`),
          });
          // Close with Escape
          await page.keyboard.press("Escape");
          await page.waitForTimeout(400);
          console.log(`Modal closed with Escape: ${await modal.count() === 0}`);
        }

        // Switch back to video and test Video Player Modal
        await videoTab.click();
        await page.waitForTimeout(400);
        const videoCard = projectsSection.locator(".group").first();
        await videoCard.click();
        await page.waitForTimeout(600);
        const videoModal = page.locator("[role='dialog']");
        console.log(`Video player modal open: ${await videoModal.count() > 0}`);
        await page.screenshot({
          path: path.join(OUT_DIR, `desktop-1440-video-player-modal.png`),
        });
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);
        console.log(`Video modal closed with Escape: ${await videoModal.count() === 0}`);
      }
    }

    // 2. Test About Section
    const aboutSection = page.locator("#about");
    if (await aboutSection.count() > 0) {
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      // Verify image
      const aboutImg = aboutSection.locator("img[alt='Kamrul Islam']").first();
      if (await aboutImg.count() > 0) {
        const filter = await aboutImg.evaluate((el) => window.getComputedStyle(el).filter);
        console.log(`About image filter: "${filter}" (should be 'none')`);
      }

      await aboutSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-about-section.png`),
      });
    }

    // 3. Test Services Section (Cards)
    const servicesSection = page.locator("#services");
    if (await servicesSection.count() > 0) {
      await servicesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await servicesSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-services-cards.png`),
      });
    }

    // 4. Test Milestones Section (Cards)
    const milestonesSection = page.locator("#recognitions");
    if (await milestonesSection.count() > 0) {
      await milestonesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await milestonesSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-milestones-cards.png`),
      });
    }

    // 5. Test FAQ Section (Heading check)
    const faqSection = page.locator("#faq");
    if (await faqSection.count() > 0) {
      await faqSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const faqH2 = await faqSection.locator("h2").innerText();
      console.log(`FAQ Heading: "${faqH2}"`);

      await faqSection.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-faq-section.png`),
      });
    }

    // 6. Test Curtain Footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const footer = page.locator("footer[aria-label='Footer']");
    if (await footer.count() > 0) {
      await footer.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-curtain-footer.png`),
      });
      console.log(`Footer screenshot captured for ${vp.name}`);
    }

    await page.close();
  }

  await browser.close();
  console.log("\nAll QA checks and screenshots completed successfully!");
}

runQa().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
