import https from "https";
import fs from "fs";
import path from "path";

const ASSETS = [
  // Hero 3D Cylinder Cards
  { name: "hero-card-1.png", url: "https://framerusercontent.com/images/psFgVNmMjO4qjecHXCfvFJPvf8.png?width=1122&height=1402" },
  { name: "hero-card-2.png", url: "https://framerusercontent.com/images/JEvF3PIwWfTM44d03LoBdkgIA.png?width=1254&height=1254" },
  { name: "hero-card-3.png", url: "https://framerusercontent.com/images/0QTEZe8leHQzxGL0JHzfJynGU.png?width=1122&height=1402" },
  { name: "hero-card-4.png", url: "https://framerusercontent.com/images/SJfFTMOkpiNIDiTtX6KjJfvnaE.png?width=1023&height=1537" },
  { name: "hero-card-5.png", url: "https://framerusercontent.com/images/AnpBnDwnbdKm0MagVXkgmfD4Oro.png?width=1122&height=1402" },

  // Selected Works
  { name: "work-1-biqolpo.png", url: "https://framerusercontent.com/images/xsatjFEdWQctXDyX0w5gXIIJ56g.png?width=1254&height=1254" },
  { name: "work-2-syston.png", url: "https://framerusercontent.com/images/k6pkOxXTcmtbJpl4ryiEsANNM.png?width=1122&height=1402" },
  { name: "work-3-web.png", url: "https://framerusercontent.com/images/Mw8PRd3h6a3HCbz1PYtmBPHDQQ.png?width=1122&height=1402" },
  { name: "work-4-it.png", url: "https://framerusercontent.com/images/6ijdguPT8pywIAIcrgVnpinQJmU.png?width=1055&height=1491" },
  { name: "work-5-bfcars.png", url: "https://framerusercontent.com/images/C0RhC0mljCM3qbVgQZrrsdizYM.png?width=1402&height=1122" },

  // Service Hover Thumbnails
  { name: "service-1.png", url: "https://framerusercontent.com/images/Mc41Jm8TqIsPae8nF65QhavZFeM.png?width=600" },
  { name: "service-2.png", url: "https://framerusercontent.com/images/9a9hLtEYlGfKU4L7PFhjzgwBeQ4.png?width=600" },
  { name: "service-3.png", url: "https://framerusercontent.com/images/MSwmZqyBsXb1Qw6GkY7h87as.png?width=600" },
  { name: "service-4.png", url: "https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=600" },
  { name: "service-5.png", url: "https://framerusercontent.com/images/xsatjFEdWQctXDyX0w5gXIIJ56g.png?width=600" },
];

const outDir = path.resolve("public/images");
fs.mkdirSync(outDir, { recursive: true });

async function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.name}: ${res.statusCode}`);
        return resolve();
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Saved ${item.name}`);
        resolve();
      });
    }).on("error", (err) => {
      console.error(`Error downloading ${item.name}:`, err);
      resolve();
    });
  });
}

for (const asset of ASSETS) {
  await download(asset);
}
console.log("All assets downloaded!");
