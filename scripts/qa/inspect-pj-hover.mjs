import { chromium } from "playwright";

async function inspectHover() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const card = page.locator("a[href*='shadow-archive']").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const preHover = await card.evaluate((el) => {
    const img = el.querySelector("img");
    const title = el.querySelector("span, p, h2, h3, h4");
    return {
      imgTransform: img ? window.getComputedStyle(img).transform : null,
      titleDecoration: title ? window.getComputedStyle(title).textDecoration : null,
      titleHTML: title ? title.outerHTML : null,
    };
  });

  await card.hover();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/qa/pj-hover-card1.png" });

  const postHover = await card.evaluate((el) => {
    const img = el.querySelector("img");
    const title = el.querySelector("span, p, h2, h3, h4");
    return {
      imgTransform: img ? window.getComputedStyle(img).transform : null,
      titleDecoration: title ? window.getComputedStyle(title).textDecoration : null,
      titleHTML: title ? title.outerHTML : null,
    };
  });

  console.log("Pre hover:", JSON.stringify(preHover, null, 2));
  console.log("Post hover:", JSON.stringify(postHover, null, 2));
  await browser.close();
}

inspectHover().catch(console.error);
