import * as fs from "fs";

const data = JSON.parse(fs.readFileSync("scripts/qa/aurexa-projects-section.json", "utf8"));

function printSummary(node, depth = 0) {
  const indent = "  ".repeat(depth);
  const info = `${node.tag} [${node.framerName || "no-name"}] (w:${node.rect.width}, h:${node.rect.height}) ${node.text ? `"${node.text.slice(0, 50)}"` : ""}`;
  console.log(indent + info);
  if (depth < 4 && node.children) {
    for (const child of node.children) {
      if (child.rect.width > 0 && child.rect.height > 0) {
        printSummary(child, depth + 1);
      }
    }
  }
}

printSummary(data);
