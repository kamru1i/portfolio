import { chromium } from "playwright";
import fs from "fs";

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  
  console.log("=== INSPECTING PATRICK JANE ===");
  const pjPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await pjPage.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle", timeout: 30000 });
    await pjPage.waitForTimeout(2000);
    
    // Extract headings and sections
    const pjData = await pjPage.evaluate(() => {
      const headings = [];
      document.querySelectorAll("h1, h2, h3, h4, [data-framer-name*='Title'], [data-framer-name*='Heading']").forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          headings.push({
            text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 80),
            tag: el.tagName,
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            textTransform: cs.textTransform,
            color: cs.color,
            framerName: el.getAttribute("data-framer-name"),
          });
        }
      });
      
      // Look for section dividers / hair lines
      const sections = [];
      document.querySelectorAll("section, [data-framer-name*='Section']").forEach((sec) => {
        const cs = getComputedStyle(sec);
        sections.push({
          name: sec.getAttribute("data-framer-name") || sec.id || sec.className,
          text: sec.textContent.trim().slice(0, 100),
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
        });
      });

      return { headings, sections };
    });
    
    fs.writeFileSync("scripts/qa/pj-inspection.json", JSON.stringify(pjData, null, 2));
    console.log("Patrick Jane Headings:", pjData.headings);
  } catch (err) {
    console.error("Patrick Jane error:", err.message);
  } finally {
    await pjPage.close();
  }

  console.log("=== INSPECTING AUREXA ===");
  const axPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await axPage.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 30000 });
    await axPage.waitForTimeout(2000);
    
    // Find services section and explore interaction
    const axData = await axPage.evaluate(() => {
      // Find elements containing "SERVICES" or similar
      const elements = [];
      document.querySelectorAll("*").forEach((el) => {
        if (el.textContent && /SERVICES/i.test(el.textContent) && el.children.length < 5) {
          const cs = getComputedStyle(el);
          elements.push({
            tag: el.tagName,
            text: el.textContent.trim().slice(0, 100),
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            color: cs.color,
            framerName: el.getAttribute("data-framer-name"),
          });
        }
      });
      
      // Find subheadings / supporting text near services
      const subtitles = [];
      document.querySelectorAll("p, span, div").forEach((el) => {
        const text = el.textContent.trim();
        if (text.length > 30 && text.length < 300) {
          const cs = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            subtitles.push({
              text: text.slice(0, 100),
              fontFamily: cs.fontFamily,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
              color: cs.color,
              textAlign: cs.textAlign,
              framerName: el.getAttribute("data-framer-name"),
            });
          }
        }
      });

      // Find service rows
      const rows = [];
      document.querySelectorAll("[data-framer-name*='Row'], [data-framer-name*='Item'], [data-framer-name*='Service']").forEach((r) => {
        rows.push({
          name: r.getAttribute("data-framer-name"),
          text: r.textContent.trim().slice(0, 80),
          className: r.className,
        });
      });

      return { elements: elements.slice(0, 15), subtitles: subtitles.slice(0, 20), rows: rows.slice(0, 20) };
    });
    
    fs.writeFileSync("scripts/qa/ax-inspection.json", JSON.stringify(axData, null, 2));
    console.log("Aurexa inspection saved.");
  } catch (err) {
    console.error("Aurexa error:", err.message);
  } finally {
    await axPage.close();
  }
  
  await browser.close();
}

inspect().catch(console.error);
