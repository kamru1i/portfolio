import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(4000); // Wait 4s so all animations are 100% complete

const box = await page.locator("#hero-3d-cylinder").boundingBox();
console.log("Mobile Box:", box);

const data = await page.evaluate(() => {
  const cyl = document.getElementById("hero-3d-cylinder");
  const stage = cyl?.querySelector('[style*="preserve-3d"]');
  const innerCyl = stage?.firstElementChild;
  return {
    cylVisible: !!cyl,
    cylRect: cyl?.getBoundingClientRect(),
    innerCylTransform: innerCyl?.getAttribute("style"),
    bodyHeight: document.body.scrollHeight,
    scrollY: window.scrollY,
  };
});
console.log("Mobile Data:", JSON.stringify(data, null, 2));

await page.screenshot({ path: ".qa/hero-test/debug-mobile.png" });
console.log("Saved debug-mobile.png");

await browser.close();
