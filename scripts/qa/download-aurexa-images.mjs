import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  console.log("Loading Aurexa...");
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Extract all images in Section - Projects on Aurexa
  const images = await page.evaluate(() => {
    const section = document.querySelector('[data-framer-name="Section - Projects"]');
    if (!section) return [];
    return Array.from(section.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
    }));
  });

  console.log("Found Aurexa project images:", images);

  const destDir = "public/images/aurexa";
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Download the hero case study images
  let idx = 1;
  for (const img of images) {
    if (img.width > 200 && img.src.startsWith("http")) {
      const filename = `aurexa-work-${idx}.png`;
      const filePath = path.join(destDir, filename);
      console.log(`Downloading ${img.src} -> ${filePath}`);
      await new Promise((resolve, reject) => {
        https.get(img.src, (res) => {
          const fileStream = fs.createWriteStream(filePath);
          res.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`Saved ${filename}`);
            resolve();
          });
        }).on("error", reject);
      });
      idx++;
    }
  }

  await browser.close();
}

main().catch(console.error);
