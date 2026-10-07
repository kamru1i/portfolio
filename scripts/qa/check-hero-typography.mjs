import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const p = document.querySelector("p");
  const h1Style = h1 ? window.getComputedStyle(h1) : null;
  const pStyle = p ? window.getComputedStyle(p) : null;

  return {
    h1: h1Style ? {
      fontSize: h1Style.fontSize,
      lineHeight: h1Style.lineHeight,
      letterSpacing: h1Style.letterSpacing,
      textTransform: h1Style.textTransform,
      fontFamily: h1Style.fontFamily,
      margin: h1Style.margin,
    } : null,
    p: pStyle ? {
      fontSize: pStyle.fontSize,
      lineHeight: pStyle.lineHeight,
      letterSpacing: pStyle.letterSpacing,
      color: pStyle.color,
      fontFamily: pStyle.fontFamily,
      maxWidth: pStyle.maxWidth,
    } : null,
  };
});

console.log("REFERENCE TYPOGRAPHY:", JSON.stringify(data, null, 2));
await browser.close();
