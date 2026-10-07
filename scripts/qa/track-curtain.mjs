import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

for (let s = 1; s <= 6; s++) {
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const c = document.querySelector('[class*="z-[999]"]');
    return {
      curtainExists: !!c,
      style: c?.getAttribute("style"),
      classes: c?.className,
    };
  });
  console.log(`Second ${s}:`, info);
}

await browser.close();
