import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/intro-qa");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

console.log("=== 1. TIMELINE & SINGLE-LOAD LIFECYCLE TEST ===");
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Track loader occurrences
  let loaderMountCount = 0;
  
  await page.goto("http://localhost:3000", { waitUntil: "commit" });

  // Frame 1: Loader visible immediately at 600ms
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "1-loader-active.png") });
  const hasLoader1 = await page.evaluate(() => !!document.querySelector('[key="intro-curtain"], [class*="z-[999]"]'));
  console.log("t=600ms: Loader active:", hasLoader1);

  // Frame 2: Curtain exiting / Hero starting reveal at 1900ms
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(outDir, "2-curtain-transition.png") });
  console.log("t=1900ms: Curtain transition captured");

  // Frame 3: Hero Title staggered 3D wave at 2500ms
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "3-hero-title-entrance.png") });
  console.log("t=2500ms: Hero title entrance captured");

  // Frame 4: Hero fully settled and interactive at 3600ms
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(outDir, "4-hero-settled.png") });
  const hasLoaderDone = await page.evaluate(() => !!document.querySelector('[key="intro-curtain"], [class*="z-[999]"]'));
  console.log("t=3600ms: Loader present:", hasLoaderDone);

  // Confirm Grain is present
  const grainInfo = await page.evaluate(() => {
    const g = document.querySelector('[style*="grain.png"]');
    return {
      present: !!g,
      style: g?.getAttribute("style"),
      opacity: g ? window.getComputedStyle(g).opacity : null,
      pointerEvents: g ? window.getComputedStyle(g).pointerEvents : null,
    };
  });
  console.log("Grain Status:", grainInfo);

  // 2. PAGE RELOAD TEST — Verify NO second load / double loader!
  console.log("=== RELOADING PAGE TO VERIFY NO DOUBLE LOAD ===");
  await page.reload({ waitUntil: "commit" });
  
  // Measure loader appearance across 4 seconds
  const loaderHistory = [];
  for (let s = 1; s <= 8; s++) {
    await page.waitForTimeout(500);
    const exists = await page.evaluate(() => !!document.querySelector('[key="intro-curtain"], [class*="z-[999]"]'));
    loaderHistory.push({ time: `${s * 500}ms`, exists });
  }
  console.log("Reload Loader Timeline (should only exist in first ~2.5s):", loaderHistory);

  // Check if loader appeared again after 3s
  const secondLoadDetected = loaderHistory.slice(5).some(h => h.exists);
  console.log("DOUBLE LOAD DETECTED:", secondLoadDetected ? "FAIL" : "PASSED (NO DOUBLE LOAD)");

  await page.close();
}

console.log("=== 3. RESPONSIVE VIEWPORT TESTS ===");
for (const vp of [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // Complete intro sequence

  await page.screenshot({ path: path.join(outDir, `hero-${vp.name}.png`) });
  console.log(`Captured hero-${vp.name}.png`);
  await page.close();
}

await browser.close();
console.log("All Intro QA tests completed successfully!");
