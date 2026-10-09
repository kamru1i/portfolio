import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000/contact-us", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Fill in form fields
  await page.fill("#name", "Alex Morgan");
  await page.fill("#email", "alex@morgancreative.com");
  await page.fill("#company", "Morgan Studios");
  await page.fill("#details", "Hi Kamrul, looking to collaborate on a high-end commercial project.");

  console.log("Form filled. Submitting...");

  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/contact")),
    page.click('button[type="submit"]'),
  ]);

  const status = response.status();
  const json = await response.json();
  console.log("Response status:", status);
  console.log("Response body:", JSON.stringify(json, null, 2));

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/qa/contact-form-submit-test.png" });
  console.log("Screenshot saved.");

  await browser.close();
}

run().catch(console.error);
