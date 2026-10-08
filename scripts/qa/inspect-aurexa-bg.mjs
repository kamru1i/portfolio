import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Scroll to 300
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(600);

  const bgInfo = await page.evaluate(() => {
    // Find all fixed elements at top
    const fixedEls = Array.from(document.querySelectorAll("*")).filter(el => {
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (s.position === "fixed" || s.position === "sticky") && r.top <= 10 && r.height > 10;
    });

    return fixedEls.map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      bg: window.getComputedStyle(el).backgroundColor,
      backgroundImage: window.getComputedStyle(el).backgroundImage,
      backdropFilter: window.getComputedStyle(el).backdropFilter,
      boxShadow: window.getComputedStyle(el).boxShadow,
      borderBottom: window.getComputedStyle(el).borderBottom,
    }));
  });

  console.log("Scrolled background elements:", JSON.stringify(bgInfo, null, 2));

  await browser.close();
}

main().catch(console.error);
