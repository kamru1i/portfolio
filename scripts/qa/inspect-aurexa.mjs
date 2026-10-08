import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/aurexa-study");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log("Launching browser to inspect https://aurexa.framer.website/...");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Take screenshot at scroll = 0
  await page.screenshot({ path: path.join(outDir, "0-scroll-0.png") });

  // Inspect the header / navbar DOM
  const navInspection = await page.evaluate(() => {
    // Look for fixed/sticky headers or navs
    const allElements = Array.from(document.querySelectorAll("*"));
    const fixedOrSticky = allElements.filter((el) => {
      const style = window.getComputedStyle(el);
      return style.position === "fixed" || style.position === "sticky";
    });

    const candidateNavs = fixedOrSticky.map((el) => ({
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      rect: el.getBoundingClientRect(),
      style: {
        position: window.getComputedStyle(el).position,
        top: window.getComputedStyle(el).top,
        height: window.getComputedStyle(el).height,
        padding: window.getComputedStyle(el).padding,
        background: window.getComputedStyle(el).backgroundColor,
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        border: window.getComputedStyle(el).border,
        boxShadow: window.getComputedStyle(el).boxShadow,
      },
      text: el.innerText.slice(0, 100),
    }));

    // Find any element containing "AUREXA" or the logo text
    const logoCandidates = allElements.filter((el) => {
      return (
        el.innerText &&
        el.innerText.trim().toUpperCase().includes("AUREXA") &&
        el.children.length === 0
      );
    }).map((el) => ({
      tagName: el.tagName,
      className: el.className,
      text: el.innerText,
      rect: el.getBoundingClientRect(),
      style: {
        fontSize: window.getComputedStyle(el).fontSize,
        fontWeight: window.getComputedStyle(el).fontWeight,
        letterSpacing: window.getComputedStyle(el).letterSpacing,
        lineHeight: window.getComputedStyle(el).lineHeight,
        transform: window.getComputedStyle(el).transform,
        color: window.getComputedStyle(el).color,
      },
    }));

    return { candidateNavs, logoCandidates };
  });

  console.log("Nav Candidates:", JSON.stringify(navInspection.candidateNavs, null, 2));
  console.log("Logo Candidates:", JSON.stringify(navInspection.logoCandidates, null, 2));

  // Now let's scroll step by step and track changes
  const scrollSteps = [50, 100, 150, 200, 300, 500, 800];
  const scrollLog = [];

  for (const y of scrollSteps) {
    await page.evaluate((scrollPos) => window.scrollTo(0, scrollPos), y);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, `scroll-${y}.png`) });

    const state = await page.evaluate((scrollPos) => {
      // Find the logo and nav at this scroll position
      const logo = Array.from(document.querySelectorAll("*")).find(
        (el) => el.innerText && el.innerText.trim().toUpperCase() === "AUREXA" && el.children.length === 0
      );

      // Find nav container
      let nav = null;
      if (logo) {
        let parent = logo.parentElement;
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          if (style.position === "fixed" || style.position === "sticky") {
            nav = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }

      return {
        scrollY: scrollPos,
        actualScrollY: window.scrollY,
        logo: logo
          ? {
              rect: logo.getBoundingClientRect(),
              fontSize: window.getComputedStyle(logo).fontSize,
              fontWeight: window.getComputedStyle(logo).fontWeight,
              transform: window.getComputedStyle(logo).transform,
              opacity: window.getComputedStyle(logo).opacity,
            }
          : null,
        nav: nav
          ? {
              rect: nav.getBoundingClientRect(),
              height: window.getComputedStyle(nav).height,
              padding: window.getComputedStyle(nav).padding,
              background: window.getComputedStyle(nav).backgroundColor,
              backdropFilter: window.getComputedStyle(nav).backdropFilter,
              boxShadow: window.getComputedStyle(nav).boxShadow,
              border: window.getComputedStyle(nav).border,
              transform: window.getComputedStyle(nav).transform,
            }
          : null,
      };
    }, y);

    scrollLog.push(state);
  }

  // Now test scroll back up
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "scroll-up-200.png") });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "scroll-up-0.png") });

  fs.writeFileSync(
    path.join(outDir, "aurexa-scroll-log.json"),
    JSON.stringify(scrollLog, null, 2)
  );

  await browser.close();
  console.log("Aurexa forensic analysis complete. Saved to .qa/aurexa-study");
}

main().catch(console.error);
