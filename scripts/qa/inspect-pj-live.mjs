import { chromium } from "playwright";

async function inspect() {
  const browser = await chromium.launch();

  for (const vp of [
    { name: "laptop", width: 1440, height: 900 },
    { name: "fhd", width: 1920, height: 1080 },
    { name: "4k", width: 3840, height: 2160 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const allHeadings = Array.from(document.querySelectorAll("h1, h2, span, p"));
      const titleEl = allHeadings.find((el) => el.innerText?.trim() === "PATRICK JANE");
      const titleStyle = titleEl ? window.getComputedStyle(titleEl) : null;
      const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;

      const subEl = allHeadings.find((el) =>
        el.innerText?.includes("I turn ambitious ideas")
      );
      const subRect = subEl ? subEl.getBoundingClientRect() : null;

      // Card elements
      const cards = Array.from(document.querySelectorAll("img, div[style*='background']")).filter(
        (el) => el.getBoundingClientRect().height > 200 && el.getBoundingClientRect().top > 300
      );
      const firstCard = cards[0];
      const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
      const cardStyle = firstCard ? window.getComputedStyle(firstCard) : null;

      return {
        titleFontSize: titleStyle?.fontSize,
        titleLineHeight: titleStyle?.lineHeight,
        titleRect: titleRect
          ? {
              top: titleRect.top,
              bottom: titleRect.bottom,
              left: titleRect.left,
              width: titleRect.width,
              height: titleRect.height,
            }
          : null,
        subRect: subRect
          ? {
              top: subRect.top,
              bottom: subRect.bottom,
              height: subRect.height,
            }
          : null,
        cardRect: cardRect
          ? {
              top: cardRect.top,
              bottom: cardRect.bottom,
              width: cardRect.width,
              height: cardRect.height,
            }
          : null,
      };
    });

    console.log(`\n=== Patrick Jane on ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log("Title Font Size:", data.titleFontSize);
    console.log("Title Rect:", data.titleRect);
    console.log("Subtitle Rect:", data.subRect);
    console.log("Card Rect:", data.cardRect);
    if (data.titleRect) {
      console.log(`Title Top %: ${((data.titleRect.top / vp.height) * 100).toFixed(1)}%`);
      console.log(`Title Width %: ${((data.titleRect.width / vp.width) * 100).toFixed(1)}%`);
    }
    if (data.cardRect) {
      console.log(`Card Bottom %: ${((data.cardRect.bottom / vp.height) * 100).toFixed(1)}%`);
      console.log(`Total Composition Height: ${(data.cardRect.bottom - (data.titleRect?.top || 0)).toFixed(1)}px`);
      console.log(`Total Composition % of Viewport: ${(((data.cardRect.bottom - (data.titleRect?.top || 0)) / vp.height) * 100).toFixed(1)}%`);
    }

    await page.screenshot({ path: `scripts/qa/pj-live-${vp.name}.png` });
    await page.close();
  }

  await browser.close();
}

inspect().catch(console.error);
