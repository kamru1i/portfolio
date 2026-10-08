import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  for (const w of [768, 1024, 1200]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const initial = await page.evaluate(() => {
      const nav = document.querySelector(".framer-2bq3am-container");
      const svg = nav ? nav.querySelector("svg") : null;
      return {
        svgRect: svg ? svg.getBoundingClientRect() : null,
        navRect: nav ? nav.getBoundingClientRect() : null,
      };
    });

    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);

    const scrolled = await page.evaluate(() => {
      const nav = document.querySelector(".framer-2bq3am-container");
      const svg = nav ? nav.querySelector("svg") : null;
      return {
        svgRect: svg ? svg.getBoundingClientRect() : null,
        navRect: nav ? nav.getBoundingClientRect() : null,
      };
    });

    console.log(`Viewport ${w}px:`);
    console.log("  Initial:", JSON.stringify(initial));
    console.log("  Scrolled:", JSON.stringify(scrolled));
    await page.close();
  }
  await browser.close();
}

main().catch(console.error);
