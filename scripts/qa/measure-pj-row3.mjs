import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

  const layout = await page.evaluate(() => {
    function getBox(text) {
      const el = Array.from(document.querySelectorAll("*")).find(
        (e) => e.children.length === 0 && e.textContent.trim() === text
      );
      if (!el) return null;
      let container = el;
      while (container && !container.querySelector("img") && container.parentElement) {
        container = container.parentElement;
      }
      const img = container ? container.querySelector("img") : null;
      return {
        text,
        tag: el.tagName,
        rect: el.getBoundingClientRect(),
        containerRect: container ? container.getBoundingClientRect() : null,
        imgRect: img ? img.getBoundingClientRect() : null,
      };
    }

    const card4 = getBox("Nocturne Heart");
    const card5 = getBox("Cutform Portraits");
    const exploreMore = Array.from(document.querySelectorAll("a, span, p, div")).find(
      (e) => e.textContent.trim() === "Explore More"
    );

    return {
      card4,
      card5,
      exploreMore: exploreMore ? {
        text: exploreMore.textContent.trim(),
        rect: exploreMore.getBoundingClientRect(),
        fontFamily: window.getComputedStyle(exploreMore).fontFamily,
        fontSize: window.getComputedStyle(exploreMore).fontSize,
      } : null,
      parentRow: card4?.containerRect && card5?.containerRect ? {
        topDiff: card5.containerRect.top - card4.containerRect.top,
        horizontalGap: card5.containerRect.left - card4.containerRect.right,
      } : null,
    };
  });

  console.log("PJ Row 3 details:", JSON.stringify(layout, null, 2));
  await browser.close();
}

main().catch(console.error);
