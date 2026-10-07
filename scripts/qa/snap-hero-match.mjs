import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

await page.screenshot({ path: ".qa/hero-test/hero-reference-match.png" });
console.log("Saved hero-reference-match.png");

await browser.close();
