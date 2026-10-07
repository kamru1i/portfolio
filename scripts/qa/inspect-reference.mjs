// Forensic inspection of a reference URL (or local build) for visual QA.
// Usage: node scripts/qa/inspect-reference.mjs [url] [outDir]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = process.argv[2] || "https://patrickjane.framer.website/";
const OUT = path.resolve(process.argv[3] || ".qa/reference");
const WIDTHS = (process.env.WIDTHS || "1440,1920,1024,768,390").split(",").map(Number);
const SCROLL_FRAMES = process.env.SCROLL_FRAMES !== "0";

fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function slowScroll(page, step = 120, wait = 40) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(wait);
  }
  await sleep(600);
}

function extract() {
  const vw = window.innerWidth;
  const sy = window.scrollY;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + sy), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const path = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && parts.length < 5) {
      let s = n.tagName.toLowerCase();
      const fc = [...n.classList].find((c) => c.startsWith("framer-") && c.length < 20);
      if (fc) s += "." + fc;
      const name = n.getAttribute("data-framer-name");
      if (name) s += `[${name}]`;
      parts.unshift(s);
      n = n.parentElement;
    }
    return parts.join(" > ");
  };

  const texts = [];
  document.querySelectorAll("body *").forEach((el) => {
    const direct = [...el.childNodes].filter((c) => c.nodeType === 3 && c.textContent.trim()).map((c) => c.textContent.trim()).join(" ");
    if (!direct) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    const b = box(el);
    if (b.w === 0 || b.h === 0) return;
    texts.push({
      t: direct.slice(0, 140), tag: el.tagName.toLowerCase(), ...b,
      ff: cs.fontFamily.split(",")[0].replace(/"/g, ""), fs: cs.fontSize, fw: cs.fontWeight,
      lh: cs.lineHeight, ls: cs.letterSpacing, c: cs.color, tt: cs.textTransform, fst: cs.fontStyle,
      ta: cs.textAlign, op: cs.opacity, p: path(el),
    });
  });

  const media = [];
  document.querySelectorAll("img,video,canvas,svg").forEach((el) => {
    const b = box(el);
    if (b.w < 24 || b.h < 24) return;
    const cs = getComputedStyle(el);
    let parentRadius = "";
    let n = el.parentElement;
    for (let i = 0; i < 4 && n; i++, n = n.parentElement) {
      const r = getComputedStyle(n).borderRadius;
      if (r && r !== "0px") { parentRadius = r; break; }
    }
    media.push({ tag: el.tagName.toLowerCase(), src: (el.currentSrc || el.src || "").toString().slice(0, 120), ...b, fit: cs.objectFit, radius: cs.borderRadius, parentRadius, p: path(el) });
  });

  const special = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.position === "sticky") {
      special.push({ pos: cs.position, top: cs.top, bottom: cs.bottom, z: cs.zIndex, ...box(el), bg: cs.backgroundColor, bf: cs.backdropFilter, mix: cs.mixBlendMode, p: path(el) });
    }
  });

  // Big blocks = likely sections (direct-ish descendants spanning >=90% width)
  const blocks = [];
  document.querySelectorAll("body *").forEach((el) => {
    const b = box(el);
    if (b.w < vw * 0.9 || b.h < 120) return;
    const parent = el.parentElement;
    if (parent) {
      const pb = parent.getBoundingClientRect();
      if (Math.abs(pb.height - b.h) < 2 && Math.abs(pb.width - b.w) < 2) return; // skip wrappers same size as parent
    }
    const cs = getComputedStyle(el);
    blocks.push({ ...b, bg: cs.backgroundColor, bgi: cs.backgroundImage.slice(0, 80), pad: cs.padding, gap: cs.gap, radius: cs.borderRadius, dir: cs.flexDirection, disp: cs.display, maxw: cs.maxWidth, name: el.getAttribute("data-framer-name") || "", p: path(el) });
  });

  const decorated = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    const hasBorder = cs.borderTopWidth !== "0px" && cs.borderTopStyle !== "none";
    const hasRadius = cs.borderRadius !== "0px";
    const hasShadow = cs.boxShadow !== "none";
    const hasBg = cs.backgroundColor !== "rgba(0, 0, 0, 0)";
    if (!(hasBorder || hasShadow || (hasRadius && hasBg))) return;
    const b = box(el);
    if (b.w < 16 || b.h < 16) return;
    decorated.push({ ...b, bg: cs.backgroundColor, border: hasBorder ? `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}` : "", radius: cs.borderRadius, shadow: hasShadow ? cs.boxShadow.slice(0, 120) : "", pad: cs.padding, name: el.getAttribute("data-framer-name") || "", txt: (el.innerText || "").slice(0, 50).replace(/\s+/g, " "), p: path(el) });
  });

  const links = [...document.querySelectorAll("a")].map((a) => ({ href: a.getAttribute("href"), txt: (a.innerText || "").trim().slice(0, 60).replace(/\s+/g, " "), ...box(a) }));

  return {
    vw, vh: window.innerHeight, docH: document.documentElement.scrollHeight,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    texts, media, special, blocks, decorated, links,
  };
}

// Records inline initial states (Framer writes opacity/transform inline before appear)
function initialStates() {
  const out = [];
  document.querySelectorAll("[style]").forEach((el) => {
    const s = el.getAttribute("style") || "";
    if (!/opacity|transform|filter|clip/.test(s)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8) return;
    out.push({ style: s.slice(0, 220), y: Math.round(r.y + scrollY), h: Math.round(r.height), w: Math.round(r.width), name: el.getAttribute("data-framer-name") || "", appear: el.getAttribute("data-framer-appear-id") || "", txt: (el.innerText || "").slice(0, 40).replace(/\s+/g, " ") });
  });
  return out;
}

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const dir = path.join(OUT, String(w));
  fs.mkdirSync(dir, { recursive: true });
  const vh = w <= 430 ? 844 : w <= 820 ? 1024 : w <= 1100 ? 768 : w >= 1900 ? 1080 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: vh }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  // Intro animation frames
  const introTimes = [0, 150, 300, 500, 750, 1000, 1400, 2000, 3000];
  for (const t of introTimes) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
    await page.screenshot({ path: path.join(dir, `intro-${String(t).padStart(4, "0")}.png`) });
  }
  await page.waitForLoadState("networkidle").catch(() => {});
  const init = await page.evaluate(initialStates);
  fs.writeFileSync(path.join(dir, "initial-states.json"), JSON.stringify(init, null, 1));

  if (w === 1440) {
    const appear = await page.evaluate(() => {
      const s = document.getElementById("__framer__appearAnimationsContent");
      return s ? s.textContent : null;
    });
    if (appear) fs.writeFileSync(path.join(OUT, "appear-animations.json"), appear);
    fs.writeFileSync(path.join(OUT, "dom.html"), await page.content());
  }

  // Scroll frames (to analyse scroll-linked motion)
  if (SCROLL_FRAMES && (w === 1440 || w === 390)) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = Math.round(vh * 0.5);
    let i = 0;
    for (let y = 0; y < h; y += step) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(900);
      await page.screenshot({ path: path.join(dir, `scroll-${String(i++).padStart(3, "0")}-${y}.png`) });
    }
  } else {
    await slowScroll(page);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  const data = await page.evaluate(extract);
  fs.writeFileSync(path.join(dir, "layout.json"), JSON.stringify(data, null, 1));
  await page.screenshot({ path: path.join(dir, "full.png"), fullPage: true });
  console.log(`[${w}] docH=${data.docH} texts=${data.texts.length} media=${data.media.length} special=${data.special.length}`);
  await ctx.close();
}
await browser.close();
