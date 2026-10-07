import { chromium } from "playwright";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await p.waitForTimeout(4000);

const details = await p.evaluate(() => {
  // 1. Hero cylinder
  const cylinderContainer = document.querySelector('[style*="perspective"]');
  const cylinderCards = cylinderContainer ? [...cylinderContainer.querySelectorAll('[style*="translateZ"]')] : [];
  const cardDetails = cylinderCards.map((c) => ({
    style: c.getAttribute("style"),
    bgImg: getComputedStyle(c.querySelector('[style*="background-image"]') || c).backgroundImage,
    rect: c.getBoundingClientRect(),
    parentStyle: c.parentElement?.getAttribute("style"),
  }));

  // 2. Selected Works layout
  const workSection = document.querySelector('[data-framer-name="Work section"]') || 
    document.querySelector('#works') ||
    [...document.querySelectorAll('section,div')].find(e => /Selected Works/.test(e.textContent) && e.getBoundingClientRect().height > 1000);
  
  const workImages = workSection ? [...workSection.querySelectorAll('img')].map(img => ({
    src: img.src,
    rect: img.getBoundingClientRect(),
    parentRect: img.parentElement?.getBoundingClientRect(),
    grandParentRect: img.parentElement?.parentElement?.getBoundingClientRect(),
    title: img.closest('a,div')?.textContent?.trim()?.slice(0, 50),
    style: img.getAttribute('style'),
    parentStyle: img.parentElement?.getAttribute('style'),
  })) : [];

  // 3. Statement / Manifesto
  const manifestoSection = [...document.querySelectorAll('section,div')].find(e => /I design digital/.test(e.textContent) && e.getBoundingClientRect().height > 500);
  const manifestoText = manifestoSection ? manifestoSection.querySelector('h2,p,h1') : null;
  const portraitImg = manifestoSection ? manifestoSection.querySelector('img') : null;
  const portraitWrapper = portraitImg ? portraitImg.closest('[style*="mask"], [style*="border-radius"], div') : null;

  // 4. Services hover / cursor
  const serviceSection = document.querySelector('[data-framer-name="Service section"]') ||
    [...document.querySelectorAll('section,div')].find(e => /EXPERTISE & SERVICES/.test(e.textContent) && e.getBoundingClientRect().height > 300);
  const serviceRows = serviceSection ? [...serviceSection.querySelectorAll('[data-framer-cursor]')].map(r => ({
    cursorId: r.getAttribute('data-framer-cursor'),
    text: r.textContent?.trim(),
    rect: r.getBoundingClientRect(),
    computedH: getComputedStyle(r).height,
  })) : [];

  // Check custom cursors in DOM
  const cursors = [...document.querySelectorAll('[id*="cursor"], [class*="cursor"], [data-framer-name*="Cursor"]')].map(c => ({
    tag: c.tagName,
    html: c.outerHTML.slice(0, 300),
    style: c.getAttribute('style'),
  }));

  // 5. Awards & Counters
  const awardsSection = document.querySelector('[data-framer-name="Awards section"]') ||
    [...document.querySelectorAll('section,div')].find(e => /Awards & Recognitions/.test(e.textContent) && e.getBoundingClientRect().height > 500);
  
  // 6. Footer structure
  const footer = document.querySelector('[data-framer-name="Footer"]');
  const footerCanvas = footer ? footer.querySelector('canvas') : null;
  const footerWordmark = footer ? [...footer.querySelectorAll('h1,h2,div')].find(e => /PATRICK JANE/.test(e.textContent)) : null;

  return {
    heroCylinder: {
      containerStyle: cylinderContainer?.getAttribute("style"),
      parentRect: cylinderContainer?.getBoundingClientRect(),
      cardsCount: cylinderCards.length,
      cardDetails: cardDetails.slice(0, 5),
    },
    workSection: {
      rect: workSection?.getBoundingClientRect(),
      images: workImages,
    },
    manifesto: {
      portraitStyle: portraitWrapper?.getAttribute('style'),
      portraitRect: portraitWrapper?.getBoundingClientRect(),
      portraitImgSrc: portraitImg?.src,
    },
    services: {
      rows: serviceRows,
      cursors,
    },
    footer: {
      rect: footer?.getBoundingClientRect(),
      hasCanvas: !!footerCanvas,
      canvasRect: footerCanvas?.getBoundingClientRect(),
      canvasParentHtml: footerCanvas?.parentElement?.parentElement?.outerHTML?.slice(0, 500),
      wordmarkHtml: footerWordmark?.outerHTML?.slice(0, 500),
    }
  };
});

console.log(JSON.stringify(details, null, 2));
await b.close();
