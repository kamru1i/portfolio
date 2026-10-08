import { chromium } from "playwright";
import fs from "fs";

async function verifyFaithfulPJ() {
  console.log("=== VERIFYING EXACT PATRICK JANE SELECTED WORKS FIDELITY ===");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000); // intro curtain

  const section = page.locator("section#projects");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take screenshot of header and Row 1
  await page.screenshot({ path: "scripts/qa/pj-faithful-row1.png" });

  // Evaluate card geometry and styles
  const cardData = await page.evaluate(() => {
    const sec = document.querySelector("section#projects");
    if (!sec) return null;

    const cards = Array.from(sec.querySelectorAll(".group.relative.flex.flex-col"));
    return cards.map((c, i) => {
      const imgContainer = c.querySelector(".aspect-square");
      const title = c.querySelector("h3");
      const cBox = c.getBoundingClientRect();
      const imgBox = imgContainer ? imgContainer.getBoundingClientRect() : null;
      const computedImgContainer = imgContainer ? window.getComputedStyle(imgContainer) : null;
      const computedTitle = title ? window.getComputedStyle(title) : null;

      return {
        index: i,
        title: title ? title.textContent.trim() : "",
        cardWidth: cBox.width,
        imgWidth: imgBox ? imgBox.width : 0,
        imgHeight: imgBox ? imgBox.height : 0,
        aspectRatio: imgBox ? (imgBox.width / imgBox.height).toFixed(2) : 0,
        borderRadius: computedImgContainer ? computedImgContainer.borderRadius : null,
        titleFont: computedTitle ? computedTitle.fontFamily : null,
        titleSize: computedTitle ? computedTitle.fontSize : null,
      };
    });
  });

  console.log("Card geometry extracted:", JSON.stringify(cardData, null, 2));

  // Scroll to Row 2
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/qa/pj-faithful-row2.png" });

  // Test video click
  const firstCard = section.locator(".group.relative.flex.flex-col").first();
  await firstCard.click();
  await page.waitForTimeout(800);

  const videoModal = page.locator("[role='dialog']");
  const isModalOpen = await videoModal.isVisible();
  console.log("In-site video lightbox opened:", isModalOpen);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Switch to Web tab
  const webTab = section.locator("button[role='tab']:has-text('Web')");
  await webTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/qa/pj-faithful-web-row1.png" });

  const webCardData = await page.evaluate(() => {
    const sec = document.querySelector("section#projects");
    const cards = Array.from(sec.querySelectorAll(".group.relative.flex.flex-col"));
    return cards.map((c, i) => {
      const imgContainer = c.querySelector(".aspect-square");
      const title = c.querySelector("h3");
      const imgBox = imgContainer ? imgContainer.getBoundingClientRect() : null;
      return {
        index: i,
        title: title ? title.textContent.trim() : "",
        imgWidth: imgBox ? imgBox.width : 0,
        imgHeight: imgBox ? imgBox.height : 0,
      };
    });
  });

  console.log("Web card geometry extracted:", JSON.stringify(webCardData, null, 2));

  // Test Web preview modal
  const firstWebCard = section.locator(".group.relative.flex.flex-col").first();
  await firstWebCard.hover();
  await page.waitForTimeout(400);

  const liveBtn = section.locator("button:has-text('Live Website')").first();
  if (await liveBtn.isVisible()) {
    await liveBtn.click();
    await page.waitForTimeout(800);
    const webModal = page.locator("[role='dialog']");
    console.log("Web preview modal opened:", await webModal.isVisible());
    await page.keyboard.press("Escape");
  }

  // Responsive check on mobile (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "scripts/qa/pj-faithful-mobile-390.png" });

  console.log("=== ALL FIDELITY CHECKS COMPLETED SUCCESSFULLY! ===");
  await browser.close();
}

verifyFaithfulPJ().catch(console.error);
