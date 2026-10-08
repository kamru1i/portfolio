import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Look at the top 200px of the page
    const topElements = Array.from(document.querySelectorAll("*")).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < 150 && rect.width > 20 && rect.height > 20;
    });

    // Let's find the logo specifically
    const logoEl = document.querySelector('svg[data-framer-name="Aurexa Logo"]') ||
      Array.from(document.querySelectorAll("svg, img, a, div")).find(el => {
        return (el.getAttribute("aria-label")?.includes("Aurexa") ||
                el.innerHTML?.includes("AUREXA") ||
                el.className?.includes("logo"));
      });

    // Find the header/navbar component container
    const navContainer = Array.from(document.querySelectorAll("header, nav, [data-framer-name*='Nav'], [data-framer-name*='Header']"));

    // Let's get the exact tree of the top fixed/sticky elements
    const fixedElements = Array.from(document.querySelectorAll("*")).filter(el => {
      const pos = window.getComputedStyle(el).position;
      return pos === "fixed" || pos === "sticky";
    }).map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      dataset: { ...el.dataset },
      style: {
        position: window.getComputedStyle(el).position,
        top: window.getComputedStyle(el).top,
        height: window.getComputedStyle(el).height,
        width: window.getComputedStyle(el).width,
        padding: window.getComputedStyle(el).padding,
        background: window.getComputedStyle(el).backgroundColor,
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        border: window.getComputedStyle(el).border,
        boxShadow: window.getComputedStyle(el).boxShadow,
      },
      htmlSnippet: el.outerHTML.slice(0, 500)
    }));

    return {
      fixedElements,
      navContainer: navContainer.map(el => ({
        tag: el.tagName,
        dataset: { ...el.dataset },
        className: el.className,
        rect: el.getBoundingClientRect()
      }))
    };
  });

  console.log("Deep analysis:", JSON.stringify(data, null, 2));

  await browser.close();
}

main().catch(console.error);
