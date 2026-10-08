import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });

  const data = await page.evaluate(() => {
    const sec = document.querySelector('[data-framer-name="Section - Projects"]');
    if (!sec) return { error: "not found" };

    // Find first card
    const firstCard = sec.querySelector('a');
    
    // Find right sticky header
    const heading = Array.from(sec.querySelectorAll('*')).find(e => e.textContent.trim() === 'Case studies');
    const headerContainer = heading ? heading.closest('[data-framer-name*="Header"]') || heading.parentElement.parentElement : null;

    // Trigger hover on card to see hover overlay in DOM
    const cardChildren = firstCard ? Array.from(firstCard.querySelectorAll('*')).map(c => ({
      tag: c.tagName,
      className: c.className,
      framerName: c.getAttribute('data-framer-name'),
      text: c.innerText?.trim(),
      opacity: window.getComputedStyle(c).opacity,
    })) : [];

    return {
      cardRect: firstCard?.getBoundingClientRect(),
      cardBorderRadius: firstCard ? window.getComputedStyle(firstCard).borderRadius : null,
      cardPadding: firstCard ? window.getComputedStyle(firstCard).padding : null,
      headingStyles: heading ? {
        fontFamily: window.getComputedStyle(heading).fontFamily,
        fontSize: window.getComputedStyle(heading).fontSize,
        fontWeight: window.getComputedStyle(heading).fontWeight,
        color: window.getComputedStyle(heading).color,
      } : null,
      cardChildren: cardChildren.slice(0, 15),
    };
  });

  console.log("Card & Header Details:", JSON.stringify(data, null, 2));

  // Now hover over the first card and take a screenshot of the hover state!
  const firstCardEl = page.locator('[data-framer-name="Section - Projects"] a').first();
  await firstCardEl.scrollIntoViewIfNeeded();
  await firstCardEl.hover();
  await page.waitForTimeout(600);
  await firstCardEl.screenshot({ path: "scripts/qa/aurexa-live-card-hover.png" });

  // Also take full screenshot of the section
  const secEl = page.locator('[data-framer-name="Section - Projects"]');
  await secEl.screenshot({ path: "scripts/qa/aurexa-live-section-hover.png" });

  await browser.close();
}

main().catch(console.error);
