import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  
  await page.goto("https://aurexa.framer.website/", { waitUntil: "networkidle", timeout: 45000 });

  // Get all navigation links and all sections
  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a")).map(a => ({
      text: a.innerText.trim(),
      href: a.href,
    }));

    const sections = Array.from(document.querySelectorAll("[data-framer-name]")).map(el => ({
      framerName: el.getAttribute("data-framer-name"),
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      textSnippet: el.innerText ? el.innerText.trim().slice(0, 150).replace(/\n+/g, " ") : "",
    }));

    return { links, sections };
  });

  console.log("ALL LINKS:", JSON.stringify(data.links, null, 2));
  console.log("FRAMER SECTIONS:", JSON.stringify(data.sections.filter(s => s.framerName?.startsWith("Section") || s.framerName?.includes("Card") || s.framerName?.includes("Case")), null, 2));

  await browser.close();
}

main().catch(console.error);
