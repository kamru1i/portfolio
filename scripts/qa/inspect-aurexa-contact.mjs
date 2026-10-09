import { chromium } from "playwright";
import fs from "fs";

async function main() {
  console.log("Launching browser to inspect https://aurexa.framer.website/contact-us...");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  await page.goto("https://aurexa.framer.website/contact-us", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2000);

  // Take desktop full page screenshot
  await page.screenshot({ path: "scripts/qa/aurexa-contact-desktop-full.png", fullPage: true });
  console.log("Captured aurexa-contact-desktop-full.png");

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/aurexa-contact-mobile-full.png", fullPage: true });
  console.log("Captured aurexa-contact-mobile-full.png");

  // Switch back to desktop for DOM inspection
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.waitForTimeout(500);

  const analysis = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5")).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      classes: h.className,
      style: window.getComputedStyle(h).cssText
    }));

    const formElements = Array.from(document.querySelectorAll("form, input, textarea, select, button")).map(el => ({
      tag: el.tagName,
      type: el.getAttribute("type"),
      name: el.getAttribute("name"),
      placeholder: el.getAttribute("placeholder"),
      text: el.innerText ? el.innerText.trim() : "",
      ariaLabel: el.getAttribute("aria-label"),
      required: el.hasAttribute("required")
    }));

    // Find all sections or main layout containers
    const sections = Array.from(document.querySelectorAll("section, main > div, [data-framer-name]")).map(el => {
      const framerName = el.getAttribute("data-framer-name");
      const text = el.innerText ? el.innerText.trim().slice(0, 200) : "";
      return { framerName, tag: el.tagName, textPreview: text };
    }).filter(s => s.framerName || s.textPreview);

    // FAQ items
    const faqNodes = Array.from(document.querySelectorAll('[data-framer-name*="FAQ"], [data-framer-name*="Faq"], [data-framer-name*="Accordion"], [data-framer-name*="Question"]')).map(el => ({
      name: el.getAttribute("data-framer-name"),
      text: el.innerText ? el.innerText.trim() : ""
    }));

    // Entire text structure
    const bodyText = document.body.innerText;

    return {
      title: document.title,
      headings,
      formElements,
      faqNodes,
      sections: sections.slice(0, 30),
      bodyText
    };
  });

  fs.writeFileSync("scripts/qa/aurexa-contact-analysis.json", JSON.stringify(analysis, null, 2));
  console.log("Analysis written to scripts/qa/aurexa-contact-analysis.json");

  await browser.close();
}

main().catch(console.error);
