import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

const code = await page.evaluate(() => {
  // 1. Get Preloader component definition
  const loaderEl = document.querySelector(".framer-4z7xw");
  const loaderFiber = loaderEl ? Object.keys(loaderEl).find(k => k.startsWith("__reactFiber")) : null;
  let preloaderSource = null;
  let preloaderVariantDetails = null;

  if (loaderEl && loaderFiber) {
    let cur = loaderEl[loaderFiber];
    while (cur) {
      if (cur.type?.displayName === "Preloader" || (cur.memoizedProps && "animationType" in cur.memoizedProps)) {
        preloaderSource = cur.type.toString();
        preloaderVariantDetails = cur.memoizedProps;
        break;
      }
      cur = cur.return;
    }
  }

  // 2. Get Title Text Animation component definition
  const h1 = document.querySelector("h1");
  const h1Fiber = h1 ? Object.keys(h1).find(k => k.startsWith("__reactFiber")) : null;
  let titleComponentSource = null;
  let titleComponentProps = null;

  if (h1 && h1Fiber) {
    let cur = h1[h1Fiber];
    while (cur) {
      if (cur.memoizedProps && ("split" in cur.memoizedProps || "stagger" in cur.memoizedProps || "animationType" in cur.memoizedProps || "characterSpacing" in cur.memoizedProps)) {
        titleComponentSource = cur.type?.toString?.() || String(cur.type);
        titleComponentProps = cur.memoizedProps;
        break;
      }
      cur = cur.return;
    }
  }

  // 3. Inspect Subtitle animation attributes and styles
  const subtitle = document.querySelector("p");
  const subtitleParent = subtitle?.parentElement;
  const subtitleStyles = subtitle ? {
    text: subtitle.textContent,
    tag: subtitle.tagName,
    className: subtitle.className,
    style: subtitle.getAttribute("style"),
    cs: {
      opacity: window.getComputedStyle(subtitle).opacity,
      transform: window.getComputedStyle(subtitle).transform,
      transition: window.getComputedStyle(subtitle).transition,
      animation: window.getComputedStyle(subtitle).animation,
    },
    parentAttrs: subtitleParent ? Array.from(subtitleParent.attributes).map(a => `${a.name}="${a.value}"`) : [],
  } : null;

  return {
    preloaderVariantDetails,
    preloaderSource: preloaderSource ? preloaderSource.slice(0, 3000) : null,
    titleComponentProps,
    titleComponentSource: titleComponentSource ? titleComponentSource.slice(0, 3000) : null,
    subtitleStyles,
  };
});

console.log("PRELOADER DETAILS:", JSON.stringify(code.preloaderVariantDetails, null, 2));
console.log("TITLE DETAILS:", JSON.stringify(code.titleComponentProps, null, 2));
console.log("SUBTITLE DETAILS:", JSON.stringify(code.subtitleStyles, null, 2));
if (code.titleComponentSource) {
  console.log("TITLE SOURCE SNIPPET:", code.titleComponentSource.slice(0, 1000));
}

await browser.close();
