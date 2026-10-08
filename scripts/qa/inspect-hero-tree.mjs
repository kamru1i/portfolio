import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  const heroTree = await page.evaluate(() => {
    const h1 = Array.from(document.querySelectorAll("h1")).find(h => {
      const b = h.getBoundingClientRect();
      return b.top >= 0 && b.top < 400;
    });
    if (!h1) return null;

    const ancestors = [];
    let cur = h1;
    while (cur && cur !== document.body) {
      const b = cur.getBoundingClientRect();
      const s = window.getComputedStyle(cur);
      ancestors.push({
        tag: cur.tagName,
        className: cur.className,
        id: cur.id,
        box: { top: b.top, bottom: b.bottom, height: b.height, width: b.width },
        style: {
          display: s.display,
          flexDirection: s.flexDirection,
          justifyContent: s.justifyContent,
          alignItems: s.alignItems,
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          gap: s.gap,
          minHeight: s.minHeight,
          height: s.height,
        }
      });
      cur = cur.parentElement;
    }

    const nav = document.querySelector("nav") || document.querySelector("header");
    const navBox = nav ? nav.getBoundingClientRect() : null;

    return {
      navBox,
      h1Box: h1.getBoundingClientRect(),
      ancestors
    };
  });

  console.log("HERO TREE HIERARCHY:\n", JSON.stringify(heroTree, null, 2));
  await browser.close();
}

main().catch(console.error);
