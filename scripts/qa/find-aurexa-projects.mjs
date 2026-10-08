import { chromium } from "playwright";
import * as fs from "fs";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  const result = await page.evaluate(() => {
    // Look for elements that mention "novaflow" or other project names
    const allLinks = Array.from(document.querySelectorAll("a")).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
    }));
    
    // Find the container parent of "Case studies"
    const heading = Array.from(document.querySelectorAll("h1,h2,h3,h4,div,p")).find(el => el.innerText && el.innerText.trim() === "Case studies");
    let section = heading;
    while (section && section.parentElement && !section.getAttribute('data-framer-name')?.includes('Section')) {
      section = section.parentElement;
    }

    let sectionInfo = null;
    if (section) {
      sectionInfo = {
        framerName: section.getAttribute('data-framer-name'),
        className: section.className,
        rect: section.getBoundingClientRect(),
        children: Array.from(section.children).map(c => ({
          framerName: c.getAttribute('data-framer-name'),
          className: c.className,
          text: c.innerText.trim().slice(0, 200).replace(/\n+/g, ' ')
        }))
      };
    }

    // Also look for all elements with href containing /projects/
    const projectLinks = Array.from(document.querySelectorAll('a[href*="/projects/"]')).map(a => {
      let card = a;
      // find nearest enclosing card container
      for (let i = 0; i < 5; i++) {
        if (card.parentElement && (card.parentElement.getAttribute('data-framer-name') || card.parentElement.className.includes('card') || card.parentElement.getBoundingClientRect().height > 200)) {
          card = card.parentElement;
        }
      }
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      return {
        href: a.href,
        linkText: a.innerText.trim(),
        cardName: card.getAttribute('data-framer-name'),
        cardText: card.innerText.trim().replace(/\n+/g, ' | '),
        rect: { width: rect.width, height: rect.height, top: rect.top + window.scrollY },
        borderRadius: style.borderRadius,
        border: style.border,
        background: style.backgroundColor
      };
    });

    return { allLinks: allLinks.filter(l => l.href.includes('project')), sectionInfo, projectLinks };
  });

  console.log("PROJECT DATA:", JSON.stringify(result, null, 2));

  // Let's also check if there's an actual /projects or /work page
  await page.goto("https://aurexa.framer.website/projects/novaflow", { waitUntil: "networkidle", timeout: 30000 });
  console.log("Novaflow page title:", await page.title());

  await browser.close();
}

main().catch(console.error);
