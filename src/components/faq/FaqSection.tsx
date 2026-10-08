"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HairlineRule } from "@/components/common/HairlineRule";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export function FaqSection() {
  const faqData = PORTFOLIO_DATA.faq;
  // Default to first item expanded for immediate discovery
  const [openIds, setOpenIds] = useState<string[]>([faqData.items[0]?.id || ""]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="w-full pt-20 md:pt-28 pb-32 md:pb-48 select-none">
      <HairlineRule className="mb-14 md:mb-20" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Pill, Title, Subtitle, and Desktop Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-5 flex flex-col lg:sticky lg:top-28 xl:top-32"
        >
          {/* Top Metadata & Heading */}
          <div>
            {/* FAQ Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/85 font-mono-custom text-xs uppercase tracking-widest mb-6 w-fit backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {faqData.badge}
            </div>

            {/* Patrick Jane Editorial Serif Headline */}
            <h2 className="font-gambarino text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] text-white tracking-tight leading-[1.08] font-normal uppercase text-balance">
              HAVE QUESTIONS?<br className="hidden sm:inline" /> CHECK OUT THE FAQS
            </h2>

            {/* Aurexa Supporting Subtitle */}
            <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] mt-5 sm:mt-6 leading-relaxed max-w-md">
              {faqData.subtitle}
            </p>
          </div>

          {/* Desktop Contact / Talk Card */}
          <div className="hidden lg:block mt-14 xl:mt-18">
            <FaqContactCard contactCard={faqData.contactCard} />
          </div>
        </motion.div>

        {/* Right Column: 10 Accordion Cards */}
        <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
          {faqData.items.map((item, idx) => {
            const isOpen = openIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(idx * 0.05, 0.3),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`rounded-[14px] bg-[#1a1a1a] transition-all duration-300 border ${
                  isOpen
                    ? "border-white/20 bg-[#1e1e1e]/90 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    : "border-white/[0.08] hover:border-white/15 hover:bg-[#1c1c1c]"
                }`}
              >
                {/* Accordion Trigger Button */}
                <button
                  type="button"
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-[14px] group"
                >
                  <span className="font-sans text-[17px] sm:text-[18px] md:text-[19px] font-medium text-white/95 group-hover:text-white transition-colors leading-snug">
                    {item.question}
                  </span>

                  {/* Smooth 45° Rotating Plus/Minus Icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${
                      isOpen
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.04] text-white/70 border-white/10 group-hover:border-white/30 group-hover:text-white"
                    }`}
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="text-lg leading-none select-none font-light inline-block"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                {/* Smooth Animated Height & Opacity Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.25, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="pt-3.5 border-t border-white/[0.06]">
                          <p className="font-mono-custom text-[14px] sm:text-[15px] text-[#a1a1a1] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Mobile Profile Card displayed below the accordion list */}
          <div className="block lg:hidden mt-8 pt-4">
            <FaqContactCard contactCard={faqData.contactCard} />
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactCardProps {
  contactCard: {
    name: string;
    role: string;
    ctaText: string;
    email: string;
    status: string;
    avatarSrc: string;
  };
}

function FaqContactCard({ contactCard }: ContactCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-[#161616] border border-white/[0.08] p-5 sm:p-6 flex flex-col gap-4 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/15">
      {/* Profile Avatar & Info Row */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/15 flex-shrink-0 bg-neutral-900 shadow-inner">
          <Image
            src={contactCard.avatarSrc}
            alt={contactCard.name}
            fill
            className="object-cover object-top filter grayscale contrast-110"
            sizes="56px"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-medium text-lg text-white">
            {contactCard.name}
          </span>
          <span className="font-mono-custom text-xs text-[#888]">
            {contactCard.role}
          </span>
        </div>
      </div>

      {/* Availability Status Indicator */}
      <div className="flex items-center gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="font-mono-custom text-[11px] sm:text-xs text-[#aaa]">
          {contactCard.status}
        </span>
      </div>

      {/* Contact CTA Button */}
      <a
        href={`mailto:${contactCard.email}`}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 transition-all duration-200 shadow-md group select-none mt-1"
      >
        <span>{contactCard.ctaText}</span>
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
