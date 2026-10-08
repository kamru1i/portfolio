import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Scroll to 300
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(600);

  const navChildren = await page.evaluate(() => {
    const nav = document.querySelector(".framer-2bq3am-container");
    if (!nav) return [];
    const all = Array.from(nav.querySelectorAll("*"));
    return all.filter(el => {
      const s = window.getComputedStyle(el);
      return s.backdropFilter !== "none" ||
             s.backgroundColor !== "rgba(0, 0, 0, 0)" ||
             s.borderBottomWidth !== "0px" ||
             s.boxShadow !== "none";
    }).map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      bg: window.getComputedStyle(el).backgroundColor,
      backdropFilter: window.getComputedStyle(el).backdropFilter,
      border: window.getComputedStyle(el).border,
      boxShadow: window.getComputedStyle(el).boxShadow,
      dataset: { ...el.dataset },
    }));
  });

  console.log("Nav children with styling:", JSON.stringify(navChildren, null, 2));

  await browser.close();
}

main().catch(console.error);
