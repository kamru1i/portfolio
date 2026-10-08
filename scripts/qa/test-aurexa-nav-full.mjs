import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/aurexa-nav-qa");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // Wait for intro curtain and scramble reveal

  // Helper to extract navbar metrics
  async function getMetrics(label) {
    return await page.evaluate((l) => {
      const header = document.querySelector("header");
      const logoLink = header ? header.querySelector("a") : null;
      const logoDiv = logoLink ? logoLink.querySelector("div") : null;
      const logoSpan = logoDiv ? logoDiv.querySelector("span") : null;
      const cta = header ? header.querySelector("nav > div:last-child a") : null;

      const headerRect = header ? header.getBoundingClientRect() : null;
      const logoRect = logoSpan ? logoSpan.getBoundingClientRect() : null;
      const headerStyle = header ? window.getComputedStyle(header) : null;
      const logoDivStyle = logoDiv ? window.getComputedStyle(logoDiv) : null;

      return {
        step: l,
        scrollY: window.scrollY,
        header: {
          height: headerRect?.height,
          top: headerRect?.top,
          bg: headerStyle?.backgroundColor,
          backdropFilter: headerStyle?.backdropFilter,
          borderBottom: headerStyle?.borderBottom,
          boxShadow: headerStyle?.boxShadow,
          paddingTop: headerStyle?.paddingTop,
          paddingBottom: headerStyle?.paddingBottom,
        },
        logo: {
          width: logoRect?.width,
          height: logoRect?.height,
          transform: logoDivStyle?.transform,
          fontSize: logoSpan ? window.getComputedStyle(logoSpan).fontSize : null,
        },
      };
    }, label);
  }

  // 1. Initial State (scroll = 0)
  const m0 = await getMetrics("Scroll 0 (Initial Large State)");
  console.log("Step 1:", JSON.stringify(m0, null, 2));
  await page.screenshot({ path: path.join(outDir, "1-desktop-scroll-0.png") });

  // 2. Scroll to 80px (Mid transformation)
  await page.evaluate(() => window.scrollTo(0, 80));
  await page.waitForTimeout(400);
  const m80 = await getMetrics("Scroll 80 (Interpolating)");
  console.log("Step 2:", JSON.stringify(m80, null, 2));
  await page.screenshot({ path: path.join(outDir, "2-desktop-scroll-80.png") });

  // 3. Scroll to 180px (Fully Compact State)
  await page.evaluate(() => window.scrollTo(0, 180));
  await page.waitForTimeout(400);
  const m180 = await getMetrics("Scroll 180 (Fully Compact State)");
  console.log("Step 3:", JSON.stringify(m180, null, 2));
  await page.screenshot({ path: path.join(outDir, "3-desktop-scroll-180.png") });

  // 4. Scroll to 450px (Over Hero & Works content)
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(400);
  const m450 = await getMetrics("Scroll 450 (Deep Scroll over content)");
  console.log("Step 4:", JSON.stringify(m450, null, 2));
  await page.screenshot({ path: path.join(outDir, "4-desktop-scroll-450.png") });

  // 5. Scroll UP back to 80px
  await page.evaluate(() => window.scrollTo(0, 80));
  await page.waitForTimeout(400);
  const mUp80 = await getMetrics("Scroll UP to 80 (Expanding)");
  console.log("Step 5:", JSON.stringify(mUp80, null, 2));
  await page.screenshot({ path: path.join(outDir, "5-desktop-scrollup-80.png") });

  // 6. Scroll UP back to 0px
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const mUp0 = await getMetrics("Scroll UP to 0 (Restored Large State)");
  console.log("Step 6:", JSON.stringify(mUp0, null, 2));
  await page.screenshot({ path: path.join(outDir, "6-desktop-scrollup-0.png") });

  // 7. Mobile Viewport (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const mMobile0 = await getMetrics("Mobile Scroll 0");
  console.log("Mobile Step 1:", JSON.stringify(mMobile0, null, 2));
  await page.screenshot({ path: path.join(outDir, "7-mobile-scroll-0.png") });

  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(400);
  const mMobile200 = await getMetrics("Mobile Scroll 200");
  console.log("Mobile Step 2:", JSON.stringify(mMobile200, null, 2));
  await page.screenshot({ path: path.join(outDir, "8-mobile-scroll-200.png") });

  // 8. Tablet Viewport (768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "9-tablet-scroll-0.png") });

  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "10-tablet-scroll-200.png") });

  await browser.close();
  console.log("Comprehensive Aurexa navbar QA completed successfully!");
}

main().catch(console.error);
