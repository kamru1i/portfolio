"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { SectionBadge } from "@/components/common/SectionBadge";
import { HairlineRule } from "@/components/common/HairlineRule";
import { ContactHeroOptions } from "./ContactHeroOptions";
import { ContactFormSection } from "./ContactFormSection";
import { ContactFaqSection } from "./ContactFaqSection";

function ContactInner() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || undefined;

  return (
    <>
      {/* Fixed Global Navigation */}
      <Navigation isRevealed={true} />

      {/* Main Page Scroll Canvas */}
      <main className="relative z-10 w-full bg-black min-h-screen overflow-x-clip mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 pt-32 sm:pt-40 md:pt-44">
          {/* Section 1: Hero Header & Title */}
          <div className="w-full flex flex-col items-center text-center select-none mb-14 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <SectionBadge label="CONTACT US" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium tracking-tight text-white leading-[1.06] max-w-4xl mx-auto mt-6 mb-6"
            >
              Let’s create something meaningful together
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] max-w-xl mx-auto leading-relaxed"
            >
              Discussing video production, creative workflows, interactive web engineering, or digital infrastructure.
            </motion.p>
          </div>

          {/* Section 2: Aurexa-Style 4 Quick Contact Options */}
          <ContactHeroOptions />

          {/* Section 3: Get In Touch (Left Info / Right Interactive Form) */}
          <ContactFormSection initialService={serviceParam} />

          {/* Section 4: Contact FAQ Accordion */}
          <ContactFaqSection />
        </div>
      </main>

      {/* Global Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}

export function ContactPageContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ContactInner />
    </Suspense>
  );
}
