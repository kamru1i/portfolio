import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle" });

  const sec = page.locator('[data-framer-name="Section - Projects"]');
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await sec.screenshot({ path: "scripts/qa/aurexa-exact-projects-section.png" });

  const info = await sec.evaluate(el => {
    // Collect all children and their roles
    const rect = el.getBoundingClientRect();
    const children = Array.from(el.children).map(c => {
      const cRect = c.getBoundingClientRect();
      return {
        tag: c.tagName,
        className: c.className,
        rect: { width: cRect.width, height: cRect.height, top: cRect.top, left: cRect.left },
        framerName: c.getAttribute('data-framer-name'),
        computed: {
          display: window.getComputedStyle(c).display,
          position: window.getComputedStyle(c).position,
          flexDirection: window.getComputedStyle(c).flexDirection,
          gridTemplateColumns: window.getComputedStyle(c).gridTemplateColumns,
        }
      };
    });

    // Also find all cards inside this section
    const cards = Array.from(el.querySelectorAll('a')).filter(a => a.querySelector('img'));
    const cardsInfo = cards.slice(0, 6).map(c => {
      const img = c.querySelector('img');
      const title = c.innerText.split('\n')[0];
      const cRect = c.getBoundingClientRect();
      return {
        title,
        fullText: c.innerText,
        imgSrc: img ? img.src : null,
        rect: { width: Math.round(cRect.width), height: Math.round(cRect.height) },
        borderRadius: window.getComputedStyle(c).borderRadius,
      };
    });

    // Find the right sticky element
    const rightSide = Array.from(el.querySelectorAll('*')).find(node => {
      return node.textContent.includes('Case studies') && node.textContent.includes('A collection of strategic design projects');
    });

    let rightSideInfo = null;
    if (rightSide) {
      let stickyNode = rightSide;
      while (stickyNode && window.getComputedStyle(stickyNode).position !== 'sticky' && stickyNode.parentElement !== el) {
        if (window.getComputedStyle(stickyNode.parentElement).position === 'sticky') {
          stickyNode = stickyNode.parentElement;
          break;
        }
        stickyNode = stickyNode.parentElement;
      }
      rightSideInfo = {
        text: rightSide.innerText,
        tag: stickyNode.tagName,
        position: window.getComputedStyle(stickyNode).position,
        top: window.getComputedStyle(stickyNode).top,
        width: window.getComputedStyle(stickyNode).width,
      };
    }

    return {
      sectionRect: { width: rect.width, height: rect.height },
      children,
      cardsInfo,
      rightSideInfo,
    };
  });

  console.log("Section - Projects detailed info:", JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(console.error);
