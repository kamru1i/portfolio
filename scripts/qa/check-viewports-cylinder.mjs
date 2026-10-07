import { chromium } from "playwright";

const browser = await chromium.launch();

for (const width of [1440, 810, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const props = await page.evaluate(() => {
    const grabEl = document.querySelector('[style*="perspective: 3000px"], [style*="perspective:3000px"], [style*="grab"]');
    if (!grabEl) return null;
    const key = Object.keys(grabEl).find(k => k.startsWith("__reactFiber"));
    let cur = grabEl[key];
    while (cur) {
      if (typeof cur.type === "function" && cur.memoizedProps && "imageWidth" in cur.memoizedProps) {
        const { images, ...rest } = cur.memoizedProps;
        return rest;
      }
      cur = cur.return;
    }
    return null;
  });

  const computed = await page.evaluate(() => {
    const grabEl = document.querySelector('[style*="perspective: 3000px"], [style*="perspective:3000px"], [style*="grab"]');
    if (!grabEl) return null;
    const stage = grabEl.querySelector('[style*="transform-style: preserve-3d"], [style*="transform-style:preserve-3d"]');
    const center = stage?.firstElementChild;
    const card = center?.firstElementChild;
    return {
      grabRect: grabEl.getBoundingClientRect(),
      centerRect: center ? center.getBoundingClientRect() : null,
      cardRect: card ? card.getBoundingClientRect() : null,
      centerStyle: center ? center.getAttribute("style") : null,
    };
  });

  console.log(`=== VIEWPORT ${width} ===`);
  console.log("Props:", JSON.stringify(props, null, 2));
  console.log("Computed:", JSON.stringify(computed, null, 2));

  await page.close();
}

await browser.close();
