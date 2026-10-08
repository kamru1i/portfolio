import { chromium } from "playwright";
import fs from "fs";

async function inspectPJ() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Scroll to Selected Works
  const foundHeader = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("*")).find(
      (e) => e.children.length === 0 && (e.textContent || "").trim().toUpperCase() === "SELECTED WORKS"
    );
    if (el) {
      el.scrollIntoView();
      return true;
    }
    return false;
  });

  console.log("Found header on PJ:", foundHeader);
  await page.waitForTimeout(1000);

  // Screenshot 1: header and top rows
  await page.screenshot({ path: "scripts/qa/pj-selected-works-row1.png", fullPage: false });

  // Scroll down a bit for row 2 and 3
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/pj-selected-works-row2.png", fullPage: false });

  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/pj-selected-works-row3.png", fullPage: false });

  // Extract all details of cards
  const data = await page.evaluate(() => {
    const headerEl = Array.from(document.querySelectorAll("*")).find(
      (e) => e.children.length === 0 && (e.textContent || "").trim().toUpperCase() === "SELECTED WORKS"
    );

    // Find cards: all project link elements
    const projectLinks = Array.from(document.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") || "";
      return href.includes("projects") || href.includes("work");
    });

    return {
      header: headerEl ? {
        text: headerEl.textContent.trim(),
        tag: headerEl.tagName,
        rect: headerEl.getBoundingClientRect(),
        fontFamily: window.getComputedStyle(headerEl).fontFamily,
        fontSize: window.getComputedStyle(headerEl).fontSize,
        fontWeight: window.getComputedStyle(headerEl).fontWeight,
        color: window.getComputedStyle(headerEl).color,
      } : null,
      cards: projectLinks.map((card) => {
        const img = card.querySelector("img");
        const titleEl = card.querySelector("h2, h3, h4, p, span:not(:empty)");
        const cardStyle = window.getComputedStyle(card);
        const imgStyle = img ? window.getComputedStyle(img) : null;
        const imgParent = img?.parentElement ? window.getComputedStyle(img.parentElement) : null;
        const titleStyle = titleEl ? window.getComputedStyle(titleEl) : null;

        return {
          href: card.getAttribute("href"),
          text: (card.textContent || "").trim().replace(/\s+/g, " "),
          rect: card.getBoundingClientRect(),
          cardDisplay: cardStyle.display,
          imgParentRect: img?.parentElement ? img.parentElement.getBoundingClientRect() : null,
          imgParentOverflow: imgParent?.overflow,
          imgParentBorderRadius: imgParent?.borderRadius,
          imgParentAspectRatio: imgParent?.aspectRatio,
          imgObjectFit: imgStyle?.objectFit,
          titleFont: titleStyle ? {
            fontFamily: titleStyle.fontFamily,
            fontSize: titleStyle.fontSize,
            lineHeight: titleStyle.lineHeight,
            color: titleStyle.color,
            marginTop: titleStyle.marginTop,
            textDecoration: titleStyle.textDecoration,
          } : null,
        };
      }),
    };
  });

  fs.writeFileSync("scripts/qa/pj-live-data.json", JSON.stringify(data, null, 2));
  console.log("Successfully extracted PJ data:", JSON.stringify(data, null, 2));

  await browser.close();
}

inspectPJ().catch(console.error);
