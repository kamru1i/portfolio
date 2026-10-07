import fs from "fs";

const html = fs.readFileSync(".qa/reference/dom.html", "utf8");
const heroIdx = html.indexOf("framer-1vsv9xc");
if (heroIdx !== -1) {
  console.log("HTML around hero:");
  console.log(html.slice(Math.max(0, heroIdx - 200), Math.min(html.length, heroIdx + 1200)));
}
