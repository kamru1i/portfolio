import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Inspect the styles and position of [data-framer-name="Project Description Container"]
  const rightSideData = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name="Project Description Container"]') ||
               document.querySelector('[data-framer-name*="Case Studies"]');
    if (!el) return null;
    const s = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      framerName: el.getAttribute('data-framer-name'),
      position: s.position,
      top: s.top,
      sticky: s.position === 'sticky',
      width: rect.width,
      height: rect.height,
      outerHTML: el.outerHTML
    };
  });

  console.log("Right side sticky info:", JSON.stringify(rightSideData, null, 2));

  // Let's scroll past the section and check positions
  await page.evaluate(() => window.scrollTo(0, 7500));
  await page.waitForTimeout(1000);

  const afterScroll = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name="Project Description Container"]');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top, y: window.scrollY };
  });
  console.log("After scroll position:", afterScroll);

  await browser.close();
}

main().catch(console.error);
