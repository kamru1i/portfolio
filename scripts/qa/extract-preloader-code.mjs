import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

const preloaderCode = await page.evaluate(() => {
  const loaderEl = document.querySelector(".framer-4z7xw, [data-framer-name='Closed']");
  if (!loaderEl) return null;

  // Walk up React Fiber to find the component defining Preloader variants
  const key = Object.keys(loaderEl).find(k => k.startsWith("__reactFiber"));
  let cur = loaderEl[key];
  const list = [];
  while (cur && list.length < 10) {
    if (cur.type && typeof cur.type === "function") {
      list.push({
        name: cur.type.displayName || cur.type.name,
        source: cur.type.toString().slice(0, 1500),
      });
    }
    cur = cur.return;
  }
  return list;
});

console.log("PRELOADER FIBER LIST:", JSON.stringify(preloaderCode, null, 2));

await browser.close();
