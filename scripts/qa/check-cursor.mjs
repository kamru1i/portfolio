import { chromium } from "playwright";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await p.waitForTimeout(4000);

// Scroll down to services
await p.evaluate(() => window.scrollTo(0, 4800));
await p.waitForTimeout(1000);

// Hover over row 2: DIGITAL STRATEGY
const row = await p.$('[data-framer-cursor="xc9c66"]');
if (row) {
  const box = await row.boundingBox();
  console.log("Row box:", box);
  await p.mouse.move(box.x + 200, box.y + box.height / 2);
  await p.waitForTimeout(600);
  
  // Find what appeared
  const hovered = await p.evaluate(() => {
    // Find all fixed or absolute elements with images that might be following cursor
    const els = [...document.querySelectorAll("body *")].filter(e => {
      const s = getComputedStyle(e);
      return (s.position === "fixed" || s.position === "absolute") && s.pointerEvents === "none" && e.querySelector("img");
    });
    return els.map(e => ({
      html: e.outerHTML.slice(0, 500),
      rect: e.getBoundingClientRect(),
      img: e.querySelector("img")?.src,
      style: e.getAttribute("style"),
    }));
  });
  console.log("Hovered elements:", JSON.stringify(hovered, null, 2));

  // Also take a screenshot of hover
  await p.screenshot({ path: ".qa/probe/service-cursor-hover.png", clip: { x: box.x - 50, y: box.y - 100, width: box.width + 100, height: box.height + 200 } });
}

await b.close();
