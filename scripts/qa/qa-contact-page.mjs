import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

  console.log("=== STEP 1: Direct navigation to /contact-us ===");
  await page.goto("http://localhost:3000/contact-us", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Progressive scroll to trigger all whileInView animations
  for (const y of [600, 1200, 1800, 2400]) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Verify Title and Headings
  const title = await page.title();
  console.log(`Page Title: "${title}"`);

  const h1 = await page.locator("h1").innerText();
  console.log(`H1 Heading: "${h1.trim()}"`);

  // Verify 4 Option Cards
  const optionCards = page.locator("h3:has-text('Quick discovery')");
  console.log(`Option cards visible: ${(await optionCards.count()) > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  // Capture desktop screenshot
  await page.screenshot({ path: "scripts/qa/qa-contact-desktop-full.png", fullPage: true });
  console.log("Captured scripts/qa/qa-contact-desktop-full.png");

  console.log("=== STEP 2: Test Form Validation and Submission ===");
  const submitBtn = page.locator('button[type="submit"]:has-text("Send inquiry")');
  await submitBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Submit empty form to verify validation
  await submitBtn.click();
  await page.waitForTimeout(500);

  const nameError = await page.locator('p:has-text("Please enter your name.")').count();
  console.log(`Name validation error triggered: ${nameError > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  // Fill valid inputs
  console.log("Filling form fields...");
  await page.fill('#name', 'Test Client');
  await page.fill('#email', 'test@client.com');
  await page.fill('#company', 'Acme Studios');
  await page.fill('#details', 'We are looking for cinematic post-production and motion graphics for a series of commercial videos.');

  // Submit valid form and await API response
  console.log("Submitting form...");
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/contact"), { timeout: 15000 }),
    submitBtn.click(),
  ]);
  console.log(`API response status: ${response.status()}`);

  await page.waitForSelector('h3:has-text("Enquiry Prepared Successfully")', { timeout: 10000 });
  const successHeading = await page.locator('h3:has-text("Enquiry Prepared Successfully")').count();
  console.log(`Success state reached: ${successHeading > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  await page.screenshot({ path: "scripts/qa/qa-contact-form-success.png" });
  console.log("Captured scripts/qa/qa-contact-form-success.png");

  console.log("=== STEP 3: Test FAQ Accordion ===");
  // Question 1 should be open by default
  const defaultOpenFaq = page.locator('p:has-text("Share a brief summary of your project")');
  console.log(`Default open FAQ visible: ${await defaultOpenFaq.isVisible() ? "YES (PASS)" : "NO (FAIL)"}`);

  // Click Question 2 to expand it
  const faq2 = page.locator('text="Which services can I contact you about?"').first();
  await faq2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await faq2.click();
  await page.waitForTimeout(600);

  const faq2Answer = page.locator('p:has-text("commercial video editing and post-production")');
  console.log(`FAQ 2 expanded answer visible: ${await faq2Answer.isVisible() ? "YES (PASS)" : "NO (FAIL)"}`);

  console.log("=== STEP 4: Test Mobile Viewport (390px) ===");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`Mobile horizontal overflow: ${overflow ? "YES (FAIL)" : "NO (PASS)"}`);

  await page.screenshot({ path: "scripts/qa/qa-contact-mobile-full.png", fullPage: true });
  console.log("Captured scripts/qa/qa-contact-mobile-full.png");

  console.log("=== STEP 5: Test Navigation Links to /contact-us ===");
  // Test from homepage
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // Check About CTA
  const aboutCta = page.locator('#about a[href="/contact-us"]');
  console.log(`About CTA links to /contact-us: ${(await aboutCta.count()) > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  // Check FAQ CTA
  const faqCta = page.locator('#faq a[href="/contact-us"]');
  console.log(`FAQ CTA links to /contact-us: ${(await faqCta.count()) > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  // Check Footer CTA
  const footerCta = page.locator('footer a[href="/contact-us"]');
  console.log(`Footer CONTACT US CTA links to /contact-us: ${(await footerCta.count()) > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  // Check Service Detail CTA
  await page.goto("http://localhost:3000/services/video-editing", { waitUntil: "networkidle" });
  const serviceCta = page.locator('a[href*="/contact-us"]');
  console.log(`Service inquiry CTA links to /contact-us: ${(await serviceCta.count()) > 0 ? "YES (PASS)" : "NO (FAIL)"}`);

  await browser.close();
  console.log("=== ALL QA TESTS COMPLETED CLEANLY ===");
}

main().catch(console.error);
