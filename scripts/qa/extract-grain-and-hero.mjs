import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });

const analysis = await page.evaluate(() => {
  // 1. Find Grain / Noise
  // Check body, html, and background styles, svg filters, or canvas
  const bodyStyles = window.getComputedStyle(document.body);
  const htmlStyles = window.getComputedStyle(document.documentElement);
  
  // Find all SVGs, canvas, or pseudo-elements
  const svgFilters = Array.from(document.querySelectorAll("svg filter")).map(f => ({
    id: f.id,
    innerHTML: f.innerHTML,
  }));

  // Check elements with background-image containing noise or grain or svg
  const allElements = Array.from(document.querySelectorAll("*"));
  const grainElements = allElements.filter(el => {
    const bg = window.getComputedStyle(el).backgroundImage;
    return bg && (bg.includes("noise") || bg.includes("grain") || bg.includes("data:image/svg"));
  }).map(el => ({
    tag: el.tagName,
    className: el.className,
    style: el.getAttribute("style"),
    bg: window.getComputedStyle(el).backgroundImage,
    opacity: window.getComputedStyle(el).opacity,
    pointerEvents: window.getComputedStyle(el).pointerEvents,
    position: window.getComputedStyle(el).position,
    zIndex: window.getComputedStyle(el).zIndex,
  }));

  // 2. Find Hero Title and its appear animation attributes
  const h1 = document.querySelector("h1");
  const h1Parent = h1?.parentElement;
  const h1Container = h1Parent?.parentElement;

  const getFramerAppearData = (el) => {
    if (!el) return null;
    const attrs = {};
    for (const attr of el.attributes) {
      if (attr.name.startsWith("data-framer") || attr.name.startsWith("data-")) {
        attrs[attr.name] = attr.value;
      }
    }
    const cs = window.getComputedStyle(el);
    return {
      tag: el.tagName,
      className: el.className,
      attrs,
      style: el.getAttribute("style"),
      transform: cs.transform,
      opacity: cs.opacity,
      animation: cs.animation,
      transition: cs.transition,
    };
  };

  // Find all elements with data-framer-appear-id
  const appearElements = allElements
    .filter(el => el.hasAttribute("data-framer-appear-id") || el.hasAttribute("data-framer-name"))
    .map(el => ({
      name: el.getAttribute("data-framer-name"),
      appearId: el.getAttribute("data-framer-appear-id"),
      tag: el.tagName,
      className: el.className,
      text: el.textContent?.slice(0, 40),
    }));

  return {
    grainElements,
    svgFilters,
    h1: getFramerAppearData(h1),
    h1Parent: getFramerAppearData(h1Parent),
    h1Container: getFramerAppearData(h1Container),
    appearElements: appearElements.slice(0, 30),
  };
});

console.log("GRAIN AND HERO ANALYSIS:", JSON.stringify(analysis, null, 2));

await browser.close();
