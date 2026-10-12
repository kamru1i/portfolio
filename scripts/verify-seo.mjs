import fs from "fs";
import path from "path";

async function verify() {
  console.log("=== 1. VERIFYING GENERATED STATIC ASSETS ===");
  const ogPngPath = path.resolve("public/images/og-kamrul-islam.png");
  const ogJpgPath = path.resolve("public/images/og-kamrul-islam.jpg");
  const photoPath = path.resolve("public/images/Kamrul I.png");

  console.log("public/images/og-kamrul-islam.png exists:", fs.existsSync(ogPngPath), "(Size:", fs.statSync(ogPngPath).size, "bytes)");
  console.log("public/images/og-kamrul-islam.jpg exists:", fs.existsSync(ogJpgPath), "(Size:", fs.statSync(ogJpgPath).size, "bytes)");
  console.log("public/images/Kamrul I.png exists:", fs.existsSync(photoPath), "(Size:", fs.statSync(photoPath).size, "bytes)");

  console.log("\n=== 2. VERIFYING CODEBASE METADATA IN layout.tsx ===");
  const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
  console.log("Contains metadataBase pointing to https://kamrulislam-bd.netlify.app:", layout.includes("https://kamrulislam-bd.netlify.app"));
  console.log("Contains canonical pointing to https://kamrulislam-bd.netlify.app:", layout.includes("canonical: \"https://kamrulislam-bd.netlify.app\""));
  console.log("Contains og:image pointing to /images/og-kamrul-islam.png:", layout.includes("/images/og-kamrul-islam.png"));
  console.log("Contains twitter:card summary_large_image:", layout.includes("summary_large_image"));
  console.log("Contains twitter:creator @kamru1i:", layout.includes("@kamru1i"));
  console.log("Contains structured data Person & WebSite:", layout.includes("\"@type\": \"Person\"") && layout.includes("\"@type\": \"WebSite\""));

  console.log("\n=== 3. VERIFYING ROBOTS & SITEMAP ===");
  console.log("src/app/robots.ts exists:", fs.existsSync("src/app/robots.ts"));
  console.log("src/app/sitemap.ts exists:", fs.existsSync("src/app/sitemap.ts"));

  console.log("\n=== 4. TESTING LIVE PRODUCTION DOMAIN https://kamrulislam-bd.netlify.app ===");
  try {
    const res = await fetch("https://kamrulislam-bd.netlify.app", {
      headers: { "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" }
    });
    console.log("HTTP Status:", res.status);
    console.log("Headers content-type:", res.headers.get("content-type"));
    const html = await res.text();
    console.log("HTML length:", html.length);

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    console.log("Live <title>:", titleMatch ? titleMatch[1] : "Not found");

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    console.log("Live meta description:", descMatch ? descMatch[1] : "Not found");

    const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    console.log("Live og:image:", ogImgMatch ? ogImgMatch[1] : "Not found");

    const ogUrlMatch = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i);
    console.log("Live og:url:", ogUrlMatch ? ogUrlMatch[1] : "Not found");

    const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i);
    console.log("Live twitter:card:", twitterCardMatch ? twitterCardMatch[1] : "Not found");
  } catch (err) {
    console.log("Network error fetching live domain:", err.message);
  }
}

verify().catch(console.error);
