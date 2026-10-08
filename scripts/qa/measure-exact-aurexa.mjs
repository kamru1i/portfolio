import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const scrollPositions = [0, 50, 100, 150, 200, 250, 280, 300, 350, 400];
  
  for (const pos of scrollPositions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    // wait 600ms for any transition animation to settle
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(() => {
      const nav = document.querySelector(".framer-2bq3am-container");
      const svg = nav ? nav.querySelector("svg") : null;
      const svgContainer = svg ? svg.parentElement : null;
      const logoLink = svgContainer ? svgContainer.parentElement : null;
      const headerRow = logoLink ? logoLink.parentElement : null;
      const navContainer = nav ? nav.children[0]?.children[0] : null; // Desktop wrapper
      const menuBackdrop = document.querySelector("[data-framer-name='Menu Container']");

      return {
        scrollY: window.scrollY,
        svgRect: svg ? svg.getBoundingClientRect() : null,
        linkRect: logoLink ? logoLink.getBoundingClientRect() : null,
        headerRowRect: headerRow ? headerRow.getBoundingClientRect() : null,
        navRect: nav ? nav.getBoundingClientRect() : null,
        navBg: nav ? window.getComputedStyle(nav).backgroundColor : null,
        headerRowStyles: headerRow ? {
          padding: window.getComputedStyle(headerRow).padding,
          margin: window.getComputedStyle(headerRow).margin,
          height: window.getComputedStyle(headerRow).height,
        } : null,
        backdropStyles: menuBackdrop ? {
          bg: window.getComputedStyle(menuBackdrop).backgroundColor,
          backdropFilter: window.getComputedStyle(menuBackdrop).backdropFilter,
          border: window.getComputedStyle(menuBackdrop).border,
          boxShadow: window.getComputedStyle(menuBackdrop).boxShadow,
        } : null,
      };
    });

    console.log(`Scroll ${pos}:`, JSON.stringify(metrics, null, 2));
  }

  // Now test scrolling back up to 0!
  console.log("\n--- Testing scrolling back up ---");
  const upPositions = [350, 250, 150, 50, 0];
  for (const pos of upPositions) {
    await page.evaluate((y) => window.scrollTo(0, y), pos);
    await page.waitForTimeout(600);
    const metrics = await page.evaluate(() => {
      const nav = document.querySelector(".framer-2bq3am-container");
      const svg = nav ? nav.querySelector("svg") : null;
      return {
        scrollY: window.scrollY,
        svgRect: svg ? svg.getBoundingClientRect() : null,
        navRect: nav ? nav.getBoundingClientRect() : null,
      };
    });
    console.log(`Scroll UP to ${pos}:`, JSON.stringify(metrics, null, 2));
  }

  await browser.close();
}

main().catch(console.error);
