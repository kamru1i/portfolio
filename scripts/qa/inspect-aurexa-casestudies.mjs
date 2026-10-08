import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  console.log("Loading Aurexa...");
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Scroll to Case Studies section
  await page.evaluate(() => {
    window.scrollTo(0, 7000);
  });
  await page.waitForTimeout(2000);

  // Find the Case Studies section element
  const caseStudiesData = await page.evaluate(() => {
    const section = document.querySelector('[data-framer-name*="Case"]') || 
                    document.querySelector('[data-framer-name*="Project"]') ||
                    Array.from(document.querySelectorAll('div')).find(d => d.innerText && d.innerText.includes("Case studies"));

    // Find all cards or elements within this section
    const cards = Array.from(document.querySelectorAll('[data-framer-name*="Case Study"], [data-framer-name*="Project Card"], [data-framer-name*="Case"]')).map(el => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const imgs = Array.from(el.querySelectorAll('img')).map(img => ({ src: img.src, alt: img.alt, width: img.width, height: img.height }));
      const links = Array.from(el.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
      return {
        framerName: el.getAttribute('data-framer-name'),
        className: el.className,
        rect: { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height },
        text: el.innerText ? el.innerText.trim().slice(0, 300).replace(/\n+/g, " ") : "",
        borderRadius: computed.borderRadius,
        backgroundColor: computed.backgroundColor,
        border: computed.border,
        padding: computed.padding,
        gap: computed.gap,
        display: computed.display,
        flexDirection: computed.flexDirection,
        imgs,
        links,
        htmlSnippet: el.outerHTML.slice(0, 500)
      };
    });

    return { cards };
  });

  fs.writeFileSync("scripts/qa/aurexa-case-studies.json", JSON.stringify(caseStudiesData, null, 2));

  // Let's take a screenshot of that area
  await page.screenshot({ path: "scripts/qa/aurexa-case-studies.png", clip: { x: 0, y: 7000, width: 1440, height: 2100 } });
  console.log("Screenshot saved to scripts/qa/aurexa-case-studies.png");

  await browser.close();
}

main().catch(console.error);
