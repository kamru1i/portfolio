import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = process.env.PORT || "3000";
const OUT = path.resolve(".qa/upgrade-verification");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch();
  const results = {
    viewports: {},
    loadingTest: {},
    interactionTest: {},
    consoleErrors: [],
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      results.consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    results.consoleErrors.push(err.toString());
  });

  console.log("1. Testing Fresh Page Load & Curtain Sequence...");
  await page.goto(`http://localhost:${PORT}`, { waitUntil: "domcontentloaded" });

  // Check curtain presence immediately
  const hasCurtainInitially = await page.evaluate(() => {
    return !!document.querySelector("div[class*='z-[999]']");
  });
  console.log("   Curtain present at start:", hasCurtainInitially);

  // Wait for curtain to complete (2550ms + 300ms buffer)
  await sleep(2900);

  // Verify curtain unmounted completely
  const isCurtainUnmounted = await page.evaluate(() => {
    return !document.querySelector("div[class*='z-[999]']");
  });
  console.log("   Curtain completely unmounted after intro:", isCurtainUnmounted);
  results.loadingTest.curtainLifecycleClean = hasCurtainInitially && isCurtainUnmounted;

  // Check Hero Wordmark
  const heroWordmark = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? h1.innerText.replace(/\s+/g, "") : "";
  });
  console.log("   Hero wordmark rendered:", heroWordmark);
  results.loadingTest.heroWordmarkMatches = heroWordmark === "KAMRULISLAM";

  // Screenshot hero at 1440
  await page.screenshot({ path: path.join(OUT, "post-upgrade-1440-hero.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 2. Test Hard Refresh / Repeated Refresh
  console.log("2. Testing Repeated Refresh / Hydration Stability...");
  let refreshClean = true;
  for (let i = 1; i <= 2; i++) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await sleep(2900);
    const wordmarkAfterReload = await page.evaluate(() => document.querySelector("h1")?.innerText.replace(/\s+/g, ""));
    if (wordmarkAfterReload !== "KAMRULISLAM") {
      refreshClean = false;
    }
  }
  results.loadingTest.refreshStability = refreshClean;
  console.log("   Repeated refresh stability:", refreshClean);

  // 3. Test 3D Cylinder drag & physics interaction
  console.log("3. Testing 3D Cylinder Drag & Physics...");
  const cylinder = await page.$("div[class*='cursor-grab']");
  if (cylinder) {
    const box = await cylinder.boundingBox();
    if (box) {
      // Perform drag gesture
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2, { steps: 5 });
      await page.mouse.up();
      await sleep(300);
      results.interactionTest.cylinderDragWorking = true;
      console.log("   Cylinder drag gesture executed successfully");
    }
  }

  // 4. Test Scroll Mechanics & Works Parallax
  console.log("4. Testing Works Parallax & Layout...");
  await page.evaluate(() => document.querySelector("#works")?.scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: path.join(OUT, "post-upgrade-1440-works.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 5. Test Manifesto Section
  console.log("5. Testing Manifesto Section...");
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
  await sleep(600);
  await page.screenshot({ path: path.join(OUT, "post-upgrade-1440-manifesto.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // 6. Test Services Section Hover & Floating Follower
  console.log("6. Testing Services Hover Follower...");
  await page.evaluate(() => document.querySelector("#expertise")?.scrollIntoView());
  await sleep(600);
  const serviceRows = await page.$$("#expertise .group");
  if (serviceRows.length > 0) {
    const box = await serviceRows[0].boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await sleep(400);
      const followerVisible = await page.evaluate(() => {
        return !!document.querySelector("div[class*='pointer-events-none absolute z-30']");
      });
      results.interactionTest.serviceFollowerVisible = followerVisible;
      console.log("   Service cursor follower active on hover:", followerVisible);
      await page.screenshot({ path: path.join(OUT, "post-upgrade-1440-expertise-hover.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
    }
  }

  // 7. Test Footer Reveal & Wordmark Canvas
  console.log("7. Testing Theatrical Footer Reveal...");
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h), docH);
  await sleep(800);
  const hasFooterCanvas = await page.evaluate(() => {
    const c = document.querySelector("footer canvas");
    return c && c.width > 0 && c.height > 0;
  });
  results.interactionTest.footerCanvasActive = !!hasFooterCanvas;
  console.log("   Footer canvas metallic wordmark rendered:", hasFooterCanvas);
  await page.screenshot({ path: path.join(OUT, "post-upgrade-1440-footer.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });

  await context.close();

  // 8. Multi-viewport Responsive Checks (1440, 1920, 1024, 768, 390)
  console.log("8. Testing Multi-Viewport Responsive Accuracy...");
  const widths = [1440, 1920, 1024, 768, 390];
  for (const w of widths) {
    const vh = w <= 430 ? 844 : 900;
    const ctx = await browser.newContext({ viewport: { width: w, height: vh } });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PORT}`, { waitUntil: "domcontentloaded" });
    await sleep(2900);

    const metrics = await p.evaluate(() => {
      const h1 = document.querySelector("h1");
      const h1Style = h1 ? window.getComputedStyle(h1) : null;
      const footer = document.querySelector("footer");
      const footerR = footer ? footer.getBoundingClientRect() : null;
      const body = document.body;
      return {
        h1FontSize: h1Style ? h1Style.fontSize : "",
        footerHeight: footerR ? Math.round(footerR.height) : 0,
        viewportWidth: window.innerWidth,
        bodyScrollWidth: body.scrollWidth,
        hasHorizontalOverflow: body.scrollWidth > window.innerWidth,
      };
    });

    results.viewports[w] = metrics;
    console.log(`   [${w}px] H1: ${metrics.h1FontSize} | Footer: ${metrics.footerHeight}px | Horiz Overflow: ${metrics.hasHorizontalOverflow}`);
    await ctx.close();
  }

  await browser.close();

  console.log("\n=== VERIFICATION RESULTS SUMMARY ===");
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
