import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });

  const data = await page.evaluate(() => {
    const sec = document.querySelector('[data-framer-name="Section - Projects"]');
    if (!sec) return null;

    const container = sec.querySelector('[data-framer-name="Container"]') || sec.firstElementChild;
    const cardsGrid = sec.querySelector('a')?.parentElement?.parentElement;
    const rightHeader = Array.from(sec.querySelectorAll('*')).find(e => e.textContent.trim() === 'Case studies')?.closest('[data-framer-name*="Header"]') || Array.from(sec.querySelectorAll('*')).find(e => e.textContent.trim() === 'Case studies')?.parentElement?.parentElement;

    return {
      container: {
        display: window.getComputedStyle(container).display,
        gap: window.getComputedStyle(container).gap,
        width: window.getComputedStyle(container).width,
        justifyContent: window.getComputedStyle(container).justifyContent,
      },
      cardsGrid: {
        width: cardsGrid ? window.getComputedStyle(cardsGrid).width : null,
        display: cardsGrid ? window.getComputedStyle(cardsGrid).display : null,
        gap: cardsGrid ? window.getComputedStyle(cardsGrid).gap : null,
        gridTemplateColumns: cardsGrid ? window.getComputedStyle(cardsGrid).gridTemplateColumns : null,
      },
      rightHeader: {
        width: rightHeader ? window.getComputedStyle(rightHeader).width : null,
        position: rightHeader ? window.getComputedStyle(rightHeader).position : null,
        top: rightHeader ? window.getComputedStyle(rightHeader).top : null,
      }
    };
  });

  console.log("Aurexa exact container info:", JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch(console.error);
