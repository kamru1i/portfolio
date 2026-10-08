import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const svgDetails = await page.evaluate(() => {
    const symbol = document.querySelector("#svg1394321201_5346") ||
                   document.querySelector("svg symbol") ||
                   document.querySelector("defs symbol");

    const allSymbols = Array.from(document.querySelectorAll("symbol, defs svg, svg[id]")).map(s => ({
      id: s.id,
      outerHTML: s.outerHTML.slice(0, 1000)
    }));

    // Also get the outer HTML of the logo container
    const logoLink = document.querySelector(".framer-1xjxk5y") || document.querySelector("svg use")?.closest("a");

    return {
      symbolHTML: symbol ? symbol.outerHTML : "Not found",
      allSymbols,
      logoLinkHTML: logoLink ? logoLink.outerHTML : "Not found"
    };
  });

  console.log("SVG Symbol:", svgDetails.symbolHTML);
  console.log("All Symbols:", JSON.stringify(svgDetails.allSymbols, null, 2));
  console.log("Logo Link HTML:", svgDetails.logoLinkHTML);

  await browser.close();
}

main().catch(console.error);
