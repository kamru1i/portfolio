import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const heroInfo = await page.evaluate(() => {
  const container = document.querySelector('[data-framer-appear-id="1ryjcgq"]');
  if (!container) return null;
  const parent = container.parentElement;
  const grandParent = parent?.parentElement;
  
  const getStyles = (el) => {
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    return {
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      margin: cs.margin,
      padding: cs.padding,
      height: cs.height,
      width: cs.width,
      display: cs.display,
      flexDirection: cs.flexDirection,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
      gap: cs.gap,
    };
  };

  return {
    container: getStyles(container),
    parent: getStyles(parent),
    grandParent: getStyles(grandParent),
  };
});

console.log("HERO CONTAINER STYLES:", JSON.stringify(heroInfo, null, 2));
await browser.close();
