import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

const fullSource = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const key = Object.keys(h1).find(k => k.startsWith("__reactFiber"));
  let cur = h1[key];
  while (cur) {
    if (cur.memoizedProps && "animationType" in cur.memoizedProps) {
      return cur.type.toString();
    }
    cur = cur.return;
  }
  return null;
});

console.log("FULL TITLE COMPONENT SOURCE:");
console.log(fullSource);

await browser.close();
