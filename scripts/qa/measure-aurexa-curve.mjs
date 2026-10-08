import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://aurexa.framer.website/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Scroll to 300
  console.log("Scrolling to 300...");
  await page.evaluate(() => window.scrollTo(0, 300));
  
  // Monitor every 50ms for 1 second to see the exact interpolation curve
  const frames = [];
  const start = Date.now();
  for (let i = 0; i < 20; i++) {
    const frameData = await page.evaluate(() => {
      const svg = document.querySelector("svg use")?.parentElement;
      const navHeader = document.querySelector(".framer-2bq3am-container");
      return {
        time: Date.now(),
        logoW: svg ? svg.getBoundingClientRect().width : null,
        logoH: svg ? svg.getBoundingClientRect().height : null,
        navH: navHeader ? navHeader.getBoundingClientRect().height : null,
      };
    });
    frames.push(frameData);
    await page.waitForTimeout(50);
  }

  console.log("Animation frames after scrolling to 300:");
  frames.forEach((f, idx) => {
    console.log(`Frame ${idx} (+${f.time - frames[0].time}ms): logoW=${f.logoW?.toFixed(1)}, logoH=${f.logoH?.toFixed(1)}, navH=${f.navH?.toFixed(1)}`);
  });

  // Now test scroll back up to 0
  console.log("\nScrolling back up to 0...");
  await page.evaluate(() => window.scrollTo(0, 0));
  const upFrames = [];
  for (let i = 0; i < 20; i++) {
    const frameData = await page.evaluate(() => {
      const svg = document.querySelector("svg use")?.parentElement;
      const navHeader = document.querySelector(".framer-2bq3am-container");
      return {
        time: Date.now(),
        logoW: svg ? svg.getBoundingClientRect().width : null,
        logoH: svg ? svg.getBoundingClientRect().height : null,
        navH: navHeader ? navHeader.getBoundingClientRect().height : null,
      };
    });
    upFrames.push(frameData);
    await page.waitForTimeout(50);
  }

  console.log("Animation frames after scrolling back to 0:");
  upFrames.forEach((f, idx) => {
    console.log(`Frame ${idx} (+${f.time - upFrames[0].time}ms): logoW=${f.logoW?.toFixed(1)}, logoH=${f.logoH?.toFixed(1)}, navH=${f.navH?.toFixed(1)}`);
  });

  await browser.close();
}

main().catch(console.error);
