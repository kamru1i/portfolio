import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const fontFaces = await page.evaluate(() => {
    const fonts = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSFontFaceRule) {
            fonts.push({
              family: rule.style.fontFamily,
              weight: rule.style.fontWeight,
              src: rule.style.src.slice(0, 150)
            });
          }
        }
      } catch (e) {}
    }
    return fonts;
  });

  console.log("Aurexa Font Faces:", JSON.stringify(fontFaces, null, 2));

  await browser.close();
}

main().catch(console.error);
