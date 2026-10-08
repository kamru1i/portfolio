import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });

  const sec = page.locator('[data-framer-name="Section - Projects"]');
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await sec.screenshot({ path: "scripts/qa/aurexa-mobile-projects-section.png" });

  const mobileInfo = await sec.evaluate(el => {
    const heading = Array.from(el.querySelectorAll('*')).find(e => e.textContent.trim() === 'Case studies');
    const container = el.firstElementChild;
    return {
      flexDirection: window.getComputedStyle(container).flexDirection,
      headingTop: heading ? heading.getBoundingClientRect().top : null,
      cardsCount: el.querySelectorAll('a img').length,
    };
  });

  console.log("Mobile layout:", JSON.stringify(mobileInfo, null, 2));
  await browser.close();
}

main().catch(console.error);
