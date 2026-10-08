import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function inspectAurexaServices() {
  const qaDir = path.resolve(process.cwd(), ".qa/aurexa-services-study");
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to https://aurexa.framer.website/...");
  await page.goto("https://aurexa.framer.website/", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(3000);

  // Find the Services section on the page
  console.log("Locating Services section...");
  const servicesData = await page.evaluate(() => {
    // Look for text "SERVICES" or headings
    const elements = Array.from(document.querySelectorAll("*"));
    const serviceHeading = elements.find(
      (el) => el.textContent?.trim().toUpperCase() === "SERVICES" && el.children.length === 0
    );

    // Find links or rows that mention services like "Brand Identity", "Web Design", etc.
    const serviceNames = [
      "Brand Identity",
      "Web Design",
      "UI/UX Design",
      "Framer Development",
      "Webflow Development",
      "Creative Direction",
    ];

    const foundItems = [];
    for (const name of serviceNames) {
      const el = elements.find(
        (e) => e.textContent?.trim() === name && e.children.length === 0
      );
      if (el) {
        // find its row or anchor parent
        const anchor = el.closest("a");
        const row = el.closest("[class*='framer-']") || el.parentElement;
        foundItems.push({
          name,
          href: anchor?.getAttribute("href"),
          rect: el.getBoundingClientRect(),
          rowRect: row?.getBoundingClientRect(),
          computedStyle: {
            fontSize: window.getComputedStyle(el).fontSize,
            fontFamily: window.getComputedStyle(el).fontFamily,
            fontWeight: window.getComputedStyle(el).fontWeight,
            lineHeight: window.getComputedStyle(el).lineHeight,
            letterSpacing: window.getComputedStyle(el).letterSpacing,
            color: window.getComputedStyle(el).color,
          },
        });
      }
    }

    return {
      serviceHeadingFound: !!serviceHeading,
      serviceHeadingRect: serviceHeading?.getBoundingClientRect(),
      foundItems,
    };
  });

  console.log("Initial scan result:", JSON.stringify(servicesData, null, 2));

  // Scroll down to where the first service is located
  if (servicesData.foundItems.length > 0) {
    const firstItem = servicesData.foundItems[0];
    console.log("Scrolling to first service item:", firstItem.name);
    await page.evaluate((y) => {
      window.scrollTo({ top: window.scrollY + y - 200, behavior: "instant" });
    }, firstItem.rect.top);
    await page.waitForTimeout(1500);

    // Screenshot before hover
    await page.screenshot({ path: path.join(qaDir, "1-services-idle.png") });

    // Now hover the first service item and inspect what elements appear or change
    const firstAnchor = page.locator(`a:has-text("${firstItem.name}")`).first();
    console.log("Hovering first service item...");
    await firstAnchor.hover();
    await page.waitForTimeout(800);

    // Screenshot during hover
    await page.screenshot({ path: path.join(qaDir, "2-service-hover-1.png") });

    // Move mouse across the item
    const box = await firstAnchor.boundingBox();
    if (box) {
      console.log("Moving mouse across service item...");
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(qaDir, "3-service-hover-move-left.png") });

      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(qaDir, "4-service-hover-move-right.png") });
    }

    // Inspect the DOM during hover for images/floats/reveals
    const hoverStateAnalysis = await page.evaluate(() => {
      // Find all visible images or divs with background images
      const images = Array.from(document.querySelectorAll("img, [style*='background-image']")).map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          tagName: img.tagName,
          src: img.src || img.getAttribute("style"),
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
          opacity: window.getComputedStyle(img).opacity,
          transform: window.getComputedStyle(img).transform,
          clipPath: window.getComputedStyle(img).clipPath,
          visibility: window.getComputedStyle(img).visibility,
        };
      }).filter(img => img.rect.width > 50 && img.rect.height > 50 && img.rect.top < window.innerHeight && img.rect.top > -200);

      return {
        visibleImagesOnHover: images,
      };
    });

    console.log("Hover State Analysis:", JSON.stringify(hoverStateAnalysis, null, 2));

    // Hover second service item
    if (servicesData.foundItems.length > 1) {
      const secondItem = servicesData.foundItems[1];
      console.log("Hovering second service item:", secondItem.name);
      const secondAnchor = page.locator(`a:has-text("${secondItem.name}")`).first();
      await secondAnchor.hover();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(qaDir, "5-service-hover-2.png") });
    }

    // Move mouse away
    console.log("Moving mouse away to top-left...");
    await page.mouse.move(10, 10);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(qaDir, "6-service-hover-exit.png") });

    // Inspect service detail page!
    if (firstItem.href) {
      console.log("Navigating to service detail page:", firstItem.href);
      const detailUrl = new URL(firstItem.href, "https://aurexa.framer.website/").href;
      await page.goto(detailUrl, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(qaDir, "7-service-detail-page.png") });

      // Inspect detail page structure
      const detailPageData = await page.evaluate(() => {
        const h1 = document.querySelector("h1")?.textContent;
        const paragraphs = Array.from(document.querySelectorAll("p")).map(p => p.textContent?.trim()).filter(Boolean).slice(0, 10);
        const headings = Array.from(document.querySelectorAll("h2, h3, h4")).map(h => h.textContent?.trim()).filter(Boolean);
        return {
          h1,
          headings,
          paragraphs,
        };
      });
      console.log("Detail Page Data:", JSON.stringify(detailPageData, null, 2));
      fs.writeFileSync(path.join(qaDir, "detail-page-data.json"), JSON.stringify(detailPageData, null, 2));
    }
  }

  fs.writeFileSync(path.join(qaDir, "services-data.json"), JSON.stringify(servicesData, null, 2));
  await browser.close();
  console.log("Inspection completed successfully!");
}

inspectAurexaServices().catch((err) => {
  console.error("Error inspecting Aurexa services:", err);
  process.exit(1);
});
