import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Locate the first project card
  const cardLocator = page.locator('[data-framer-name="Section - Projects"] [data-framer-name="Projects CMS"]').first();
  await cardLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take default state screenshot of the card
  await cardLocator.screenshot({ path: "scripts/qa/aurexa-card-default.png" });
  console.log("Card default screenshot saved.");

  // Hover over the card
  await cardLocator.hover();
  await page.waitForTimeout(800);

  // Take hover state screenshot of the card
  await cardLocator.screenshot({ path: "scripts/qa/aurexa-card-hover.png" });
  console.log("Card hover screenshot saved.");

  // Also take screenshot of the entire Projects section now that it's in view
  const sectionLocator = page.locator('[data-framer-name="Section - Projects"]');
  await sectionLocator.screenshot({ path: "scripts/qa/aurexa-projects-section-clean.png" });
  console.log("Projects section clean screenshot saved.");

  // Get computed styles of card before and during hover
  const styles = await cardLocator.evaluate(el => {
    function getStyles(elem) {
      const s = window.getComputedStyle(elem);
      return {
        tag: elem.tagName,
        framerName: elem.getAttribute('data-framer-name'),
        className: elem.className,
        color: s.color,
        background: s.background,
        backgroundColor: s.backgroundColor,
        backdropFilter: s.backdropFilter,
        borderRadius: s.borderRadius,
        border: s.border,
        opacity: s.opacity,
        transform: s.transform,
        transition: s.transition,
      };
    }
    return {
      card: getStyles(el),
      children: Array.from(el.querySelectorAll('*')).map(getStyles)
    };
  });

  fs.writeFileSync("scripts/qa/aurexa-card-styles.json", JSON.stringify(styles, null, 2));

  await browser.close();
}

main().catch(console.error);
