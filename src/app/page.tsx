"use client";

import { useState } from "react";
import { IntroCurtain } from "@/components/common/IntroCurtain";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsAndWorksSection } from "@/components/works/ProjectsAndWorksSection";
import { ManifestoSection } from "@/components/about/ManifestoSection";
import { ServicesSection } from "@/components/expertise/ServicesSection";
import { AwardsSection } from "@/components/recognitions/AwardsSection";
import { FaqSection } from "@/components/faq/FaqSection";
import { CurtainFooter } from "@/components/layout/CurtainFooter";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export default function HomePage() {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isCurtainComplete, setIsCurtainComplete] = useState<boolean>(false);

  return (
    <>
      {/* Intro Curtain Loader */}
      {!isCurtainComplete && (
        <IntroCurtain
          brandName={PORTFOLIO_DATA.brand.curtainName}
          onReveal={() => setIsRevealed(true)}
          onComplete={() => setIsCurtainComplete(true)}
        />
      )}

      {/* Fixed Global Navigation */}
      <Navigation isRevealed={isRevealed} />

      {/* Main Page Scroll Canvas */}
      <main className="relative z-10 w-full bg-black min-h-screen overflow-x-clip mb-[520px] sm:mb-[580px] md:mb-[640px] lg:mb-[700px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <div className="mx-auto w-full max-w-[1648px] px-4 sm:px-6 md:px-8">
          {/* Section 1: Hero */}
          <HeroSection isRevealed={isRevealed} />

          {/* Section 2: Projects & Works (Video & Web Tabs) */}
          <ProjectsAndWorksSection />

          {/* Section 3: Manifesto & About */}
          <ManifestoSection />

          {/* Section 4: Expertise & Services */}
          <ServicesSection />

          {/* Section 5: Milestones, Recognitions & Counters */}
          <AwardsSection />

          {/* Section 6: Frequently Asked Questions */}
          <FaqSection />
        </div>
      </main>

      {/* Fixed Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
