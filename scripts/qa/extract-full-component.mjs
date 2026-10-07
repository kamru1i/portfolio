import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const fullSource = await page.evaluate(() => {
  const grabEl = document.querySelector('[style*="perspective: 3000px"], [style*="perspective:3000px"], [style*="grab"]');
  const key = Object.keys(grabEl).find(k => k.startsWith("__reactFiber"));
  let cur = grabEl[key];
  while (cur) {
    if (typeof cur.type === "function" && cur.memoizedProps && "imageWidth" in cur.memoizedProps) {
      return {
        props: cur.memoizedProps,
        source: cur.type.toString()
      };
    }
    cur = cur.return;
  }
  return null;
});

console.log("EXACT COMPONENT PROPS:", JSON.stringify(fullSource?.props, null, 2));
console.log("================= EXACT COMPONENT SOURCE =================");
console.log(fullSource?.source);

await browser.close();
