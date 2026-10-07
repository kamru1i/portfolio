import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

const inspect = await page.evaluate(() => {
  const topEl = document.elementFromPoint(195, 422);
  const curtain = document.querySelector('[class*="z-[999]"]');
  const h1 = document.querySelector("h1");
  const main = document.querySelector("main");

  return {
    topEl: topEl ? {
      tag: topEl.tagName,
      className: topEl.className,
      style: topEl.getAttribute("style"),
      rect: topEl.getBoundingClientRect(),
    } : null,
    curtain: curtain ? {
      style: curtain.getAttribute("style"),
      rect: curtain.getBoundingClientRect(),
    } : null,
    h1: h1 ? {
      rect: h1.getBoundingClientRect(),
      opacity: window.getComputedStyle(h1).opacity,
      color: window.getComputedStyle(h1).color,
    } : null,
    main: main ? {
      rect: main.getBoundingClientRect(),
      opacity: window.getComputedStyle(main).opacity,
    } : null,
  };
});

console.log("INSPECT:", JSON.stringify(inspect, null, 2));
await browser.close();
