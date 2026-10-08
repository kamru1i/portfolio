import { chromium } from "playwright";
import fs from "fs";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // Look for fixed elements
  const info = await page.evaluate(() => {
    // Find all fixed elements
    const fixed = Array.from(document.querySelectorAll("*")).filter((el) => {
      const s = window.getComputedStyle(el);
      return s.position === "fixed";
    });

    return fixed.map((el) => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      style: {
        position: window.getComputedStyle(el).position,
        top: window.getComputedStyle(el).top,
        left: window.getComputedStyle(el).left,
        width: window.getComputedStyle(el).width,
        height: window.getComputedStyle(el).height,
        backgroundColor: window.getComputedStyle(el).backgroundColor,
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        border: window.getComputedStyle(el).border,
      },
      html: el.outerHTML.slice(0, 1000),
    }));
  });

  console.log("Fixed elements:", JSON.stringify(info, null, 2));

  // Now inspect the exact element containing the logo at top-left
  const headerDetails = await page.evaluate(() => {
    // Top-left element at (x=60, y=30)
    const elAtPoint = document.elementFromPoint(80, 50);
    let current = elAtPoint;
    const chain = [];
    while (current && current !== document.body) {
      chain.push({
        tag: current.tagName,
        className: current.className,
        rect: current.getBoundingClientRect(),
        style: {
          width: window.getComputedStyle(current).width,
          height: window.getComputedStyle(current).height,
          transform: window.getComputedStyle(current).transform,
          transition: window.getComputedStyle(current).transition,
          display: window.getComputedStyle(current).display,
          alignItems: window.getComputedStyle(current).alignItems,
          justifyContent: window.getComputedStyle(current).justifyContent,
        }
      });
      current = current.parentElement;
    }
    return { elAtPoint: elAtPoint?.outerHTML.slice(0, 300), chain };
  });

  console.log("Header element hierarchy at (80, 50):", JSON.stringify(headerDetails, null, 2));

  await browser.close();
}

main().catch(console.error);
