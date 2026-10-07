import fs from "fs";

const html = fs.readFileSync(".qa/reference/dom.html", "utf8");
const start = html.indexOf('data-framer-appear-id="1ryjcgq"');
if (start !== -1) {
  // Let's print 6000 characters from start
  console.log(html.slice(start, start + 8000));
}
