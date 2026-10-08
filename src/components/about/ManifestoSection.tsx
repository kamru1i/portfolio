"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  // Scroll scrub for statement typography illumination
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ["start 80%", "end 35%"],
  });

  const lines = PORTFOLIO_DATA.manifesto.lines;

  return (
    <section id="about" ref={containerRef} className="w-full pt-20 md:pt-28 pb-20">
      <HairlineRule className="mb-14 md:mb-20" />

      {/* Large Scroll-Illuminated Manifesto Statement matching Gambarino 70px */}
      <div ref={statementRef} className="relative w-full max-w-[1360px] mb-24 md:mb-32">
        <h2 className="font-gambarino text-3xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.02] tracking-[-0.03em] font-normal text-left">
          {lines.map((line, lineIndex) => {
            const start = lineIndex / lines.length;
            const end = (lineIndex + 1) / lines.length;

            return (
              <ManifestoLine
                key={lineIndex}
                line={line}
                scrollProgress={scrollYProgress}
                start={start}
                end={end}
              />
            );
          })}
        </h2>
      </div>

      {/* Dual Column Lower Block: Portrait (Left) + Bio Narrative (Right with generous gap) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-0 items-start">
        {/* Creator Portrait with Noir Grading & Wipe Reveal */}
        <motion.div
          ref={portraitRef}
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="col-span-12 md:col-span-5 relative w-full aspect-[450/590] max-w-[450px] rounded-[12px] overflow-hidden bg-[#0d0d0d] select-none"
        >
          <Image
            src={PORTFOLIO_DATA.manifesto.portraitSrc}
            alt="Kamrul Islam"
            fill
            className="object-cover grayscale contrast-125 brightness-95"
            sizes="(max-width: 768px) 100vw, 450px"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Bio Paragraphs & Contact CTA (Right, col-start-7 for exact 563px width) */}
        <div className="col-span-12 md:col-span-6 md:col-start-7 flex flex-col justify-start space-y-8 font-mono-custom text-[15px] sm:text-[16px] leading-[1.65] text-[#a1a1a1]">
          <p
            className="[&_strong]:text-white [&_strong]:font-medium"
            dangerouslySetInnerHTML={{
              __html: PORTFOLIO_DATA.manifesto.bio1Html,
            }}
          />

          <p
            className="[&_strong]:text-white [&_strong]:font-medium"
            dangerouslySetInnerHTML={{
              __html: PORTFOLIO_DATA.manifesto.bio2Html,
            }}
          />

          <div className="pt-2">
            <a
              href={PORTFOLIO_DATA.manifesto.ctaHref}
              className="text-white hover-underline-link tracking-wider font-mono-custom text-[16px]"
            >
              {PORTFOLIO_DATA.manifesto.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestoLine({
  line,
  scrollProgress,
  start,
  end,
}: {
  line: string;
  scrollProgress: any;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollProgress, [start, end], [0.35, 1]);
  const color = useTransform(
    scrollProgress,
    [start, end],
    ["rgb(115, 115, 115)", "rgb(255, 255, 255)"]
  );

  return (
    <motion.span
      style={{ opacity, color }}
      className="block transition-colors duration-150"
    >
      {line}
    </motion.span>
  );
}
