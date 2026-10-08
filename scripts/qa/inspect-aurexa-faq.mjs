import { chromium } from "playwright";
import fs from "fs";

async function inspectFAQ() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  
  const data = await page.evaluate(async () => {
    // Find elements containing "FAQ" or "Have questions"
    let faqSection = null;
    document.querySelectorAll("section, div").forEach((el) => {
      if (el.textContent && /Have questions/i.test(el.textContent) && el.children.length > 1) {
        if (!faqSection || el.contains(faqSection)) {
          faqSection = el;
        }
      }
    });
    
    if (!faqSection) {
      // Fallback search
      faqSection = [...document.querySelectorAll("*")].find(e => /Check out the/i.test(e.textContent) && e.tagName !== "BODY" && e.tagName !== "HTML");
    }
    
    // Find the enclosing section container
    let container = faqSection;
    while (container && container.parentElement && container.parentElement.tagName !== "BODY" && container.parentElement.tagName !== "MAIN") {
      if (container.getAttribute("data-framer-name")?.includes("FAQ") || container.getAttribute("data-framer-name")?.includes("Section")) {
        break;
      }
      container = container.parentElement;
    }
    
    const cs = getComputedStyle(container || faqSection);
    
    // Find all question buttons / items
    const questionItems = [];
    document.querySelectorAll("[data-framer-name*='FAQ'], [data-framer-name*='Question'], [data-framer-name*='Accordion']").forEach((q) => {
      const qcs = getComputedStyle(q);
      questionItems.push({
        name: q.getAttribute("data-framer-name"),
        tag: q.tagName,
        text: q.textContent.trim().slice(0, 80),
        bg: qcs.backgroundColor,
        borderRadius: qcs.borderRadius,
        border: qcs.border,
        padding: qcs.padding,
        display: qcs.display,
        gap: qcs.gap,
      });
    });

    // Extract typography for FAQ title, subtitle, question, answer
    const textNodes = [];
    (container || document.body).querySelectorAll("*").forEach((el) => {
      const direct = [...el.childNodes].filter(c => c.nodeType === 3 && c.textContent.trim()).map(c => c.textContent.trim()).join(" ");
      if (/Have questions|Check out the|What support|We provide branding|Talk with/i.test(direct)) {
        const tcs = getComputedStyle(el);
        textNodes.push({
          text: direct.slice(0, 100),
          tag: el.tagName,
          fontFamily: tcs.fontFamily,
          fontSize: tcs.fontSize,
          fontWeight: tcs.fontWeight,
          lineHeight: tcs.lineHeight,
          letterSpacing: tcs.letterSpacing,
          color: tcs.color,
          name: el.getAttribute("data-framer-name"),
        });
      }
    });

    return {
      containerInfo: {
        name: container?.getAttribute("data-framer-name"),
        display: cs.display,
        gap: cs.gap,
        padding: cs.padding,
      },
      questionItems: questionItems.slice(0, 15),
      textNodes,
    };
  });
  
  fs.writeFileSync("scripts/qa/aurexa-faq-data.json", JSON.stringify(data, null, 2));
  console.log("FAQ Data Extracted:\n", JSON.stringify(data, null, 2));
  
  // Now scroll to FAQ and take screenshots of idle, hover, open, and multiple questions
  const faqLocator = page.locator("text=Have questions").first();
  if (await faqLocator.count() > 0) {
    await faqLocator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scripts/qa/aurexa-faq-idle.png" });
    
    // Find first question and hover
    const q1 = page.locator("text=What support do you provide").first();
    if (await q1.count() > 0) {
      await q1.hover();
      await page.waitForTimeout(400);
      await page.screenshot({ path: "scripts/qa/aurexa-faq-hover.png" });
      
      // Click question 1 (or closed question like "Who do you typically work with?")
      const q2 = page.locator("text=Who do you typically work with").first();
      if (await q2.count() > 0) {
        console.log("Clicking question 2...");
        await q2.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: "scripts/qa/aurexa-faq-opened-q2.png" });
        
        // Click question 3 to see if question 2 stays open or closes (single vs multiple open)
        const q3 = page.locator("text=How long does a project").first();
        if (await q3.count() > 0) {
          console.log("Clicking question 3...");
          await q3.click();
          await page.waitForTimeout(600);
          await page.screenshot({ path: "scripts/qa/aurexa-faq-opened-q3.png" });
        }
      }
    }
  }

  await browser.close();
}

inspectFAQ().catch(console.error);
