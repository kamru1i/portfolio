import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });

  const data = await page.evaluate(() => {
    // Find "Case studies"
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, div, span"));
    const heading = headings.find(h => h.textContent.trim() === "Case studies");
    if (!heading) return { error: "Case studies heading not found" };

    // Section container
    let section = heading.closest('[data-framer-name*="Project"]') || heading.closest('section') || heading.parentElement;
    while (section && section.parentElement && !section.getAttribute('data-framer-name')?.includes('Project')) {
      if (section.parentElement.tagName === 'BODY') break;
      section = section.parentElement;
    }

    // Inspect heading styles
    const csH = window.getComputedStyle(heading);
    
    // Find cards grid
    const cards = Array.from(document.querySelectorAll('[data-framer-name*="Card"]')).filter(c => {
      return c.innerText && c.querySelector('img');
    });

    const sampleCard = cards[0];
    const cardStyles = sampleCard ? {
      width: window.getComputedStyle(sampleCard).width,
      height: window.getComputedStyle(sampleCard).height,
      borderRadius: window.getComputedStyle(sampleCard).borderRadius,
      backgroundColor: window.getComputedStyle(sampleCard).backgroundColor,
      border: window.getComputedStyle(sampleCard).border,
    } : null;

    // Inspect grid container
    const gridContainer = sampleCard ? sampleCard.parentElement : null;
    const gridStyles = gridContainer ? {
      display: window.getComputedStyle(gridContainer).display,
      gridTemplateColumns: window.getComputedStyle(gridContainer).gridTemplateColumns,
      gap: window.getComputedStyle(gridContainer).gap,
      width: window.getComputedStyle(gridContainer).width,
    } : null;

    // Right column container (the sticky header block)
    const headerBlock = heading.parentElement;
    const headerBlockStyles = headerBlock ? {
      position: window.getComputedStyle(headerBlock).position,
      top: window.getComputedStyle(headerBlock).top,
      width: window.getComputedStyle(headerBlock).width,
    } : null;

    // Outer layout (left vs right)
    const outerContainer = gridContainer ? gridContainer.parentElement : null;
    const outerStyles = outerContainer ? {
      display: window.getComputedStyle(outerContainer).display,
      gridTemplateColumns: window.getComputedStyle(outerContainer).gridTemplateColumns,
      flexDirection: window.getComputedStyle(outerContainer).flexDirection,
      gap: window.getComputedStyle(outerContainer).gap,
    } : null;

    return {
      heading: {
        text: heading.textContent.trim(),
        tag: heading.tagName,
        fontFamily: csH.fontFamily,
        fontSize: csH.fontSize,
        fontWeight: csH.fontWeight,
        letterSpacing: csH.letterSpacing,
        lineHeight: csH.lineHeight,
      },
      cardsCount: cards.length,
      sampleCardText: sampleCard ? sampleCard.innerText : null,
      cardStyles,
      gridStyles,
      headerBlockStyles,
      outerStyles,
    };
  });

  console.log("Aurexa Case Studies inspection:", JSON.stringify(data, null, 2));

  // Take screenshot of that section
  const sectionEl = page.locator('text="Case studies"').first();
  let container = sectionEl;
  for (let i = 0; i < 4; i++) {
    container = container.locator('..');
  }
  await container.screenshot({ path: "scripts/qa/aurexa-live-casestudies-target.png" }).catch(() => {});

  await browser.close();
}

main().catch(console.error);
