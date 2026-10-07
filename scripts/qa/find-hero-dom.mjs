import fs from "fs";

const html = fs.readFileSync(".qa/reference/dom.html", "utf8");

const matches = [...html.matchAll(/1ryjcgq/g)];
console.log("Count:", matches.length);
for (const m of matches) {
  console.log("=== MATCH ===");
  console.log(html.slice(Math.max(0, m.index - 100), m.index + 800));
}
