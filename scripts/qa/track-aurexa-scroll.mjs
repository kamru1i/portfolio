import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const points = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 250, 300, 400];
  const results = [];

  for (const y of points) {
    await page.evaluate((sc) => window.scrollTo(0, sc), y);
    await page.waitForTimeout(150); // wait for frame

    const data = await page.evaluate((sc) => {
      // Find the logo link / svg
      const svg = document.querySelector(".framer-1xjxk5y svg, svg.svgContainer, .framer-1wwspmo svg") ||
                  document.querySelector("svg use")?.parentElement;
      const navHeader = document.querySelector(".framer-2bq3am-container");
      const desktopVariant = document.querySelector("[data-framer-name='Desktop']");
      const menuContainer = document.querySelector("[data-framer-name='Menu Container']");
      const rightItems = document.querySelector(".framer-1lbn8h1")?.children[1];

      return {
        scrollY: sc,
        actualY: window.scrollY,
        desktopClasses: desktopVariant?.className,
        logo: svg ? {
          rect: svg.getBoundingClientRect(),
          styleWidth: window.getComputedStyle(svg).width,
          styleHeight: window.getComputedStyle(svg).height,
          transform: window.getComputedStyle(svg).transform,
        } : null,
        nav: navHeader ? {
          rect: navHeader.getBoundingClientRect(),
          height: window.getComputedStyle(navHeader).height,
          padding: window.getComputedStyle(navHeader).padding,
          bg: window.getComputedStyle(navHeader).backgroundColor,
        } : null,
        desktop: desktopVariant ? {
          height: window.getComputedStyle(desktopVariant).height,
          padding: window.getComputedStyle(desktopVariant).padding,
          bg: window.getComputedStyle(desktopVariant).backgroundColor,
          backdropFilter: window.getComputedStyle(desktopVariant).backdropFilter,
        } : null,
        menuContainer: menuContainer ? {
          bg: window.getComputedStyle(menuContainer).backgroundColor,
          backdropFilter: window.getComputedStyle(menuContainer).backdropFilter,
          border: window.getComputedStyle(menuContainer).border,
          boxShadow: window.getComputedStyle(menuContainer).boxShadow,
          opacity: window.getComputedStyle(menuContainer).opacity,
          rect: menuContainer.getBoundingClientRect(),
        } : null
      };
    }, y);

    results.push(data);
  }

  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

main().catch(console.error);
