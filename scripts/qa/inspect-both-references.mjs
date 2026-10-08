import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  console.log("=== INSPECTING PATRICK JANE ===");
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2000);

  // Extract all cards in Selected Works
  const pjCards = await page.evaluate(() => {
    // Find Selected Works or all project items
    const heading = Array.from(document.querySelectorAll("h1, h2, h3, div, p")).find(el => el.innerText && el.innerText.trim() === "SELECTED WORKS");
    let container = heading;
    while (container && container.parentElement && container.parentElement.tagName !== "BODY" && container.getBoundingClientRect().height < 1500) {
      container = container.parentElement;
    }

    const allImages = Array.from(document.querySelectorAll("img")).map(img => {
      const rect = img.getBoundingClientRect();
      const parent = img.closest("a") || img.closest('[data-framer-name*="Card"]') || img.parentElement;
      return {
        src: img.src,
        alt: img.alt,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top + window.scrollY),
        left: Math.round(rect.left),
        parentText: parent ? parent.innerText?.trim().replace(/\n+/g, " | ") : "",
        parentClass: parent?.className,
      };
    }).filter(i => i.width > 200 && i.top > 800 && i.top < 6000);

    return { allImages };
  });

  console.log("PJ Images in works:", JSON.stringify(pjCards, null, 2));

  // Let's take full screenshot of Patrick Jane Selected Works
  await page.screenshot({ path: "scripts/qa/pj-full-works.png", fullPage: true });

  console.log("=== INSPECTING AUREXA CASE STUDIES ===");
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2000);

  // Locate Section - Projects and take screenshot of the entire section
  const aurexaProjects = page.locator('[data-framer-name="Section - Projects"]');
  await aurexaProjects.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await aurexaProjects.screenshot({ path: "scripts/qa/aurexa-full-projects-section.png" });

  await browser.close();
}

main().catch(console.error);
