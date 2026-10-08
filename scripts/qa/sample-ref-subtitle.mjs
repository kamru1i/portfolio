import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const frames = [];
  page.on("framenavigated", () => console.log("Navigated"));

  await page.goto("https://patrickjane.framer.website/", { waitUntil: "commit" });

  const start = Date.now();
  for (let i = 0; i < 40; i++) {
    const elapsed = Date.now() - start;
    const data = await page.evaluate(() => {
      const p = document.querySelector("p");
      if (!p) return null;
      return {
        html: p.innerHTML,
        text: p.innerText,
        opacity: window.getComputedStyle(p).opacity,
      };
    });
    if (data && data.text) {
      frames.push({ elapsed, text: data.text, html: data.html.substring(0, 100) });
    }
    await page.waitForTimeout(60);
  }

  console.log("RECORDED FRAMES:", JSON.stringify(frames.slice(0, 15), null, 2));
  await browser.close();
}

main().catch(console.error);
