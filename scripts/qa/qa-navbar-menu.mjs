import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runQA() {
  const qaDir = path.resolve(process.cwd(), ".qa/nav-menu-qa");
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // Allow curtain / intro reveal

  // 1. Initial State Screenshot (Desktop Scroll 0)
  console.log("Capturing 1-desktop-initial.png...");
  await page.screenshot({ path: path.join(qaDir, "1-desktop-initial.png") });

  // 2. Scrolled State (Desktop Scroll 250px)
  console.log("Scrolling to 250px...");
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
  await page.waitForTimeout(1000); // Wait for spring physics to settle

  console.log("Capturing 2-desktop-scrolled-compact.png...");
  await page.screenshot({ path: path.join(qaDir, "2-desktop-scrolled-compact.png") });

  // Measure compact navbar dimensions and bounding boxes
  const navMetrics = await page.evaluate(() => {
    const header = document.querySelector("header");
    const nav = document.querySelector("header nav");
    const logo = document.querySelector("header svg[aria-label='KAMRUL']");
    const menuBtn = document.querySelector("header button[aria-label*='navigation menu']");
    const hRect = header ? header.getBoundingClientRect() : null;
    const nRect = nav ? nav.getBoundingClientRect() : null;
    const lRect = logo ? logo.getBoundingClientRect() : null;
    const bRect = menuBtn ? menuBtn.getBoundingClientRect() : null;

    return {
      headerHeight: hRect?.height,
      navHeight: nRect?.height,
      logoTop: lRect?.top,
      logoHeight: lRect?.height,
      logoBottom: lRect?.bottom,
      btnTop: bRect?.top,
      btnHeight: bRect?.height,
      btnBottom: bRect?.bottom,
      headerPaddingTop: window.getComputedStyle(header).paddingTop,
      headerPaddingBottom: window.getComputedStyle(header).paddingBottom,
    };
  });
  console.log("Compact Nav Metrics:", JSON.stringify(navMetrics, null, 2));

  // 3. Open Fullscreen Menu
  console.log("Opening full-screen menu...");
  const menuButton = page.locator("header button[aria-label*='navigation menu']");
  await menuButton.click();
  await page.waitForTimeout(600); // Wait for overlay animation

  console.log("Capturing 3-desktop-menu-open.png...");
  await page.screenshot({ path: path.join(qaDir, "3-desktop-menu-open.png") });

  // 4. Close Fullscreen Menu via CLOSE button
  console.log("Closing menu via CLOSE button...");
  await menuButton.click();
  await page.waitForTimeout(500);

  console.log("Capturing 4-desktop-menu-closed.png...");
  await page.screenshot({ path: path.join(qaDir, "4-desktop-menu-closed.png") });

  // 5. Mobile Viewport Test (iPhone 14 style: 390x844)
  console.log("Testing Mobile Viewport (390x844)...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(800);

  console.log("Capturing 5-mobile-initial.png...");
  await page.screenshot({ path: path.join(qaDir, "5-mobile-initial.png") });

  console.log("Scrolling mobile to 200px...");
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
  await page.waitForTimeout(800);

  console.log("Capturing 6-mobile-scrolled-compact.png...");
  await page.screenshot({ path: path.join(qaDir, "6-mobile-scrolled-compact.png") });

  console.log("Opening mobile menu...");
  await menuButton.click();
  await page.waitForTimeout(600);

  console.log("Capturing 7-mobile-menu-open.png...");
  await page.screenshot({ path: path.join(qaDir, "7-mobile-menu-open.png") });

  await browser.close();
  console.log("All QA checks completed successfully!");
}

runQA().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
