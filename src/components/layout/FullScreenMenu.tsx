"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects & Works", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Milestones", href: "/#recognitions" },
  { label: "Curriculum Vitae", href: "/cv" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact-us" },
];

export function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  // ESC key listener to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll non-destructively
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onClose();
    if (href.startsWith("#") || href.startsWith("/#")) {
      const hash = href.startsWith("/#") ? href.slice(1) : href;
      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        const lenis = (window as unknown as { lenis?: { scrollTo: (target: Element | string, options?: { offset?: number; duration?: number }) => void } }).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(element, { offset: -80, duration: 1.2 });
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
        window.history.pushState(null, "", hash);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fullscreen-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl overflow-y-auto text-white flex flex-col justify-between"
        >
          {/* Main Content Area */}
          <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-8 flex-1 flex flex-col justify-between">
            {/* Grid Split: Links on Left, Direct Contact on Right */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-8">
              {/* Left Column: Oversized Editorial Navigation Links */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
                className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4"
              >
                {MENU_LINKS.map((item, index) => {
                  const isExternal = item.href.startsWith("mailto:");
                  return (
                    <motion.div
                      key={item.label}
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.5,
                            ease: [0.25, 1, 0.5, 1],
                          },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      {isExternal ? (
                        <a
                          href={item.href}
                          onClick={() => onClose()}
                          className="group inline-flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-200"
                        >
                          <span className="font-mono-custom text-xs sm:text-sm text-[#777] group-hover:text-emerald-400 transition-colors">
                            0{index + 1}
                          </span>
                          <span className="text-4xl sm:text-5xl md:text-6xl font-gambarino tracking-tight group-hover:translate-x-2 transition-transform duration-200">
                            {item.label}
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={(e) => handleLinkClick(e, item.href)}
                          className="group inline-flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-200"
                        >
                          <span className="font-mono-custom text-xs sm:text-sm text-[#777] group-hover:text-emerald-400 transition-colors">
                            0{index + 1}
                          </span>
                          <span className="text-4xl sm:text-5xl md:text-6xl font-gambarino tracking-tight group-hover:translate-x-2 transition-transform duration-200">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right Column: Direct Contact Details & Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="lg:col-span-5 flex flex-col space-y-7 pl-0 lg:pl-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0"
              >
                {/* Email */}
                <div>
                  <p className="text-[#888] font-mono-custom text-[11px] uppercase tracking-widest mb-1.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${PORTFOLIO_DATA.brand.email}`}
                    className="text-lg sm:text-xl md:text-2xl text-white font-medium hover:text-white/80 transition-colors break-all"
                  >
                    {PORTFOLIO_DATA.brand.email}
                  </a>
                </div>

                {/* Phone & WhatsApp Icon */}
                <div>
                  <p className="text-[#888] font-mono-custom text-[11px] uppercase tracking-widest mb-1.5">
                    Phone
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${PORTFOLIO_DATA.brand.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-lg sm:text-xl md:text-2xl text-white font-medium hover:text-white/80 transition-colors"
                    >
                      {PORTFOLIO_DATA.brand.phone}
                    </a>
                    <a
                      href={PORTFOLIO_DATA.brand.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                      title="Open in WhatsApp"
                      className="w-9 h-9 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/35 text-[#25D366] flex items-center justify-center transition-all hover:scale-110 shrink-0"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.461 3.484 1.336 5.008L2 22l5.156-1.352a9.927 9.927 0 0 0 4.875 1.281h.004c5.512 0 9.965-4.453 9.965-9.969 0-2.664-1.035-5.168-2.918-7.051A9.907 9.907 0 0 0 12.031 2Zm0 18.281h-.004a8.268 8.268 0 0 1-4.215-1.152l-.301-.18-3.062.805.816-2.984-.199-.313a8.252 8.252 0 0 1-1.266-4.488c0-4.57 3.719-8.289 8.293-8.289 2.215 0 4.297.863 5.863 2.43a8.238 8.238 0 0 1 2.426 5.859c0 4.574-3.719 8.293-8.351 8.312Zm4.547-6.203c-.25-.125-1.477-.727-1.703-.812-.23-.082-.395-.125-.563.125-.164.25-.645.812-.789.977-.145.168-.289.188-.539.062-.25-.125-1.055-.387-2.008-1.238-.742-.66-1.242-1.48-1.387-1.73-.145-.25-.016-.383.109-.508.113-.113.25-.293.375-.438.125-.145.164-.25.25-.414.082-.168.043-.312-.02-.438-.062-.125-.562-1.355-.77-1.855-.203-.484-.41-.418-.562-.426l-.477-.008c-.168 0-.438.062-.668.312-.23.25-.875.855-.875 2.086s.895 2.418 1.02 2.586c.125.164 1.762 2.691 4.27 3.773.598.258 1.062.41 1.426.527.598.191 1.145.164 1.574.102.48-.07 1.477-.605 1.688-1.188.207-.586.207-1.086.145-1.188-.062-.105-.227-.168-.477-.293Z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[#888] font-mono-custom text-[11px] uppercase tracking-widest mb-1.5">
                    Location
                  </p>
                  <p className="text-base sm:text-lg text-[#ccc]">
                    {PORTFOLIO_DATA.brand.location}
                  </p>
                </div>

                {/* Availability Beacon */}
                <div className="pt-2 flex items-center gap-2.5 font-mono-custom text-[13px] text-[#b3b3b3]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>Available for Projects</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Bar: Copyright & Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-custom text-[12px] text-[#777]"
            >
              <span>{PORTFOLIO_DATA.footer.copyright}</span>
              <div className="flex items-center gap-6 font-gambarino text-[18px] text-white">
                {PORTFOLIO_DATA.brand.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="hover-underline-link hover:text-white transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
