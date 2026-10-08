"use client";

import { useState } from "react";
import { IntroCurtain } from "@/components/common/IntroCurtain";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/hero/HeroSection";
import { WorksHeader } from "@/components/works/WorksHeader";
import { WorksGrid } from "@/components/works/WorksGrid";
import { ManifestoSection } from "@/components/about/ManifestoSection";
import { ServicesSection } from "@/components/expertise/ServicesSection";
import { AwardsSection } from "@/components/recognitions/AwardsSection";
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
      <main className="relative z-10 w-full bg-black min-h-screen overflow-x-clip mb-[450px] md:mb-[510px] lg:mb-[634px] shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8">
          {/* Section 1: Hero */}
          <HeroSection isRevealed={isRevealed} />

          {/* Section 2: Selected Works */}
          <WorksHeader />
          <WorksGrid />

          {/* Section 3: Manifesto & About */}
          <ManifestoSection />

          {/* Section 4: Expertise & Services */}
          <ServicesSection />

          {/* Section 5: Milestones, Recognitions & Counters */}
          <AwardsSection />
        </div>
      </main>

      {/* Fixed Theatrical Curtain Footer */}
      <CurtainFooter />
    </>
  );
}
