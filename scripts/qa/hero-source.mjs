// Captures the reference hero carousel code-component source + live behaviour samples.
// Usage: node scripts/qa/hero-source.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "https://patrickjane.framer.website/";
const OUT = path.resolve(".qa/hero");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const hits = [];
page.on("response", async (res) => {
  const url = res.url();
  if (!/\.m?js(\?|$)/.test(url)) return;
  try {
    const body = await res.text();
    if (/rotateX\(-?\$?\{?|translateZ\(/.test(body) && /cursor|grab/.test(body) && /backfaceVisibility|backface/.test(body)) {
      const name = url.split("/").pop().split("?")[0];
      fs.writeFileSync(path.join(OUT, `src-${name}`), body);
      hits.push({ url, len: body.length });
    }
  } catch {}
});
await page.goto(URL, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(4000);
console.log("HITS", JSON.stringify(hits, null, 1));
await browser.close();

