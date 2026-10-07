import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const scripts = [];
page.on("response", async (res) => {
  const url = res.url();
  if (url.includes(".js") || url.includes(".mjs")) {
    try {
      const text = await res.text();
      if (text.includes("rotateX") || text.includes("preserve-3d") || text.includes("cursor:grab") || text.includes("cursor: grab") || text.includes("translateZ") || text.includes("rotateY")) {
        scripts.push({ url, length: text.length, text });
      }
    } catch {}
  }
});

await page.goto("https://patrickjane.framer.website/", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

console.log("Matched scripts:", scripts.length);
for (const s of scripts) {
  console.log("Script:", s.url);
  // find where translateZ or rotateY or cylinder is used
  const i = s.text.indexOf("rotateX");
  if (i !== -1) {
    console.log("rotateX snippet in " + s.url + ":");
    console.log(s.text.slice(Math.max(0, i - 500), Math.min(s.text.length, i + 1500)));
  }
}

await browser.close();
