import { chromium } from "playwright";

const browser = await chromium.launch({
  args: ["--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"]
});

const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.bringToFront();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

const hasCurtain = await page.evaluate(() => !!document.querySelector('[class*="z-[999]"]'));
console.log("Has curtain after 4s:", hasCurtain);

await page.screenshot({ path: ".qa/hero-test/test-mobile-active.png" });
console.log("Saved test-mobile-active.png");

await browser.close();
