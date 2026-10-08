import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "commit" });

const snapshots = [];
for (let i = 0; i < 20; i++) {
  const data = await page.evaluate(() => {
    const loader = document.querySelector(".framer-4z7xw, [data-framer-name='Closed'], [data-framer-name='Desktop']");
    if (!loader) return null;
    const cs = window.getComputedStyle(loader);
    const innerText = loader.textContent;
    return {
      variantName: loader.getAttribute("data-framer-name"),
      className: loader.className,
      style: loader.getAttribute("style"),
      rect: loader.getBoundingClientRect(),
      opacity: cs.opacity,
      transform: cs.transform,
      visibility: cs.visibility,
      display: cs.display,
      pointerEvents: cs.pointerEvents,
      zIndex: cs.zIndex,
      children: Array.from(loader.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        style: c.getAttribute("style"),
        transform: window.getComputedStyle(c).transform,
        opacity: window.getComputedStyle(c).opacity,
      })),
    };
  });
  if (data) snapshots.push({ i, ...data });
  await page.waitForTimeout(150);
}

console.log("LOADER TRANSITION SNAPSHOTS:", JSON.stringify(snapshots, null, 2));
await browser.close();
