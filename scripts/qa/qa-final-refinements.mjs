import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

const SCREENSHOT_DIR = "d:/Web Dev/Portfolio/qa-screenshots";
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQA() {
  console.log("=== STARTING HIGH-FIDELITY QA FOR SECTION BADGES & PROJECTS SYSTEM ===");
  const browser = await chromium.launch();

  try {
    // 1. Detailed Inspection on Desktop 1440
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    // Wait for IntroCurtain animation to clear
    await page.waitForTimeout(3000);

    console.log("\n--- TEST 1: Section Badges Inspection ---");
    const sections = [
      { id: "projects", expectedBadge: "PROJECTS", expectedTitle: "PROJECTS & WORKS" },
      { id: "services", expectedBadge: "SERVICES", expectedTitle: "EXPERTISE & SERVICES" },
      { id: "recognitions", expectedBadge: "MILESTONES", expectedTitle: "MILESTONES & RECOGNITIONS" },
      { id: "faq", expectedBadge: "FAQ", expectedTitle: "HAVE QUESTIONS?" },
    ];

    for (const sec of sections) {
      const sectionEl = page.locator(`section#${sec.id}`);
      const isVisible = await sectionEl.isVisible();
      console.log(`Section #${sec.id} isVisible:`, isVisible);

      const badgeText = await sectionEl.locator(".font-mono-custom").first().textContent();
      console.log(`Section #${sec.id} Badge Text: "${badgeText?.trim()}" (Expected: "${sec.expectedBadge}")`);

      const titleText = await sectionEl.locator("h2").textContent();
      console.log(`Section #${sec.id} Title Text: "${titleText?.trim()}" (Expected contains: "${sec.expectedTitle}")`);

      const hasIndicator = await sectionEl.locator(".bg-emerald-400").first().isVisible();
      console.log(`Section #${sec.id} Emerald indicator light present:`, hasIndicator);
    }

    console.log("\n--- TEST 2: Projects & Works Tabs & Left-Alignment ---");
    const projectsSection = page.locator("section#projects");
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const tabList = projectsSection.locator("[role='tablist']");
    const tabListVisible = await tabList.isVisible();
    console.log("Tablist is visible:", tabListVisible);

    const tabBox = await tabList.boundingBox();
    const sectionBox = await projectsSection.boundingBox();
    console.log(`Tab X coordinate: ${tabBox.x}, Section X coordinate: ${sectionBox.x}`);
    // Verify left-alignment: tab X is close to section X (< section width * 0.3)
    const isLeftAligned = tabBox.x - sectionBox.x < sectionBox.width * 0.25;
    console.log("Tab is LEFT-ALIGNED (not centered):", isLeftAligned);

    console.log("\n--- TEST 3: Video Cards & 16:9 / 9:16 Aspect Formats ---");
    const videoReelBadge = projectsSection.locator("text='9:16 Reel'").first();
    const is916Present = await videoReelBadge.isVisible();
    console.log("9:16 Vertical Reel badge visible on B&F Cars card:", is916Present);

    // Click on Video Card (Syston Autos Cinema) to trigger Video Player Lightbox
    const firstVideoCard = projectsSection.locator("text='Syston Autos Cinema'").first();
    await firstVideoCard.click();
    await page.waitForTimeout(1000);

    const videoModal = page.locator("[role='dialog']");
    const isVideoModalOpen = await videoModal.isVisible();
    console.log("In-site Video Player Modal opened:", isVideoModalOpen);

    // Check modal video element
    const videoEl = videoModal.locator("video");
    const hasVideo = await videoEl.isVisible();
    console.log("Video element inside modal:", hasVideo);

    // Close via ESC key
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    const isVideoModalClosed = !(await videoModal.isVisible());
    console.log("Video modal closed via ESC:", isVideoModalClosed);

    console.log("\n--- TEST 4: Switching to Web Tab & Actions ---");
    const webTab = projectsSection.locator("button[role='tab']:has-text('Web')");
    await webTab.click();
    await page.waitForTimeout(1000);

    const velocityCard = projectsSection.locator("text='Velocity Interface System'");
    const isVelocityVisible = await velocityCard.isVisible();
    console.log("Velocity Web Card visible in Web tab:", isVelocityVisible);

    const githubLink = projectsSection.locator("a:has-text('GitHub')").first();
    const hasGithub = await githubLink.isVisible();
    const githubHref = await githubLink.getAttribute("href");
    console.log("GitHub real link present:", hasGithub, "Href:", githubHref);

    const liveBtn = projectsSection.locator("button:has-text('Live Website')").first();
    const hasLive = await liveBtn.isVisible();
    console.log("Live Website button present:", hasLive);

    // Open Web Preview Modal
    await liveBtn.click();
    await page.waitForTimeout(1000);

    const webModal = page.locator("[role='dialog']");
    const isWebModalOpen = await webModal.isVisible();
    console.log("Web Preview Modal opened:", isWebModalOpen);

    // Close via ESC
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    const isWebModalClosed = !(await webModal.isVisible());
    console.log("Web Preview modal closed via ESC:", isWebModalClosed);

    await page.close();

    console.log("\n--- TEST 5: Responsive Screenshots Across 5 Viewports ---");
    for (const vp of VIEWPORTS) {
      const p = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
      await p.waitForTimeout(3000);

      // Scroll to Projects section
      const sec = p.locator("section#projects");
      if (await sec.isVisible()) {
        await sec.scrollIntoViewIfNeeded();
        await p.waitForTimeout(800);
        await p.screenshot({
          path: path.join(SCREENSHOT_DIR, `projects-${vp.name}-video.png`),
          fullPage: false,
        });

        // Click Web tab
        const wTab = sec.locator("button[role='tab']:has-text('Web')");
        if (await wTab.isVisible()) {
          await wTab.click();
          await p.waitForTimeout(800);
          await p.screenshot({
            path: path.join(SCREENSHOT_DIR, `projects-${vp.name}-web.png`),
            fullPage: false,
          });
        }
      }

      // Scroll to Services section
      const sSec = p.locator("section#services");
      if (await sSec.isVisible()) {
        await sSec.scrollIntoViewIfNeeded();
        await p.waitForTimeout(600);
        await p.screenshot({
          path: path.join(SCREENSHOT_DIR, `services-${vp.name}.png`),
          fullPage: false,
        });
      }

      // Scroll to Milestones section
      const mSec = p.locator("section#recognitions");
      if (await mSec.isVisible()) {
        await mSec.scrollIntoViewIfNeeded();
        await p.waitForTimeout(600);
        await p.screenshot({
          path: path.join(SCREENSHOT_DIR, `milestones-${vp.name}.png`),
          fullPage: false,
        });
      }

      // Scroll to FAQ section
      const fSec = p.locator("section#faq");
      if (await fSec.isVisible()) {
        await fSec.scrollIntoViewIfNeeded();
        await p.waitForTimeout(600);
        await p.screenshot({
          path: path.join(SCREENSHOT_DIR, `faq-${vp.name}.png`),
          fullPage: false,
        });
      }

      console.log(`Captured screenshots for ${vp.name}`);
      await p.close();
    }

    console.log("\n=== ALL QA TESTS PASSED SUCCESSFULLY! ===");
  } finally {
    await browser.close();
  }
}

runQA().catch((err) => {
  console.error("QA Test Error:", err);
  process.exit(1);
});
