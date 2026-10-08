import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/aurexa-menu-study");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to https://aurexa.framer.website/...");
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // Take screenshot of navbar in initial state
  await page.screenshot({ path: path.join(outDir, "0-navbar-top.png") });

  // Find and click the MENU button
  console.log("Looking for MENU button...");
  const menuButton = await page.locator("text=MENU").first();
  await menuButton.click();
  console.log("MENU button clicked, waiting for menu animation...");
  await page.waitForTimeout(1000);

  // Screenshot open menu
  await page.screenshot({ path: path.join(outDir, "1-menu-open.png") });

  // Extract menu overlay DOM, styles, and animation details
  const menuData = await page.evaluate(() => {
    // Find all visible text elements or links in the menu overlay
    const links = Array.from(document.querySelectorAll("a, button, [role='button']"))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })
      .map(el => ({
        tag: el.tagName,
        text: el.innerText?.trim(),
        href: el.getAttribute("href"),
        className: el.className,
        rect: el.getBoundingClientRect(),
        style: {
          fontSize: window.getComputedStyle(el).fontSize,
          fontWeight: window.getComputedStyle(el).fontWeight,
          color: window.getComputedStyle(el).color,
          letterSpacing: window.getComputedStyle(el).letterSpacing,
          lineHeight: window.getComputedStyle(el).lineHeight,
        }
      }));

    // Find the overlay container
    const fixedContainers = Array.from(document.querySelectorAll("*")).filter(el => {
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (s.position === "fixed" || s.position === "absolute") &&
             r.width >= window.innerWidth * 0.8 &&
             r.height >= window.innerHeight * 0.8 &&
             parseFloat(s.opacity) > 0.5;
    }).map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      style: {
        background: window.getComputedStyle(el).backgroundColor,
        backdropFilter: window.getComputedStyle(el).backdropFilter,
        zIndex: window.getComputedStyle(el).zIndex,
        display: window.getComputedStyle(el).display,
      },
      htmlSnippet: el.outerHTML.slice(0, 1500)
    }));

    return { links, fixedContainers };
  });

  fs.writeFileSync(path.join(outDir, "menu-data.json"), JSON.stringify(menuData, null, 2));
  console.log("Menu data extracted. Links found:", menuData.links.length);

  // Hover over the first menu item to observe hover effect
  const firstNavLink = await page.locator("a:has-text('Work'), a:has-text('Studio'), a:has-text('Home'), a:has-text('Services')").first();
  if (firstNavLink) {
    console.log("Hovering first nav link...");
    await firstNavLink.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "2-menu-hover.png") });
  }

  // Click close button
  console.log("Looking for close button...");
  const closeBtn = await page.locator("text=CLOSE, text=MENU, svg, button").filter({ hasText: /close|menu/i }).first();
  if (closeBtn) {
    await closeBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, "3-menu-closed.png") });
  }

  await browser.close();
  console.log("Aurexa menu study complete!");
}

main().catch(console.error);
