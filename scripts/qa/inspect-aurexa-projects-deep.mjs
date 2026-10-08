import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Locate [data-framer-name="Section - Projects"]
  const projectSectionData = await page.evaluate(() => {
    const section = document.querySelector('[data-framer-name="Section - Projects"]');
    if (!section) return null;

    const rect = section.getBoundingClientRect();
    const style = window.getComputedStyle(section);

    // Recursively extract all direct structural components inside Section - Projects
    function inspectNode(el) {
      const elStyle = window.getComputedStyle(el);
      const elRect = el.getBoundingClientRect();
      const framerName = el.getAttribute('data-framer-name');
      
      const children = Array.from(el.children).map(inspectNode);

      return {
        tag: el.tagName,
        framerName,
        className: el.className,
        rect: {
          width: Math.round(elRect.width),
          height: Math.round(elRect.height),
          top: Math.round(elRect.top),
          left: Math.round(elRect.left),
        },
        styles: {
          display: elStyle.display,
          flexDirection: elStyle.flexDirection,
          gridTemplateColumns: elStyle.gridTemplateColumns,
          gap: elStyle.gap,
          padding: elStyle.padding,
          borderRadius: elStyle.borderRadius,
          border: elStyle.border,
          backgroundColor: elStyle.backgroundColor,
          color: elStyle.color,
          fontSize: elStyle.fontSize,
          fontFamily: elStyle.fontFamily,
          fontWeight: elStyle.fontWeight,
          lineHeight: elStyle.lineHeight,
          letterSpacing: elStyle.letterSpacing,
        },
        text: el.children.length === 0 ? el.innerText?.trim() : undefined,
        imgSrc: el.tagName === 'IMG' ? el.src : undefined,
        href: el.tagName === 'A' ? el.href : undefined,
        children: children.filter(c => c !== null)
      };
    }

    return inspectNode(section);
  });

  fs.writeFileSync("scripts/qa/aurexa-projects-section.json", JSON.stringify(projectSectionData, null, 2));
  console.log("Section data saved.");

  // Scroll to section and screenshot
  const sectionLocator = page.locator('[data-framer-name="Section - Projects"]');
  await sectionLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await sectionLocator.screenshot({ path: "scripts/qa/aurexa-projects-section.png" });
  console.log("Screenshot of Section - Projects saved to scripts/qa/aurexa-projects-section.png");

  await browser.close();
}

main().catch(console.error);
