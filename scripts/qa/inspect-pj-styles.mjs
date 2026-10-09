import { chromium } from "playwright";

async function inspectPJStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const heroDetails = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll("div, section, main"));
    const title = Array.from(document.querySelectorAll("*")).find(
      (el) => el.innerText?.trim() === "PATRICK JANE"
    );
    
    // Get all ancestors of title
    const ancestors = [];
    let cur = title?.parentElement;
    while (cur && cur !== document.body) {
      const cs = window.getComputedStyle(cur);
      ancestors.push({
        tag: cur.tagName,
        className: cur.className,
        display: cs.display,
        flexDirection: cs.flexDirection,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
        height: cs.height,
        minHeight: cs.minHeight,
        maxHeight: cs.maxHeight,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        position: cs.position,
        top: cs.top,
      });
      cur = cur.parentElement;
    }

    return ancestors;
  });

  console.log("Ancestors of Patrick Jane title:", JSON.stringify(heroDetails, null, 2));
  await browser.close();
}

inspectPJStyles().catch(console.error);
