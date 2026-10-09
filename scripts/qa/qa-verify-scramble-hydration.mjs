import { chromium } from "playwright";

async function main() {
  console.log("Launching browser to test existing dev server on http://localhost:3000/...");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  const hydrationErrors = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === "error") {
      consoleErrors.push(text);
    }
    if (
      text.toLowerCase().includes("hydration") ||
      text.toLowerCase().includes("server rendered text") ||
      text.toLowerCase().includes("did not match")
    ) {
      hydrationErrors.push(text);
      console.error(`[HYDRATION MISMATCH DETECTED]: ${text}`);
    }
  });

  page.on("pageerror", (err) => {
    console.error(`[PAGE ERROR]: ${err.message}`);
    consoleErrors.push(err.message);
  });

  console.log("Navigating to http://localhost:3000/ for initial visit...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  // Perform 5 consecutive refresh tests as instructed in Phase 7
  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- REFRESH TEST ${i} of 5 ---`);
    if (i > 1) {
      await page.reload({ waitUntil: "networkidle" });
    }

    // Wait for the loader curtain and scramble animation to fully resolve
    console.log("Waiting for IntroCurtain and Hero scramble animation to resolve...");
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector('h1[aria-label="KAMRUL ISLAM"]');
        if (!h1) return false;
        const letters = h1.innerText.replace(/[^A-Za-z]/g, "");
        return letters === "KAMRULISLAM";
      },
      { timeout: 10000 }
    );

    const h1 = page.locator('h1[aria-label="KAMRUL ISLAM"]');
    const h1Text = await h1.innerText();
    const normalizedLetters = h1Text.replace(/[^A-Za-z]/g, "");
    console.log(`Hero Title letters resolved: "${normalizedLetters}"`);

    // Verify Subtitle resolves
    const subtitle = page.locator("section:first-of-type p").first();
    const subText = await subtitle.innerText();
    console.log(`Hero Subtitle preview: "${subText.slice(0, 50)}..."`);

    // Verify ghost character container and cell stability
    const ghostChars = await page.locator("h1 span.invisible").count();
    console.log(`Ghost alignment characters present: ${ghostChars}`);

    // Check for any hydration errors during this cycle
    console.log(`Hydration error count so far: ${hydrationErrors.length}`);
    if (hydrationErrors.length > 0) {
      throw new Error(`Hydration mismatch occurred: ${JSON.stringify(hydrationErrors)}`);
    }

    // Take screenshot on test 1 and test 5
    if (i === 1 || i === 5) {
      await page.screenshot({ path: `scripts/qa/qa-hero-resolved-pass-${i}.png` });
      console.log(`Screenshot saved to scripts/qa/qa-hero-resolved-pass-${i}.png`);
    }
  }

  await browser.close();

  console.log("\n==============================================");
  console.log("TEST SUMMARY:");
  console.log(`Total Consecutive Reloads Tested: 5`);
  console.log(`Hydration Errors Encountered: ${hydrationErrors.length}`);
  console.log(`Console Errors Encountered: ${consoleErrors.length}`);
  console.log("==============================================");

  if (hydrationErrors.length === 0) {
    console.log("SUCCESS: 0 hydration errors. Deterministic initial render and animation verified!");
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
