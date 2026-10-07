import fs from "fs";
import path from "path";

function searchDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchDir(full);
    } else if (f.name.endsWith(".mjs") || f.name.endsWith(".js") || f.name.endsWith(".html")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("rotateX") || content.includes("286.287")) {
        console.log("Found in", full);
        const idx = content.indexOf("286.287");
        if (idx !== -1) {
          console.log("Snippet around 286.287 in", full);
          console.log(content.slice(Math.max(0, idx - 500), Math.min(content.length, idx + 1000)));
        }
      }
    }
  }
}

searchDir(".qa");
