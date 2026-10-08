import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log("Navigating to https://patrickjane.framer.website/ ...");
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4500); // Wait for full intro completion

  const data = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    
    // Subtitle paragraph: closest paragraph to h1
    const p = document.querySelector("p");

    // Find all elements with perspective or 3D transform
    const all = Array.from(document.querySelectorAll("*"));
    const cylinderCandidate = all.find(el => {
      const s = window.getComputedStyle(el);
      return s.perspective && s.perspective !== "none";
    });

    // Traverse upwards from h1 to find the hero section wrapper
    let heroWrapper = h1 ? h1.parentElement : null;
    while (heroWrapper && heroWrapper.tagName !== "MAIN" && heroWrapper.tagName !== "BODY" && heroWrapper.clientHeight < 1200) {
      if (heroWrapper.parentElement && (heroWrapper.parentElement.tagName === "BODY" || heroWrapper.parentElement.tagName === "MAIN")) {
        break;
      }
      heroWrapper = heroWrapper.parentElement;
    }

    const box = (el) => el ? el.getBoundingClientRect() : null;
    const computed = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        flexDirection: s.flexDirection,
        justifyContent: s.justifyContent,
        alignItems: s.alignItems,
        gap: s.gap,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        paddingLeft: s.paddingLeft,
        paddingRight: s.paddingRight,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        height: s.height,
        minHeight: s.minHeight,
        maxHeight: s.maxHeight,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        maxWidth: s.maxWidth,
      };
    };

    return {
      window: { width: window.innerWidth, height: window.innerHeight },
      h1: {
        text: h1?.innerText,
        box: box(h1),
        computed: computed(h1),
      },
      p: {
        text: p?.innerText,
        box: box(p),
        computed: computed(p),
      },
      cylinder: {
        box: box(cylinderCandidate),
        computed: computed(cylinderCandidate),
      },
      heroWrapper: {
        box: box(heroWrapper),
        computed: computed(heroWrapper),
        tag: heroWrapper?.tagName,
        className: heroWrapper?.className,
      }
    };
  });

  console.log("REF EXACT METRICS:\n", JSON.stringify(data, null, 2));

  // Also take a screenshot of reference hero at 1440x900
  await page.screenshot({ path: ".qa/hero-test/reference-hero-live-1440.png" });
  console.log("Saved .qa/hero-test/reference-hero-live-1440.png");

  await browser.close();
}

main().catch(console.error);
