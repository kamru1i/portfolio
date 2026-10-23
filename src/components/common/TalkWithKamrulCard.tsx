"use client";

import Image from "next/image";
import Link from "next/link";
import { KamrulBrandWordmark } from "@/components/layout/KamrulBrandWordmark";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

export interface TalkWithKamrulCardProps {
  contactCard?: {
    name?: string;
    role?: string;
    ctaText?: string;
    ctaHref?: string;
    email?: string;
    status?: string;
    avatarSrc?: string;
  };
  showButton?: boolean;
  className?: string;
}

export function TalkWithKamrulCard({
  contactCard,
  showButton = true,
  className = "",
}: TalkWithKamrulCardProps) {
  const cardData = {
    ...PORTFOLIO_DATA.faq.contactCard,
    ...contactCard,
  };

  return (
    <div
      className={`w-full max-w-md rounded-2xl bg-[#161616] border border-white/[0.08] p-5 sm:p-6 flex flex-col gap-4 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/15 ${className}`}
    >
      {/* Profile Avatar & Info Row */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 flex-shrink-0 shadow-inner">
          <Image
            src={cardData.avatarSrc}
            alt="Kamrul Islam"
            fill
            className="object-cover object-top"
            sizes="56px"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-sans font-medium text-lg text-white">Talk with</span>
            <KamrulBrandWordmark className="h-[18px] w-auto inline-block text-white" />
          </div>
          <span className="font-mono-custom text-xs text-[#888]">
            {cardData.role}
          </span>
        </div>
      </div>

      {/* Availability Status Indicator */}
      <div className="flex items-center gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="font-mono-custom text-[11px] sm:text-xs text-[#aaa]">
          {cardData.status}
        </span>
      </div>

      {/* Direct Phone & WhatsApp Business Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 font-mono-custom text-xs">
        <a
          href={`tel:${PORTFOLIO_DATA.brand.phone.replace(/[^0-9+]/g, "")}`}
          className="text-white/90 hover:text-white transition-colors"
        >
          {PORTFOLIO_DATA.brand.phone}
        </a>
        <a
          href={PORTFOLIO_DATA.brand.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] uppercase tracking-wider transition-colors"
        >
          <span>WhatsApp Business</span>
          <span>↗</span>
        </a>
      </div>

      {/* Contact CTA Button (optional) */}
      {showButton && (
        <Link
          href={cardData.ctaHref || "/contact-us"}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 transition-all duration-200 shadow-md group select-none mt-1"
        >
          <span>{cardData.ctaText || "Get in touch"}</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
