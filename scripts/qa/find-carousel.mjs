import fs from "fs";

const file = ".qa/hero/src-framer.DOvA6pxI.mjs";
const content = fs.readFileSync(file, "utf8");
console.log("Length:", content.length);

const idx = content.indexOf("286.287");
console.log("286.287 at:", idx);
if (idx !== -1) {
  // Let's print the entire component or function containing this!
  console.log("================ CODE AROUND 286.287 ================");
  console.log(content.slice(Math.max(0, idx - 1500), Math.min(content.length, idx + 4500)));
}
