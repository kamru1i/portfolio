import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  console.log("Navigating to https://aurexa.framer.website/ ...");
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Get all headings and text blocks
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h1, h2, h3, h4, p, a, div"))
      .map(el => ({
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim().replace(/\n+/g, " ") : "",
        id: el.id,
        framerName: el.getAttribute("data-framer-name"),
      }))
      .filter(item => item.text && (
        /project/i.test(item.text) || 
        /case stud/i.test(item.text) || 
        /work/i.test(item.text) || 
        /selected/i.test(item.text)
      ))
      .slice(0, 30);
  });
  console.log("Filtered items:", headings);

  // Take full page screenshot and section screenshots
  await page.screenshot({ path: "scripts/qa/aurexa-full.png", fullPage: true });
  console.log("Full page screenshot saved.");

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
