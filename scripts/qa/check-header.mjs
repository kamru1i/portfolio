import { chromium } from "playwright";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await p.waitForTimeout(4000);

const checkNav = async (label) => {
  const data = await p.evaluate(() => {
    const nav = document.querySelector("nav");
    const fixed = [...document.querySelectorAll("*")].filter(
      (e) => getComputedStyle(e).position === "fixed"
    );
    const navContainer = fixed.find((f) => f.querySelector("nav"));
    return {
      scrollY: window.scrollY,
      navRect: nav ? nav.getBoundingClientRect() : null,
      containerTransform: navContainer ? getComputedStyle(navContainer).transform : null,
      containerTop: navContainer ? getComputedStyle(navContainer).top : null,
      containerY: navContainer ? navContainer.getBoundingClientRect().y : null,
      navOpacity: nav ? getComputedStyle(nav).opacity : null,
      navTransform: nav ? getComputedStyle(nav).transform : null,
    };
  });
  console.log(label, JSON.stringify(data));
};

await checkNav("At scroll 0:");
await p.evaluate(() => window.scrollTo(0, 500));
await p.waitForTimeout(800);
await checkNav("At scroll 500:");
await p.evaluate(() => window.scrollTo(0, 1500));
await p.waitForTimeout(800);
await checkNav("At scroll 1500:");
await p.evaluate(() => window.scrollTo(0, 1200));
await p.waitForTimeout(800);
await checkNav("At scroll 1200 (scrolled up):");
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(800);
await checkNav("Back at top:");

await b.close();
