import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  const data = await page.evaluate(() => {
    const s = document.querySelector('[data-framer-name="Section - service"]');
    if (!s) return null;
    const header = s.querySelector('[data-framer-name="Header"]') || s.children[0];
    
    // Find all text elements in header
    const items = [];
    s.querySelectorAll("*").forEach((el) => {
      const name = el.getAttribute("data-framer-name") || "";
      if (name.includes("Title") || name.includes("Caption") || name.includes("Description") || name.includes("Header") || name.includes("Sub")) {
        const cs = getComputedStyle(el);
        items.push({
          name,
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 120),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily,
          color: cs.color,
          display: cs.display,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          maxWidth: cs.maxWidth,
          textAlign: cs.textAlign,
        });
      }
    });
    
    return {
      headerRect: header ? header.getBoundingClientRect() : null,
      items: items.slice(0, 20),
    };
  });
  
  console.log("Aurexa Services Header Info:\n", JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch(console.error);
