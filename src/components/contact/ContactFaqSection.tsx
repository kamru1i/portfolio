"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { SectionBadge } from "@/components/common/SectionBadge";

interface ContactFaqItem {
  id: string;
  question: string;
  answer: string;
}

const CONTACT_FAQS: ContactFaqItem[] = [
  {
    id: "enquiry-info",
    question: "What information should I include in a project enquiry?",
    answer:
      "Share a brief summary of your project, target deliverables (such as video runtime, aspect ratios, website scope, or platform requirements), your preferred timeline, and any reference links or raw assets you already have.",
  },
  {
    id: "services-scope",
    question: "Which services can I contact you about?",
    answer:
      "You can reach out for commercial video editing and post-production (including audio cleanup and color grading), AI-assisted video and content creation, web development (React.js, Next.js, TypeScript, MERN), WordPress and Elementor Pro customization, and office IT or website infrastructure support.",
  },
  {
    id: "video-and-web",
    question: "Can I enquire about both video editing and web development?",
    answer:
      "Yes. Many clients collaborate on both polished video assets and the responsive web interface or WordPress platform where those assets live, creating a cohesive digital brand experience.",
  },
  {
    id: "existing-footage",
    question: "Can you work with existing footage and client-provided assets?",
    answer:
      "Absolutely. I regularly handle client-provided raw footage, audio recordings, screen captures, brand graphics, and UI/UX mockups in Figma.",
  },
  {
    id: "ai-assisted-video",
    question: "Can you help with AI-assisted video and content creation?",
    answer:
      "Yes. I combine AI video and visual generation tools—including Gemini Omni Flash, Google Veo, ChatGPT Sora, Kling 3.0, Google Nano Banana, ChatGPT Image 2, and Higgsfield Soul—with post-production editing in Adobe Premiere Pro, DaVinci Resolve, and CapCut.",
  },
  {
    id: "audio-enhancement",
    question: "Do you provide audio enhancement and noise reduction?",
    answer:
      "Yes. I perform noise cancellation, background noise reduction, voice cleanup, sound synchronization, volume balancing, SFX and music integration, and basic sound mixing using Adobe Podcast, Audacity, Adobe Premiere Pro, and DaVinci Resolve.",
  },
  {
    id: "web-wordpress",
    question: "Can I discuss a web development or WordPress project?",
    answer:
      "Yes. I build responsive web applications using React.js, Next.js, TypeScript, Tailwind CSS, Node.js, and Supabase/MongoDB, as well as customized WordPress websites using Elementor and Elementor Pro with SSL, backups, and security maintenance.",
  },
  {
    id: "what-happens-next",
    question: "What happens after I submit a contact enquiry?",
    answer:
      "I review your project brief within 24 to 48 hours and respond with clarifying questions, availability, and an initial scope alignment to schedule a discovery call if needed.",
  },
];

export function ContactFaqSection() {
  // Start with first question open for immediate discovery
  const [openIds, setOpenIds] = useState<string[]>([CONTACT_FAQS[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full select-none pb-28 md:pb-36">
      {/* Centered Section Header */}
      <div className="w-full flex flex-col items-center text-center mb-12 sm:mb-16">
        <SectionBadge label="FAQ" />

        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mt-4 mb-3">
          Have questions? Check out the FAQs
        </h2>

        <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] max-w-xl mx-auto leading-relaxed">
          Everything you need to know about working together, workflow, and deliverables.
        </p>
      </div>

      {/* Accordion List */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3.5 sm:gap-4">
        {CONTACT_FAQS.map((item, index) => {
          const isOpen = openIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group rounded-2xl bg-[#161616] hover:bg-[#1b1b1b] border border-white/10 hover:border-white/20 transition-colors duration-200 shadow-md"
            >
              {/* Accessible Question Button */}
              <button
                type="button"
                id={`contact-faq-btn-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`contact-faq-panel-${item.id}`}
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-2xl"
              >
                <h3 className="font-sans text-base sm:text-lg font-medium text-white tracking-tight group-hover:text-white/95">
                  {item.question}
                </h3>

                <div className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center shrink-0 text-white font-mono-custom text-sm group-hover:bg-white/12 transition-colors">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>

              {/* Answer Content Animated (always in DOM for SEO crawlability) */}
              <motion.div
                id={`contact-faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`contact-faq-btn-${item.id}`}
                aria-hidden={!isOpen}
                initial={false}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  height: isOpen ? "auto" : 0,
                }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-mono-custom text-sm sm:text-[15px] text-[#a1a1a1] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
