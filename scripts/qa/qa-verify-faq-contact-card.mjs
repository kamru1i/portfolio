import { chromium } from "playwright";

async function main() {
  console.log("Starting QA verification of TalkWithKamrulCard across Home & Contact pages...");

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  try {
    // 1. Verify Home Page FAQ Section
    console.log("Navigating to http://localhost:3000/ ...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    // Wait for IntroCurtain to finish
    await page.waitForTimeout(3500);

    const faqSection = page.locator("#faq");
    await faqSection.waitFor({ state: "visible", timeout: 15000 });
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const faqCard = faqSection.locator("text=Talk with").first().locator("..");
    console.log("Checking Home FAQ Talk with card...");

    const faqRole = await faqSection.locator("text=Lead Video Editor, Web Developer & IT Specialist").first();
    const isFaqRoleVisible = await faqRole.isVisible();
    console.log(`Home FAQ Role 'Lead Video Editor, Web Developer & IT Specialist' visible: ${isFaqRoleVisible}`);

    const faqStatus = await faqSection.locator("text=Available for select freelance & full-time roles").first();
    const isFaqStatusVisible = await faqStatus.isVisible();
    console.log(`Home FAQ Status visible: ${isFaqStatusVisible}`);

    const faqCtaBtn = await faqSection.locator("a:has-text('Get in touch')").first();
    const isFaqCtaVisible = await faqCtaBtn.isVisible();
    console.log(`Home FAQ 'Get in touch' CTA button visible: ${isFaqCtaVisible}`);

    await faqSection.screenshot({
      path: "scripts/qa/qa-home-faq-card.png",
    });
    console.log("Saved screenshot: scripts/qa/qa-home-faq-card.png");

    // 2. Verify Contact Us Page
    console.log("Navigating to http://localhost:3000/contact-us ...");
    await page.goto("http://localhost:3000/contact-us", { waitUntil: "networkidle" });

    const getInTouchSection = page.locator("#get-in-touch");
    await getInTouchSection.waitFor({ state: "visible", timeout: 15000 });
    await getInTouchSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const contactCardRole = await getInTouchSection.locator("text=Lead Video Editor, Web Developer & IT Specialist").first();
    const isContactRoleVisible = await contactCardRole.isVisible();
    console.log(`Contact Page Role 'Lead Video Editor, Web Developer & IT Specialist' visible: ${isContactRoleVisible}`);

    const contactCardStatus = await getInTouchSection.locator("text=Available for select freelance & full-time roles").first();
    const isContactStatusVisible = await contactCardStatus.isVisible();
    console.log(`Contact Page Status visible: ${isContactStatusVisible}`);

    // Verify Get in touch button is NOT inside the card on contact page
    const cardContainer = getInTouchSection.locator("div.rounded-2xl:has-text('Talk with')").first();
    const btnInCard = cardContainer.locator("a:has-text('Get in touch')");
    const btnCountInCard = await btnInCard.count();
    console.log(`Contact Page Card 'Get in touch' button count inside card: ${btnCountInCard} (expected 0)`);

    await getInTouchSection.screenshot({
      path: "scripts/qa/qa-contact-form-card.png",
    });
    console.log("Saved screenshot: scripts/qa/qa-contact-form-card.png");

    if (isFaqRoleVisible && isFaqCtaVisible && isContactRoleVisible && btnCountInCard === 0) {
      console.log("\n==============================================");
      console.log("ALL QA CHECKS PASSED SUCCESSFULLY!");
      console.log("==============================================");
    } else {
      console.error("\nQA CHECKS FAILED: Some criteria did not match!");
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("QA script error:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
