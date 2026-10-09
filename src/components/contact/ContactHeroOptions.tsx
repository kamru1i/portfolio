"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface ContactOption {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
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
        "Reach out directly for quick questions, project inquiries, or collaboration opportunities.",
      actionText: "Start enquiry",
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
            {opt.isExternal ? (
              <a
                href={opt.actionHref}
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
