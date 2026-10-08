import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  const pjProjects = await page.evaluate(() => {
    // Look for all project cards or links
    const cards = Array.from(document.querySelectorAll('a, div')).filter(el => {
      const cls = el.className || '';
      const framerName = el.getAttribute('data-framer-name') || '';
      return cls.includes('framer-i6zijm') || framerName.includes('Card') || framerName.includes('Project');
    });

    // Also look for all links that have an image and title
    const projectBlocks = Array.from(document.querySelectorAll('a')).map(a => {
      const img = a.querySelector('img');
      const text = a.innerText.trim();
      const rect = a.getBoundingClientRect();
      return {
        text,
        href: a.href,
        hasImg: !!img,
        imgSrc: img ? img.src : null,
        rect: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top + window.scrollY),
          left: Math.round(rect.left),
        }
      };
    }).filter(p => p.hasImg && p.text && p.rect.top < 7000);

    return { projectBlocks };
  });

  console.log("ALL PJ PROJECTS:", JSON.stringify(pjProjects, null, 2));

  // Let's also check Aurexa's full case studies section
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });
  const aurexaSection = page.locator('[data-framer-name="Section - Projects"]');
  await aurexaSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  // Let's take a screenshot of Aurexa Section - Projects
  await aurexaSection.screenshot({ path: "scripts/qa/aurexa-section-projects-clean.png" });

  await browser.close();
}

main().catch(console.error);
