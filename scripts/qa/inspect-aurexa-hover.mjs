import { chromium } from "playwright";
import fs from "fs";

async function inspectHover() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  // Find service section
  const serviceSection = page.locator('[data-framer-name="Section - service"]');
  await serviceSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Find service rows
  const rows = await serviceSection.locator('[data-framer-name*="Service"], [data-framer-name*="Row"], a').all();
  console.log(`Found ${rows.length} candidate elements in services`);
  
  // Take screenshot of idle state
  await serviceSection.screenshot({ path: "scripts/qa/aurexa-services-idle.png" });
  
  // Hover over the first service
  const firstRow = serviceSection.locator('[data-framer-name="Service Wrap"], [data-framer-name*="Item"], a').first();
  if (await firstRow.count() > 0) {
    const box = await firstRow.boundingBox();
    console.log("Hovering row at:", box);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(800);
    
    // Screenshot hovered state
    await serviceSection.screenshot({ path: "scripts/qa/aurexa-services-hovered.png" });
    
    // Inspect DOM during hover
    const hoverData = await serviceSection.evaluate((el) => {
      const activeElements = [];
      el.querySelectorAll("*").forEach((c) => {
        const cs = getComputedStyle(c);
        if (cs.opacity !== "0" && cs.display !== "none" && (cs.position === "absolute" || cs.overflow === "hidden" || c.tagName === "IMG")) {
          activeElements.push({
            tag: c.tagName,
            name: c.getAttribute("data-framer-name"),
            className: c.className.slice(0, 50),
            transform: cs.transform,
            opacity: cs.opacity,
            clipPath: cs.clipPath,
            borderRadius: cs.borderRadius,
            width: cs.width,
            height: cs.height,
            src: c.src ? c.src.slice(0, 80) : null,
          });
        }
      });
      return activeElements;
    });
    
    fs.writeFileSync("scripts/qa/aurexa-hover-dom.json", JSON.stringify(hoverData, null, 2));
    console.log("Hovered elements:", hoverData.filter(e => e.tag === "IMG" || e.name));
  }
  
  await browser.close();
}

inspectHover().catch(console.error);
