"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface ContactOption {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  whatsappHref?: string;
  isExternal?: boolean;
  icon: React.ReactNode;
}

export function ContactHeroOptions() {
  const options: ContactOption[] = [
    {
      id: "quick-discovery",
      title: "Quick discovery",
      description:
        "Book a short intro call to discuss your project goals, timelines, and creative direction.",
      actionText: "Schedule intro",
      actionHref: "#get-in-touch",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      id: "start-conversation",
      title: "Start a conversation",
      description:
        "Reach out directly by phone or WhatsApp for quick questions, project inquiries, or collaboration.",
      actionText: PORTFOLIO_DATA.brand.phone,
      actionHref: `tel:${PORTFOLIO_DATA.brand.phone.replace(/[^0-9+]/g, "")}`,
      whatsappHref: PORTFOLIO_DATA.brand.whatsappUrl,
      isExternal: true,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "send-email",
      title: "Send an email",
      description:
        "Prefer email? Send your project brief directly and I'll respond within 24–48 hours.",
      actionText: PORTFOLIO_DATA.brand.email,
      actionHref: `mailto:${PORTFOLIO_DATA.brand.email}`,
      isExternal: true,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      ),
    },
    {
      id: "studio-location",
      title: "Location & base",
      description:
        "Working remotely with clients worldwide while collaborating across different time zones.",
      actionText: "Chattogram, BD • Worldwide",
      actionHref: "#get-in-touch",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-24 md:mb-32">
      {options.map((opt, index) => (
        <motion.div
          key={opt.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.6,
            delay: index * 0.08,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="group relative rounded-2xl bg-[#0e0e0e]/90 hover:bg-[#151515] border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        >
          {/* Top Row: Icon */}
          <div className="mb-6 flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
              {opt.icon}
            </div>
          </div>

          {/* Center Details */}
          <div className="flex-1 flex flex-col justify-start">
            <h3 className="font-sans text-lg sm:text-xl font-medium tracking-tight text-white mb-2">
              {opt.title}
            </h3>
            <p className="font-mono-custom text-xs sm:text-[13px] text-[#a1a1a1] leading-relaxed mb-6">
              {opt.description}
            </p>
          </div>

          {/* Bottom Hairline Rule and Action */}
          <div className="w-full pt-4 border-t border-white/10 mt-auto">
            {opt.whatsappHref ? (
              <div className="flex items-center justify-between w-full font-mono-custom text-xs sm:text-sm">
                <a
                  href={opt.actionHref}
                  className="text-white/90 hover:text-white transition-colors truncate pr-2"
                >
                  {opt.actionText}
                </a>
                <a
                  href={opt.whatsappHref}
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
            ) : opt.isExternal ? (
              <a
                href={opt.actionHref}
                target={opt.actionHref.startsWith("http") ? "_blank" : undefined}
                rel={opt.actionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-between w-full font-mono-custom text-xs sm:text-sm text-white/90 hover:text-white transition-colors group/link"
              >
                <span className="truncate pr-2">{opt.actionText}</span>
                <span className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-[#888] group-hover/link:text-white">
                  ↗
                </span>
              </a>
            ) : (
              <a
                href={opt.actionHref}
                className="inline-flex items-center justify-between w-full font-mono-custom text-xs sm:text-sm text-white/90 hover:text-white transition-colors group/link"
              >
                <span className="truncate pr-2">{opt.actionText}</span>
                <span className="group-hover/link:translate-x-1 transition-transform text-[#888] group-hover/link:text-white">
                  →
                </span>
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
