"use client";

import { useEffect } from "react";

interface SectionConfig {
  id: string;
  title: string;
}

const SECTIONS: SectionConfig[] = [
  { id: "hero", title: "Kamrul Islam — Portfolio" },
  { id: "projects", title: "Kamrul Islam — Projects & Works" },
  { id: "about", title: "Kamrul Islam — About" },
  { id: "services", title: "Kamrul Islam — Services" },
  { id: "recognitions", title: "Kamrul Islam — Milestones & Recognitions" },
  { id: "faq", title: "Kamrul Islam — FAQ" },
  { id: "contact", title: "Kamrul Islam — Contact" },
];

export function DynamicSectionTitle() {
  useEffect(() => {
    let ticking = false;

    const updateTitle = () => {
      // 1. If at or near the very top of the page, default immediately to Portfolio
      if (window.scrollY < 120) {
        if (document.title !== "Kamrul Islam — Portfolio") {
          document.title = "Kamrul Islam — Portfolio";
        }
        return;
      }

      // 2. If scrolled near the bottom of the document, activate Contact / Footer
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 180;
      if (isNearBottom) {
        const contactSection = SECTIONS.find((s) => s.id === "contact");
        if (contactSection && document.title !== contactSection.title) {
          document.title = contactSection.title;
        }
        return;
      }

      // 3. Focal trigger line at 35% down the viewport height
      const triggerY = window.innerHeight * 0.35;
      let activeSection: SectionConfig | null = null;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          activeSection = section;
          break;
        }
      }

      if (activeSection && document.title !== activeSection.title) {
        document.title = activeSection.title;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTitle();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run initial determination on mount
    updateTitle();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", updateTitle, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", updateTitle);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return null;
}
