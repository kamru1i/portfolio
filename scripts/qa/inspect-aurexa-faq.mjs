import { chromium } from "playwright";
import fs from "fs";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  await page.goto("https://aurexa.framer.website/contact-us", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Scroll down progressively to trigger all whileInView animations
  const scrollSteps = [500, 1000, 1500, 2000, 2500, 3000, 3500];
  for (const y of scrollSteps) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(800);
  }

  await page.screenshot({ path: "scripts/qa/aurexa-contact-scrolled.png", fullPage: true });

  // Get detailed FAQ section
  const faqData = await page.evaluate(() => {
    // Find FAQ elements
    const faqs = [];
    const elements = Array.from(document.querySelectorAll('*'));
    for (const el of elements) {
      if (el.innerText && el.innerText.includes("Have questions? Check out the FAQs")) {
        // Find ancestor or children
        const parent = el.closest('section') || el.parentElement?.parentElement;
        if (parent) {
          const rows = Array.from(parent.querySelectorAll('[data-framer-name*="FAQ"], [data-framer-name*="Accordion"], [data-framer-name*="Row"], [data-framer-name*="Item"], div')).filter(d => {
            return d.innerText && d.innerText.includes("?") && d.children.length < 5;
          });
          return {
            sectionHtml: parent.innerHTML.slice(0, 5000),
            text: parent.innerText
          };
        }
      }
    }
    return null;
  });

  fs.writeFileSync("scripts/qa/aurexa-faq-data.json", JSON.stringify(faqData, null, 2));

  // Click on the first FAQ to see how it opens
  const question1 = page.locator('text="What support do you provide post-launch?"').first();
  if (await question1.isVisible()) {
    console.log("Clicking question 1...");
    await question1.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scripts/qa/aurexa-faq-opened.png" });
  }

  await browser.close();
  console.log("Done scrolling and capturing FAQ!");
}

main().catch(console.error);
