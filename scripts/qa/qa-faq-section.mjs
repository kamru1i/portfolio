import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = "public/test-screenshots/faq";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runQa() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    console.log(`\n=== Testing FAQ on viewport: ${vp.name} ===`);
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    // Wait for preloader/intro curtain if present
    await page.waitForTimeout(2200);

    // Locate FAQ section
    const faqSection = page.locator("#faq");
    const faqExists = await faqSection.count();
    console.log(`FAQ section found: ${faqExists > 0}`);

    if (faqExists > 0) {
      // Scroll into view
      await faqSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      // Verify questions count
      const buttons = faqSection.locator("button[id^='faq-btn-']");
      const buttonCount = await buttons.count();
      console.log(`Accordion buttons count: ${buttonCount}`);

      // Verify contact card
      const contactCard = faqSection.locator("text=Talk with Kamrul");
      console.log(`Contact card count: ${await contactCard.count()}`);

      // Capture initial state screenshot of FAQ
      await faqSection.screenshot({
        path: path.join(OUT_DIR, `faq-${vp.name}-initial.png`),
      });

      // Test interaction: click question 2
      if (buttonCount > 1) {
        const btn2 = buttons.nth(1);
        const q2Text = await btn2.innerText();
        console.log(`Clicking Question 2: "${q2Text.replace(/\n/g, ' ')}"`);
        
        await btn2.click();
        await page.waitForTimeout(600); // wait for height animation

        const ariaExpanded = await btn2.getAttribute("aria-expanded");
        console.log(`Question 2 aria-expanded: ${ariaExpanded}`);

        // Capture after click screenshot
        await faqSection.screenshot({
          path: path.join(OUT_DIR, `faq-${vp.name}-expanded.png`),
        });
      }
    }

    await page.close();
  }

  await browser.close();
  console.log("\nQA script completed successfully!");
}

runQa().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
