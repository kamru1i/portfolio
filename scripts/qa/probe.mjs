// Targeted interaction probe: intro timeline, carousel speed, hovers, header, counters, footer.
// Usage: node scripts/qa/probe.mjs [url] [outDir]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = process.argv[2] || "https://patrickjane.framer.website/";
const OUT = path.resolve(process.argv[3] || ".qa/probe");
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];
const note = (k, v) => { log.push(`## ${k}\n${typeof v === "string" ? v : JSON.stringify(v, null, 1)}`); };
const HIDE_BADGE = `#__framer-badge-container,[data-framer-name="Get Template"]{display:none!important}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// 1. Intro timeline from commit
const t0 = Date.now();
await page.goto(URL, { waitUntil: "commit", timeout: 90000 });
const tCommit = Date.now() - t0;
let i = 0;
while (Date.now() - t0 < tCommit + 5200) {
  const t = Date.now() - t0 - tCommit;
  try { await page.screenshot({ path: path.join(OUT, `intro-${String(i++).padStart(2, "0")}-${t}.png`), timeout: 3000 }); } catch {}
  await sleep(60);
}
note("commit ms", tCommit);
await page.waitForLoadState("networkidle").catch(() => {});
await page.addStyleTag({ content: HIDE_BADGE });

// 2. DOM structure snippets
const snippets = await page.evaluate(() => {
  const trim = (el, n = 2500) => (el ? el.outerHTML.replace(/\s+/g, " ").slice(0, n) : null);
  const canvas = document.querySelector("canvas");
  const fixed = [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed");
  const h1 = [...document.querySelectorAll("h1,h2,p")].find((e) => /PATRICK JANE/.test(e.textContent) && getComputedStyle(e).fontSize === "180px");
  const stmt = [...document.querySelectorAll("p,h2,h3")].find((e) => /I design digital/.test(e.textContent));
  return {
    canvasParent: trim(canvas?.parentElement?.parentElement?.parentElement, 1500),
    canvasSize: canvas ? { w: canvas.width, h: canvas.height, rect: canvas.getBoundingClientRect().toJSON() } : null,
    heroName: trim(h1?.parentElement, 1500),
    header: trim(fixed[0], 3000),
    footer: trim(fixed[1], 4000),
    statement: trim(stmt?.parentElement?.parentElement, 3000),
    closed: trim(document.querySelector('[data-framer-name="Closed"]'), 2500),
  };
});
for (const [k, v] of Object.entries(snippets)) note(k, v);

// 3. Carousel rotation speed
const rot = async () => page.evaluate(() => {
  const el = [...document.querySelectorAll("[style]")].find((e) => /translateZ\(-\d/.test(e.getAttribute("style")));
  return el ? el.style.transform : null;
});
const r1 = await rot(); await sleep(1000); const r2 = await rot(); await sleep(1000); const r3 = await rot();
note("carousel rotate samples 1s apart", [r1, r2, r3]);

// 4. Header behaviour on scroll down / up
const headerY = () => page.evaluate(() => {
  const el = [...document.querySelectorAll("body *")].find((e) => getComputedStyle(e).position === "fixed");
  const kid = el?.firstElementChild;
  return { rect: el?.getBoundingClientRect().toJSON(), tf: el && getComputedStyle(el).transform, kidTf: kid && getComputedStyle(kid).transform, kidRect: kid?.getBoundingClientRect().toJSON() };
});
note("header @0", await headerY());
await page.mouse.wheel(0, 600); await sleep(900);
note("header after wheel down 600", await headerY());
await page.screenshot({ path: path.join(OUT, "header-down.png"), clip: { x: 0, y: 0, width: 1440, height: 120 } });
await page.mouse.wheel(0, -200); await sleep(900);
note("header after wheel up 200", await headerY());
await page.screenshot({ path: path.join(OUT, "header-up.png"), clip: { x: 0, y: 0, width: 1440, height: 120 } });
await page.mouse.wheel(0, -2000); await sleep(1200);
note("header back at top", await headerY());

// 5. Scroll-in reveal timing for "Selected Works" heading
await page.evaluate(() => window.scrollTo(0, 500));
const sw = [];
const tS = Date.now();
while (Date.now() - tS < 1800) {
  sw.push(await page.evaluate(() => {
    const e = [...document.querySelectorAll("[style]")].find((x) => /translateX\(/.test(x.getAttribute("style") || "") && /Selected Works/.test(x.textContent));
    const h = [...document.querySelectorAll("h2,p")].find((x) => x.textContent.trim() === "Selected Works");
    let n = h; let s = "";
    for (let k = 0; k < 5 && n; k++, n = n.parentElement) { const cs = getComputedStyle(n); if (cs.transform !== "none" || cs.opacity !== "1") { s = `${cs.opacity} ${cs.transform}`; break; } }
    return s;
  }).then((s) => `${Date.now() - tS}ms ${s}`));
  await sleep(50);
}
note("selected works reveal timeline", sw.join("\n"));

// Line draw timeline
await page.evaluate(() => window.scrollTo(0, 2900));
const ln = [];
const tL = Date.now();
while (Date.now() - tL < 1600) {
  ln.push(await page.evaluate(() => {
    const lines = [...document.querySelectorAll('[data-framer-name="Line"]')].filter((e) => e.getBoundingClientRect().width > 0);
    return lines.map((l) => `${Math.round(l.getBoundingClientRect().width)}@${Math.round(l.getBoundingClientRect().top)}`).join(",");
  }).then((s) => `${Date.now() - tL}ms ${s}`));
  await sleep(60);
}
note("line widths timeline", ln.join("\n"));

// 6. Statement scroll-linked state
for (const y of [2900, 3100, 3300, 3500, 3700]) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(500);
  const st = await page.evaluate(() => {
    const lines = [...document.querySelectorAll("span,div")].filter((e) => /^(\s*I design digital|clarity, emotion|approached with|craftsmanship and|feels as intuitive)/.test(e.textContent) && getComputedStyle(e).fontSize === "70px" && e.children.length === 0);
    return lines.map((l) => { const cs = getComputedStyle(l); return `${cs.color} | bgclip:${cs.backgroundClip}/${cs.webkitBackgroundClip} | bgimg:${cs.backgroundImage.slice(0, 120)} | op:${cs.opacity} | tf:${cs.transform} | top:${Math.round(l.getBoundingClientRect().top)}`; });
  });
  const portrait = await page.evaluate(() => {
    const m = [...document.querySelectorAll("[style]")].find((e) => /mask/.test(e.getAttribute("style") || ""));
    return m ? `${m.getAttribute("style").slice(0, 200)} | top:${Math.round(m.getBoundingClientRect().top)}` : null;
  });
  note(`statement @${y}`, st.join("\n") + "\nPORTRAIT: " + portrait);
  await page.screenshot({ path: path.join(OUT, `statement-${y}.png`) });
}

// 7. Hover states
async function hoverTest(label, finder) {
  const box = await page.evaluate(finder);
  if (!box) { note(`hover ${label}`, "not found"); return; }
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, box.absY - 300));
  await sleep(1200);
  const b2 = await page.evaluate(finder);
  const clip = { x: Math.max(0, b2.x - 40), y: Math.max(0, b2.y - 40), width: Math.min(1440 - Math.max(0, b2.x - 40), b2.w + 80), height: Math.min(900 - Math.max(0, b2.y - 40), b2.h + 80) };
  await page.mouse.move(5, 890); await sleep(500);
  await page.screenshot({ path: path.join(OUT, `hover-${label}-0.png`), clip });
  await page.mouse.move(b2.x + b2.w / 2, b2.y + b2.h / 2);
  for (const t of [120, 300, 700]) { await sleep(t === 120 ? 120 : t - (t === 300 ? 120 : 300)); await page.screenshot({ path: path.join(OUT, `hover-${label}-${t}.png`), clip }); }
  const after = await page.evaluate(b2.probe ? new Function(`return (${b2.probe})()`) : () => null).catch(() => null);
  note(`hover ${label}`, { box: b2, after });
  await page.mouse.move(5, 890); await sleep(400);
}
const finderFor = (sel, textRe) => `(() => { const el = [...document.querySelectorAll('${sel}')].find(e => ${textRe}.test(e.textContent)); if(!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, absY: r.y + scrollY }; })`;
const F = (sel, re) => new Function(`return ${finderFor(sel, re)}()`);
await hoverTest("work-card", F("a", "/MATCH POINT/"));
await hoverTest("work-card-small", F("a", "/Shadow Archive/"));
await hoverTest("explore-more", F("a", "/Explore More/"));
await hoverTest("lets-talk", F("a", "/Let's Talk/"));
await hoverTest("service-row", () => { const el = [...document.querySelectorAll("div")].find((e) => e.getAttribute("data-framer-name") === "Default" && /DIGITAL STRATEGY/.test(e.textContent) && e.getBoundingClientRect().height < 60); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, absY: r.y + scrollY }; });
await hoverTest("award-row", () => { const el = [...document.querySelectorAll("div")].find((e) => /Atelier North/.test(e.textContent) && e.getBoundingClientRect().height < 70 && e.getBoundingClientRect().width > 900); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, absY: r.y + scrollY }; });

// Service-row hovered computed styles
const svc = await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find((e) => e.getAttribute("data-framer-name") === "Default" && /DIGITAL STRATEGY/.test(e.textContent) && e.getBoundingClientRect().height < 60);
  return el ? el.outerHTML.replace(/\s+/g, " ").slice(0, 1800) : null;
});
note("service row html", svc);

// 8. Counters timeline
const cTop = await page.evaluate(() => { const e = [...document.querySelectorAll("p,div")].find((x) => x.textContent.trim() === "Selected Clients"); return e ? e.getBoundingClientRect().top + scrollY : null; });
if (cTop) {
  await page.evaluate((y) => window.scrollTo(0, y - 700), cTop);
  const tc = Date.now();
  let k = 0;
  while (Date.now() - tc < 3200) { await page.screenshot({ path: path.join(OUT, `counter-${String(k++).padStart(2, "0")}-${Date.now() - tc}.png`), clip: { x: 400, y: 380, width: 1040, height: 360 } }); await sleep(90); }
  const counterHtml = await page.evaluate(() => { const e = [...document.querySelectorAll("p,div")].find((x) => x.textContent.trim() === "Selected Clients"); return e?.parentElement?.parentElement?.outerHTML.replace(/\s+/g, " ").slice(0, 3000); });
  note("counter html", counterHtml);
}

// 9. Footer reveal at bottom
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
for (const off of [1500, 1100, 800, 500, 200, 0]) {
  await page.evaluate((y) => window.scrollTo(0, y), docH - 900 - off);
  await sleep(700);
  await page.screenshot({ path: path.join(OUT, `footer-${off}.png`) });
}
await hoverTest("footer-link", F("a", "/^\\s*ABOUT\\s*$/"));
await hoverTest("footer-social", F("a", "/^\\s*LI\\s*$/"));
await page.evaluate((y) => window.scrollTo(0, y), docH);
await sleep(800);
await hoverTest("header-contact", F("a", "/^\\s*Contact\\s*$/"));
await hoverTest("header-email", F("a", "/hello@/"));

fs.writeFileSync(path.join(OUT, "probe.md"), log.join("\n\n"));
await browser.close();
console.log("done");
