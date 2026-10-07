import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const box = await page.locator("#hero-3d-cylinder").boundingBox();
console.log("Box:", box);

const initialScroll = await page.evaluate(() => window.scrollY);
console.log("Initial scrollY:", initialScroll);

const startX = box.x + box.width / 2;
const startY = box.y + box.height / 2;

// Check what element is at (startX, startY)
const elAtPoint = await page.evaluate(({ x, y }) => {
  const el = document.elementFromPoint(x, y);
  return {
    tag: el?.tagName,
    id: el?.id,
    className: el?.className,
    style: el?.getAttribute("style"),
  };
}, { x: startX, y: startY });

console.log("Element at point:", elAtPoint);

// Move and drag
await page.mouse.move(startX, startY);
await page.mouse.down();
await page.mouse.move(startX - 200, startY, { steps: 10 });

const dragScroll = await page.evaluate(() => ({
  scrollY: window.scrollY,
  transform: document.querySelector("#hero-3d-cylinder > div > div")?.getAttribute("style"),
}));
console.log("During drag:", dragScroll);

await page.mouse.up();
await page.waitForTimeout(200);

const afterScroll = await page.evaluate(() => ({
  scrollY: window.scrollY,
  transform: document.querySelector("#hero-3d-cylinder > div > div")?.getAttribute("style"),
}));
console.log("After drag:", afterScroll);

await browser.close();
