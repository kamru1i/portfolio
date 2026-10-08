import https from "https";
import fs from "fs";

const url = "https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256";
const file = fs.createWriteStream("public/images/grain.png");
https.get(url, (res) => {
  res.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Successfully downloaded public/images/grain.png, size:", fs.statSync("public/images/grain.png").size);
  });
}).on("error", (err) => {
  console.error("Error downloading grain:", err);
});
