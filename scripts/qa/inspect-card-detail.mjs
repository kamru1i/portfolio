import * as fs from "fs";

const data = JSON.parse(fs.readFileSync("scripts/qa/aurexa-projects-section.json", "utf8"));
const card = data.children[0].children[0].children[0];

function walk(n, d = 0) {
  const name = n.framerName ? `[${n.framerName}]` : "";
  const txt = n.text ? `text: "${n.text.slice(0, 50)}"` : "";
  const img = n.imgSrc ? `img: ${n.imgSrc.slice(0, 60)}` : "";
  const dim = `(${n.rect.width}x${n.rect.height})`;
  const st = n.styles ? `bg:${n.styles.backgroundColor} br:${n.styles.borderRadius} p:${n.styles.padding} gap:${n.styles.gap} fs:${n.styles.fontSize}` : "";
  console.log(`${"  ".repeat(d)}${n.tag} ${name} ${dim} ${txt} ${img} ${st}`);
  if (n.children) {
    for (const c of n.children) {
      walk(c, d + 1);
    }
  }
}

walk(card);
