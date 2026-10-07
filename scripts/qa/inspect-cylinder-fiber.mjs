import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const container = document.querySelector('[data-framer-appear-id="1ryjcgq"]');
  if (!container) return { error: "Container not found" };

  // Get React Fiber
  const fiberKey = Object.keys(container).find(k => k.startsWith("__reactFiber") || k.startsWith("__reactInternalInstance"));
  
  // Find child with style perspective 3000px
  const grabEl = container.querySelector('[style*="perspective: 3000px"], [style*="perspective:3000px"]') || container.querySelector('[style*="grab"]');
  
  // Let's inspect grabEl
  const grabFiberKey = grabEl ? Object.keys(grabEl).find(k => k.startsWith("__reactFiber")) : null;
  const grabPropsKey = grabEl ? Object.keys(grabEl).find(k => k.startsWith("__reactProps")) : null;

  return {
    grabElStyle: grabEl ? grabEl.getAttribute("style") : null,
    grabProps: grabPropsKey ? Object.keys(grabEl[grabPropsKey]) : null,
    hasOnPointerDown: grabPropsKey ? typeof grabEl[grabPropsKey].onPointerDown : null,
    hasOnMouseDown: grabPropsKey ? typeof grabEl[grabPropsKey].onMouseDown : null,
    hasOnTouchStart: grabPropsKey ? typeof grabEl[grabPropsKey].onTouchStart : null,
    // let's serialize functions or inspect component hierarchy
  };
});

console.log("INFO:", JSON.stringify(info, null, 2));

// Let's inspect the entire React fiber hierarchy of grabEl
const fiberDetails = await page.evaluate(() => {
  const grabEl = document.querySelector('[style*="perspective: 3000px"], [style*="perspective:3000px"], [style*="grab"]');
  if (!grabEl) return { error: "not found" };
  const key = Object.keys(grabEl).find(k => k.startsWith("__reactFiber"));
  if (!key) return { error: "no fiber" };

  let cur = grabEl[key];
  const hierarchy = [];
  while (cur && hierarchy.length < 15) {
    hierarchy.push({
      type: typeof cur.type === "string" ? cur.type : cur.type?.name || cur.type?.displayName || "Anonymous",
      memoizedProps: cur.memoizedProps ? Object.keys(cur.memoizedProps) : null,
      source: cur.type ? String(cur.type).slice(0, 500) : null
    });
    cur = cur.return;
  }
  return hierarchy;
});

console.log("FIBER HIERARCHY:", JSON.stringify(fiberDetails, null, 2));

await browser.close();
