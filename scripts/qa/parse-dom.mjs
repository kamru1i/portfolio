import fs from "fs";

const html = fs.readFileSync(".qa/reference/dom.html", "utf8");

// Search for appear animation script or loader
const idx = html.indexOf('data-framer-name="Closed"');
if (idx !== -1) {
  console.log("=== CLOSED COMPONENT ===");
  console.log(html.slice(Math.max(0, idx - 200), idx + 2500));
}

// Search for Shader / Canvas
const shaderIdx = html.indexOf('data-framer-component-type="Shader"');
if (shaderIdx !== -1) {
  console.log("\n=== SHADER / CANVAS ===");
  console.log(html.slice(Math.max(0, shaderIdx - 100), shaderIdx + 2000));
}

// Search for audio/video or grain
const grain = html.match(/noise|grain|svg|feTurbulence/gi);
console.log("\n=== GRAIN MATCHES ===", grain);

// Check all script tags to find shaders or animation code
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
console.log("\n=== SCRIPTS ===", scripts.slice(0, 10));
