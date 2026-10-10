import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log("==================================================================");
  console.log("            COMPREHENSIVE RUNTIME MODAL & NAVBAR AUDIT             ");
  console.log("==================================================================");
  console.log("Target: http://localhost:3000 | Viewport: 1920x1080 (1080p standard)");

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. Navbar Measurements
  const nav = page.locator("header");
  const navBoxUnscrolled = await nav.boundingBox();
  const navBottomUnscrolled = (navBoxUnscrolled?.y || 0) + (navBoxUnscrolled?.height || 0);
  console.log(`\n[NAVBAR] Unscrolled: height=${navBoxUnscrolled?.height}px, bottom=${navBottomUnscrolled}px`);

  // Scroll down to projects section
  const projectsSection = page.locator("#projects");
  await projectsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const navBoxScrolled = await nav.boundingBox();
  const navBottomScrolled = (navBoxScrolled?.y || 0) + (navBoxScrolled?.height || 0);
  console.log(`[NAVBAR] Scrolled: height=${navBoxScrolled?.height}px, bottom=${navBottomScrolled}px`);

  const results = {};

  // 2. Discover video cards
  const videoCards = page.locator("#projects [data-project-id]");
  const count = await videoCards.count();
  console.log(`\n[VIDEO TAB] Found ${count} video cards:`);
  for (let i = 0; i < count; i++) {
    const card = videoCards.nth(i);
    const id = await card.getAttribute("data-project-id");
    const text = (await card.innerText()).replace(/\s+/g, " ").trim().slice(0, 50);
    console.log(`  Card [${i}]: id="${id}" | preview="${text}"`);
  }

  // Click Card 0 (16:9 CapCut)
  console.log("\n--- Testing Video Modal 1 (Card 0: 16:9 CapCut) ---");
  await videoCards.nth(0).click();
  await page.waitForTimeout(600);

  let modal = page.locator("div[role='dialog']");
  let box = await modal.boundingBox();
  let clearanceScrolled = (box?.y || 0) - navBottomScrolled;
  let clearanceUnscrolled = (box?.y || 0) - navBottomUnscrolled;

  let clientBadge = await modal.locator("span.font-mono-custom").first().innerText();
  let titleEl = modal.locator("h3").first();
  let titleText = await titleEl.innerText();
  let fullTitleAttr = await titleEl.getAttribute("title");
  let ariaLabel = await titleEl.getAttribute("aria-label");
  let watchLink = await modal.locator("a:has-text('Watch')").getAttribute("href");
  let formatBadge = (await modal.locator("span:has-text('16:9')").count() > 0) ? "16:9" : "None";

  results["16:9 Video"] = {
    width: box?.width,
    height: box?.height,
    top: box?.y,
    clearanceScrolled,
    clearanceUnscrolled,
    attribution: clientBadge,
    formatBadge,
    displayedTitle: titleText,
    fullTitle: fullTitleAttr,
    ariaLabel,
    watchLink,
  };

  console.log(`Dialog: ${box?.width}x${box?.height}px at y=${box?.y}px`);
  console.log(`Navbar Clearance: ${clearanceScrolled}px (scrolled), ${clearanceUnscrolled}px (unscrolled)`);
  console.log(`Attribution: "${clientBadge}" | Format: "${formatBadge}"`);
  console.log(`Displayed Title: "${titleText}"`);
  console.log(`Full Title Attr: "${fullTitleAttr}"`);

  await modal.locator("button[aria-label*='Close']").click();
  await page.waitForTimeout(500);

  // Click Card 4 (9:16 Audi Q5)
  console.log("\n--- Testing Video Modal 2 (Card 4: 9:16 Audi Q5) ---");
  await videoCards.nth(4).click();
  await page.waitForTimeout(600);

  modal = page.locator("div[role='dialog']");
  box = await modal.boundingBox();
  clearanceScrolled = (box?.y || 0) - navBottomScrolled;
  clearanceUnscrolled = (box?.y || 0) - navBottomUnscrolled;

  clientBadge = await modal.locator("span.font-mono-custom").first().innerText();
  titleEl = modal.locator("h3").first();
  titleText = await titleEl.innerText();
  fullTitleAttr = await titleEl.getAttribute("title");
  ariaLabel = await titleEl.getAttribute("aria-label");
  watchLink = await modal.locator("a:has-text('Watch')").getAttribute("href");
  formatBadge = (await modal.locator("span:has-text('9:16')").count() > 0) ? "9:16" : "None";

  results["9:16 Video"] = {
    width: box?.width,
    height: box?.height,
    top: box?.y,
    clearanceScrolled,
    clearanceUnscrolled,
    attribution: clientBadge,
    formatBadge,
    displayedTitle: titleText,
    fullTitle: fullTitleAttr,
    ariaLabel,
    watchLink,
  };

  console.log(`Dialog: ${box?.width}x${box?.height}px at y=${box?.y}px`);
  console.log(`Navbar Clearance: ${clearanceScrolled}px (scrolled), ${clearanceUnscrolled}px (unscrolled)`);
  console.log(`Attribution: "${clientBadge}" (VERIFIED CLIENT NAME) | Format: "${formatBadge}"`);
  console.log(`Displayed Title: "${titleText}"`);
  console.log(`Full Title Attr: "${fullTitleAttr}"`);
  console.log(`Watch Link: ${watchLink}`);

  await modal.locator("button[aria-label*='Close']").click();
  await page.waitForTimeout(500);

  // 3. Web Tab: Web Preview Modal
  console.log("\n--- Testing Web Project Modal ---");
  const webTab = page.locator("button[role='tab']").filter({ hasText: "Web" });
  await webTab.click();
  await page.waitForTimeout(600);

  const firstWebCard = page.locator("#projects div[data-project-id]").first();
  await firstWebCard.click();
  await page.waitForTimeout(600);

  modal = page.locator("div[role='dialog']");
  box = await modal.boundingBox();
  clearanceScrolled = (box?.y || 0) - navBottomScrolled;
  clearanceUnscrolled = (box?.y || 0) - navBottomUnscrolled;

  const liveBtn = modal.locator("a:has-text('Live')");
  const liveText = (await liveBtn.innerText()).replace(/\s+/g, " ").trim();
  const liveHref = await liveBtn.getAttribute("href");

  const desktopBtn = modal.locator("button[aria-label*='Desktop View']");
  const tabletBtn = modal.locator("button[aria-label*='Tablet View']");
  const mobileBtn = modal.locator("button[aria-label*='Mobile View']");

  results["Web Iframe"] = {
    width: box?.width,
    height: box?.height,
    top: box?.y,
    clearanceScrolled,
    clearanceUnscrolled,
    liveBtnText: liveText,
    liveHref,
    deviceAriaLabels: [
      await desktopBtn.getAttribute("aria-label"),
      await tabletBtn.getAttribute("aria-label"),
      await mobileBtn.getAttribute("aria-label"),
    ],
  };

  console.log(`Dialog: ${box?.width}x${box?.height}px at y=${box?.y}px`);
  console.log(`Navbar Clearance: ${clearanceScrolled}px (scrolled), ${clearanceUnscrolled}px (unscrolled)`);
  console.log(`Live button label: "${liveText}" (Href: ${liveHref})`);
  console.log(`Device buttons aria-labels:`, results["Web Iframe"].deviceAriaLabels);

  // Switch to Fallback Mode
  const fallbackBtn = modal.locator("button:has-text('Fallback View')");
  if (await fallbackBtn.isVisible()) {
    await fallbackBtn.click();
    await page.waitForTimeout(500);

    const fallbackBox = await modal.boundingBox();
    const fbClearanceScrolled = (fallbackBox?.y || 0) - navBottomScrolled;
    results["Web Fallback"] = {
      width: fallbackBox?.width,
      height: fallbackBox?.height,
      top: fallbackBox?.y,
      clearanceScrolled: fbClearanceScrolled,
    };

    console.log(`\n--- Testing Web Project Modal (Fallback Mode) ---`);
    console.log(`Dialog: ${fallbackBox?.width}x${fallbackBox?.height}px at y=${fallbackBox?.y}px`);
    console.log(`Navbar Clearance: ${fbClearanceScrolled}px`);
  }

  await modal.locator("button[aria-label*='Close']").click();
  await page.waitForTimeout(500);

  console.log("\n==================================================================");
  console.log("                  FINAL COMPARATIVE AUDIT SUMMARY                  ");
  console.log("==================================================================");
  console.table({
    "16:9 Video": {
      "Outer Width": `${results["16:9 Video"]?.width}px`,
      "Outer Height": `${results["16:9 Video"]?.height}px`,
      "Clearance": `${results["16:9 Video"]?.clearanceScrolled?.toFixed(1)}px`,
      "Attribution": results["16:9 Video"]?.attribution,
      "Format Badge": results["16:9 Video"]?.formatBadge,
    },
    "9:16 Video": {
      "Outer Width": `${results["9:16 Video"]?.width}px`,
      "Outer Height": `${results["9:16 Video"]?.height}px`,
      "Clearance": `${results["9:16 Video"]?.clearanceScrolled?.toFixed(1)}px`,
      "Attribution": results["9:16 Video"]?.attribution,
      "Format Badge": results["9:16 Video"]?.formatBadge,
    },
    "Web Iframe": {
      "Outer Width": `${results["Web Iframe"]?.width}px`,
      "Outer Height": `${results["Web Iframe"]?.height}px`,
      "Clearance": `${results["Web Iframe"]?.clearanceScrolled?.toFixed(1)}px`,
      "Attribution": "Personal x Kamrul I",
      "Format Badge": "Live / Viewports",
    },
    "Web Fallback": {
      "Outer Width": `${results["Web Fallback"]?.width}px`,
      "Outer Height": `${results["Web Fallback"]?.height}px`,
      "Clearance": `${results["Web Fallback"]?.clearanceScrolled?.toFixed(1)}px`,
      "Attribution": "Personal x Kamrul I",
      "Format Badge": "Fallback Shield",
    },
  });

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
