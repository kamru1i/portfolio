import { chromium } from "playwright";

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // About image inspection
  const aboutInfo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.map((img) => ({
      src: img.src,
      alt: img.alt,
      width: img.offsetWidth,
      height: img.offsetHeight,
      filter: window.getComputedStyle(img).filter,
      borderRadius: window.getComputedStyle(img).borderRadius,
      parentBg: img.parentElement ? window.getComputedStyle(img.parentElement).backgroundColor : "",
      parentBorder: img.parentElement ? window.getComputedStyle(img.parentElement).border : "",
    }));
  });
  console.log("Images found:", JSON.stringify(aboutInfo, null, 2));

  // Footer inspection
  const footerInfo = await page.evaluate(() => {
    // Find bottom elements or footer
    const allDivs = Array.from(document.querySelectorAll("div, footer, section"));
    const footerCandidate = document.querySelector("footer") || allDivs.find(el => el.innerText && el.innerText.includes("PATRICK JANE") && el.innerText.includes("©"));
    if (!footerCandidate) return "Not found";
    return {
      innerText: footerCandidate.innerText,
      tag: footerCandidate.tagName,
      className: footerCandidate.className,
      style: {
        backgroundColor: window.getComputedStyle(footerCandidate).backgroundColor,
        padding: window.getComputedStyle(footerCandidate).padding,
      }
    };
  });
  console.log("Footer Info:", JSON.stringify(footerInfo, null, 2));

  // Also take a screenshot of footer in Patrick Jane
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/pj-footer-live.png" });

  // Take screenshot of About section
  const aboutElem = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("*")).find(e => e.innerText && e.innerText.includes("Outside of work") || (e.innerText && e.innerText.includes("I craft digital media")));
    if (el) {
      el.scrollIntoView();
      return true;
    }
    return false;
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/pj-about-live.png" });

  await browser.close();
}

inspect().catch(console.error);
