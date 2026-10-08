import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

const details = await page.evaluate(() => {
  // 1. Inspect Loader component
  const loaderEl = document.querySelector(".framer-4z7xw, [data-framer-name='Closed'], [class*='1q1yh5y']");
  const loaderFiber = loaderEl ? Object.keys(loaderEl).find(k => k.startsWith("__reactFiber")) : null;
  let loaderSource = null;
  let loaderProps = null;
  if (loaderEl && loaderFiber) {
    let cur = loaderEl[loaderFiber];
    while (cur && !loaderSource) {
      if (typeof cur.type === "function") {
        loaderSource = cur.type.toString();
        loaderProps = cur.memoizedProps;
      }
      cur = cur.return;
    }
  }

  // 2. Inspect Hero Title code component
  const titleContainer = document.querySelector(".framer-ltfwj9-container, [data-code-component-plugin-id='84d4c1']");
  const titleFiber = titleContainer ? Object.keys(titleContainer).find(k => k.startsWith("__reactFiber")) : null;
  let titleSource = null;
  let titleProps = null;
  if (titleContainer && titleFiber) {
    let cur = titleContainer[titleFiber];
    while (cur && !titleSource) {
      if (typeof cur.type === "function" && cur.memoizedProps && Object.keys(cur.memoizedProps).length > 2) {
        titleSource = cur.type.toString();
        titleProps = cur.memoizedProps;
      }
      cur = cur.return;
    }
  }

  // 3. Inspect Grain: Check all elements with background styles, images, or canvas
  const bodyBg = window.getComputedStyle(document.body).background;
  const htmlBg = window.getComputedStyle(document.documentElement).background;
  
  // Find any element with canvas or image covering whole page
  const fixedElements = Array.from(document.querySelectorAll("*")).filter(el => {
    const cs = window.getComputedStyle(el);
    return (cs.position === "fixed" || cs.position === "absolute") &&
           (cs.width === "100%" || cs.width === "1440px" || parseInt(cs.width) > 1000) &&
           (cs.height === "100%" || cs.height === "900px" || parseInt(cs.height) > 800);
  }).map(el => ({
    tag: el.tagName,
    className: el.className,
    style: el.getAttribute("style"),
    bg: window.getComputedStyle(el).background,
    bgImage: window.getComputedStyle(el).backgroundImage,
    opacity: window.getComputedStyle(el).opacity,
    mixBlendMode: window.getComputedStyle(el).mixBlendMode,
    zIndex: window.getComputedStyle(el).zIndex,
    pointerEvents: window.getComputedStyle(el).pointerEvents,
  }));

  return {
    loader: {
      html: loaderEl ? loaderEl.outerHTML.slice(0, 2000) : null,
      props: loaderProps,
      source: loaderSource ? loaderSource.slice(0, 2500) : null,
    },
    title: {
      html: titleContainer ? titleContainer.outerHTML.slice(0, 2000) : null,
      props: titleProps,
      source: titleSource ? titleSource.slice(0, 2500) : null,
    },
    fixedElements,
  };
});

console.log("LOADER:", JSON.stringify(details.loader, null, 2));
console.log("TITLE:", JSON.stringify(details.title, null, 2));
console.log("FIXED ELEMENTS:", JSON.stringify(details.fixedElements, null, 2));

await browser.close();
