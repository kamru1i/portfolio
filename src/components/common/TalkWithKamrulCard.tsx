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
      className={`w-full max-w-md rounded-2xl bg-[#161616] border border-white/8 p-5 sm:p-6 flex flex-col gap-4 shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/15 ${className}`}
    >
      {/* Profile Avatar & Info Row */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 shrink-0 shadow-inner">
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
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-mono-custom text-[11px] sm:text-xs text-[#aaa]">
          {cardData.status}
        </span>
      </div>

      {/* Direct Phone & WhatsApp Icon Row */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-white/10 font-mono-custom text-xs">
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
          aria-label="Chat on WhatsApp"
          title="Open in WhatsApp"
          className="w-7 h-7 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-[#25D366] flex items-center justify-center transition-all hover:scale-110 shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.461 3.484 1.336 5.008L2 22l5.156-1.352a9.927 9.927 0 0 0 4.875 1.281h.004c5.512 0 9.965-4.453 9.965-9.969 0-2.664-1.035-5.168-2.918-7.051A9.907 9.907 0 0 0 12.031 2Zm0 18.281h-.004a8.268 8.268 0 0 1-4.215-1.152l-.301-.18-3.062.805.816-2.984-.199-.313a8.252 8.252 0 0 1-1.266-4.488c0-4.57 3.719-8.289 8.293-8.289 2.215 0 4.297.863 5.863 2.43a8.238 8.238 0 0 1 2.426 5.859c0 4.574-3.719 8.293-8.351 8.312Zm4.547-6.203c-.25-.125-1.477-.727-1.703-.812-.23-.082-.395-.125-.563.125-.164.25-.645.812-.789.977-.145.168-.289.188-.539.062-.25-.125-1.055-.387-2.008-1.238-.742-.66-1.242-1.48-1.387-1.73-.145-.25-.016-.383.109-.508.113-.113.25-.293.375-.438.125-.145.164-.25.25-.414.082-.168.043-.312-.02-.438-.062-.125-.562-1.355-.77-1.855-.203-.484-.41-.418-.562-.426l-.477-.008c-.168 0-.438.062-.668.312-.23.25-.875.855-.875 2.086s.895 2.418 1.02 2.586c.125.164 1.762 2.691 4.27 3.773.598.258 1.062.41 1.426.527.598.191 1.145.164 1.574.102.48-.07 1.477-.605 1.688-1.188.207-.586.207-1.086.145-1.188-.062-.105-.227-.168-.477-.293Z" />
          </svg>
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
