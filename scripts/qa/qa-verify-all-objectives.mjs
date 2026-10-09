import { chromium } from "playwright";

const SOCIAL_TARGETS = [
  { name: "LinkedIn", expectedUrl: "https://www.linkedin.com/in/kamru1i/" },
  { name: "GitHub", expectedUrl: "https://github.com/kamru1i" },
  { name: "X", expectedUrl: "https://x.com/kamru1i" },
  { name: "YouTube", expectedUrl: "https://www.youtube.com/@kamru1iYT" },
  { name: "Facebook", expectedUrl: "https://www.facebook.com/kamru1i/" },
  { name: "Instagram", expectedUrl: "https://www.instagram.com/kamru1i/" },
  { name: "TikTok", expectedUrl: "https://www.tiktok.com/@kamru1i" },
];

async function main() {
  console.log("==========================================================");
  console.log("STARTING FULL QA VERIFICATION: HERO, EMAIL, API & SOCIALS");
  console.log("==========================================================");

  const browser = await chromium.launch();
  let hasErrors = false;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: HERO VIEWPORTS & BALANCED CENTERING
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: HERO VIEWPORT CENTERING ---");
    const viewportsToTest = [
      { name: "4K (3840x2160)", width: 3840, height: 2160, minTopPct: 30, maxTopPct: 40 },
      { name: "2K (2560x1440)", width: 2560, height: 1440, minTopPct: 22, maxTopPct: 32 },
      { name: "FHD (1920x1080)", width: 1920, height: 1080, minTopPct: 16, maxTopPct: 24 },
      { name: "Laptop (1440x900)", width: 1440, height: 900, minTopPct: 10, maxTopPct: 18 },
      { name: "Mobile (390x844)", width: 390, height: 844, minTopPct: 10, maxTopPct: 20 },
    ];

    for (const vp of viewportsToTest) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
      await page.waitForTimeout(3500); // allow intro curtain to finish

      const title = page.locator("h1[aria-label='KAMRUL ISLAM']");
      const titleBox = await title.boundingBox();
      const topPct = titleBox ? (titleBox.y / vp.height) * 100 : 0;

      console.log(
        `Viewport ${vp.name}: Title Y = ${titleBox?.y.toFixed(1)}px (${topPct.toFixed(1)}% of height). Target: ${vp.minTopPct}%-${vp.maxTopPct}%`
      );

      if (topPct < vp.minTopPct || topPct > vp.maxTopPct) {
        console.error(`FAILED: ${vp.name} top percentage outside expected bounds!`);
        hasErrors = true;
      } else {
        console.log(`PASSED: ${vp.name} balanced vertical positioning verified.`);
      }

      await page.close();
    }

    // -------------------------------------------------------------------------
    // TEST 2: EMAIL OCCURRENCES ACROSS DOM
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: EMAIL VERIFICATION ---");
    const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await testPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await testPage.waitForTimeout(3000);

    const oldEmailCount = await testPage.locator("text=kamrulislamabk@gmail.com").count();
    console.log(`Home page occurrences of old email (kamrulislamabk@gmail.com): ${oldEmailCount} (expected 0)`);
    if (oldEmailCount > 0) {
      console.error("FAILED: Old email found on Home page!");
      hasErrors = true;
    }

    await testPage.goto("http://localhost:3000/contact-us", { waitUntil: "networkidle" });
    const oldEmailCountContact = await testPage.locator("text=kamrulislamabk@gmail.com").count();
    console.log(`Contact page occurrences of old email: ${oldEmailCountContact} (expected 0)`);
    if (oldEmailCountContact > 0) {
      console.error("FAILED: Old email found on Contact page!");
      hasErrors = true;
    }

    const newEmailLocator = testPage.locator("text=inquiry.kamrul@gmail.com").first();
    const isNewEmailVisible = await newEmailLocator.isVisible();
    console.log(`Contact page new email (inquiry.kamrul@gmail.com) displayed: ${isNewEmailVisible}`);
    if (!isNewEmailVisible) {
      console.error("FAILED: New email inquiry.kamrul@gmail.com not visible on Contact page!");
      hasErrors = true;
    }

    // -------------------------------------------------------------------------
    // TEST 3: SOCIAL MEDIA LINKS IN FOOTER & FULLSCREEN MENU
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: SOCIAL MEDIA PROFILE LINKS ---");
    const footer = testPage.locator("footer").first();
    await footer.scrollIntoViewIfNeeded();

    for (const target of SOCIAL_TARGETS) {
      const link = footer.locator(`a[href="${target.expectedUrl}"]`);
      const count = await link.count();
      const ariaLabel = count > 0 ? await link.getAttribute("aria-label") : null;
      const targetAttr = count > 0 ? await link.getAttribute("target") : null;
      const relAttr = count > 0 ? await link.getAttribute("rel") : null;

      console.log(
        `Footer [${target.name}]: found=${count > 0}, url=${target.expectedUrl}, aria-label="${ariaLabel}", target="${targetAttr}", rel="${relAttr}"`
      );

      if (count === 0 || targetAttr !== "_blank" || !relAttr?.includes("noopener")) {
        console.error(`FAILED: Social link for ${target.name} missing or improperly configured in Footer!`);
        hasErrors = true;
      }
    }

    // Test FullScreen Menu Socials
    console.log("\nTesting FullScreen Menu Socials...");
    const menuBtn = testPage.locator("button:has-text('MENU')").first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await testPage.waitForTimeout(600);

      const menuModal = testPage.locator("div[role='dialog']");
      for (const target of SOCIAL_TARGETS) {
        const menuLink = menuModal.locator(`a[href="${target.expectedUrl}"]`);
        const count = await menuLink.count();
        console.log(`Menu [${target.name}]: found=${count > 0}, url=${target.expectedUrl}`);
        if (count === 0) {
          console.error(`FAILED: Social link for ${target.name} missing in FullScreen Menu!`);
          hasErrors = true;
        }
      }
      // Close menu
      await testPage.keyboard.press("Escape");
      await testPage.waitForTimeout(400);
    }

    // -------------------------------------------------------------------------
    // TEST 4: SERVER-SIDE API CONTACT ROUTE VALIDATION
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: SERVER-SIDE API CONTACT ROUTE ---");
    // 4.1 Empty submission rejection
    const emptyRes = await testPage.request.post("http://localhost:3000/api/contact", {
      data: {},
    });
    console.log(`API empty submission status: ${emptyRes.status()} (expected 400)`);
    if (emptyRes.status() !== 400) {
      console.error("FAILED: API did not reject empty submission with 400!");
      hasErrors = true;
    }

    // 4.2 Invalid email rejection
    const invalidEmailRes = await testPage.request.post("http://localhost:3000/api/contact", {
      data: {
        name: "Test User",
        email: "not-an-email",
        projectType: "Video Editing",
        details: "This is a test message with invalid email.",
      },
    });
    console.log(`API invalid email status: ${invalidEmailRes.status()} (expected 400)`);
    if (invalidEmailRes.status() !== 400) {
      console.error("FAILED: API did not reject invalid email with 400!");
      hasErrors = true;
    }

    // 4.3 Bot honeypot check
    const botRes = await testPage.request.post("http://localhost:3000/api/contact", {
      data: {
        name: "Bot User",
        email: "bot@example.com",
        projectType: "Video Editing",
        details: "This is a spam bot test.",
        botCheck: "I am a bot",
      },
    });
    console.log(`API bot honeypot status: ${botRes.status()} (expected 400)`);
    if (botRes.status() !== 400) {
      console.error("FAILED: API did not reject honeypot with 400!");
      hasErrors = true;
    }

    // 4.4 Valid payload structure test
    const validRes = await testPage.request.post("http://localhost:3000/api/contact", {
      data: {
        name: "Jane Doe",
        email: "janedoe@example.com",
        company: "Acme Corp",
        projectType: "Front-End Web Development (React / Next.js)",
        budgetRange: "$1,000 - $3,000",
        timeline: "1 to 2 weeks",
        details: "Looking to build a high-performance web platform inspired by modern editorial aesthetics.",
      },
    });
    const validJson = await validRes.json();
    console.log(`API valid payload status: ${validRes.status()}, response:`, validJson);
    // When RESEND_API_KEY is not yet in .env.local, API returns 503 with code PROVIDER_KEY_MISSING (safe & accurate)
    // If configured, it returns 200 with success: true
    if (validRes.status() === 503 && validJson.code === "PROVIDER_KEY_MISSING") {
      console.log("PASSED: Server safely identified missing RESEND_API_KEY and refused false success.");
    } else if (validRes.status() === 200 && validJson.success === true) {
      console.log("PASSED: Email delivery succeeded through configured Resend provider.");
    } else {
      console.error(`FAILED: Unexpected API response: ${validRes.status()}`);
      hasErrors = true;
    }

    await testPage.close();
  } catch (err) {
    console.error("QA execution exception:", err);
    hasErrors = true;
  } finally {
    await browser.close();
  }

  console.log("\n==========================================================");
  if (hasErrors) {
    console.error("OVERALL QA VERIFICATION: FAILED WITH ERRORS");
    process.exitCode = 1;
  } else {
    console.log("OVERALL QA VERIFICATION: ALL OBJECTIVES PASSED 100%!");
  }
  console.log("==========================================================");
}

main();
