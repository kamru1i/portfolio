import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Load the screenshot image into the browser and crop the top 200px
  const imgPath = "C:/Users/kamru/.gemini/antigravity/brain/f35f7056-de69-43fc-bb2e-c8b66a8b26e0/.user_uploaded/media_1791459541424_a873535e.png";
  const imgBase64 = fs.readFileSync(imgPath).toString("base64");

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: #000;">
        <img id="ref" src="data:image/png;base64,${imgBase64}" style="width: 100%; display: block;" />
      </body>
    </html>
  `);

  await page.waitForTimeout(500);

  // Take screenshot of just the top navbar area
  const outDir = path.resolve(".qa/ref-analysis");
  fs.mkdirSync(outDir, { recursive: true });

  await page.screenshot({
    path: path.join(outDir, "navbar-cropped.png"),
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });

  console.log("Cropped navbar saved to .qa/ref-analysis/navbar-cropped.png");
  await browser.close();
}

main().catch(console.error);
