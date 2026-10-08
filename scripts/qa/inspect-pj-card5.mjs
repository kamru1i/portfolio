import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  
  const result = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h4, h3, h2, a, div"));
    const h = headings.find(el => el.textContent.trim() === "Cutform Portraits");
    if (!h) return { found: false };
    
    // Find parent container
    let container = h.parentElement;
    while (container && !container.querySelector("img")) {
      container = container.parentElement;
    }
    const img = container ? container.querySelector("img") : null;
    const mediaContainer = img ? img.parentElement : null;

    return {
      found: true,
      headingTag: h.tagName,
      headingFont: window.getComputedStyle(h).fontFamily,
      headingSize: window.getComputedStyle(h).fontSize,
      mediaContainerRect: mediaContainer ? mediaContainer.getBoundingClientRect() : null,
      mediaContainerOverflow: mediaContainer ? window.getComputedStyle(mediaContainer).overflow : null,
      imgSrc: img ? img.src : null,
      imgStyles: img ? {
        objectFit: window.getComputedStyle(img).objectFit,
        width: window.getComputedStyle(img).width,
        height: window.getComputedStyle(img).height,
        transform: window.getComputedStyle(img).transform,
      } : null,
    };
  });

  console.log("Card 5 inspection:", JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch(console.error);
