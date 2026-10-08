import { chromium } from "playwright";
import fs from "fs";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/services/brand-identity", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  for (let i = 0; i <= 6; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 800);
    await page.waitForTimeout(400);
  }

  await page.screenshot({ path: ".qa/aurexa-services-study/detail-fullpage-scrolled.png", fullPage: true });

  const textBlocks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("h1, h2, h3, h4, p, li"))
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim(),
        className: el.className,
      }))
      .filter((item) => item.text && item.text.length > 2);
  });

  fs.writeFileSync(".qa/aurexa-services-study/detail-textblocks.json", JSON.stringify(textBlocks, null, 2));
  await browser.close();
  console.log("Extracted text blocks:", textBlocks.length);
}

main().catch(console.error);
