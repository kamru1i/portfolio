import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const logoSelector = await page.evaluate(() => {
    const nav = document.querySelector(".framer-2bq3am-container");
    if (!nav) return "Nav not found";

    // Find all links or svgs in nav
    const svgs = Array.from(nav.querySelectorAll("svg"));
    return svgs.map(s => ({
      outerHTML: s.outerHTML.slice(0, 150),
      parentClass: s.parentElement?.className,
      rect: s.getBoundingClientRect(),
      attributes: Array.from(s.attributes).map(a => `${a.name}="${a.value}"`)
    }));
  });

  console.log("Nav SVGs:", JSON.stringify(logoSelector, null, 2));

  await browser.close();
}

main().catch(console.error);
