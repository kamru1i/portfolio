"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      "You can reach out for commercial video editing and post-production, AI-assisted video generation and compositing, sound design and audio cleanup, full-stack web engineering (React, Next.js, TypeScript), WordPress development, and enterprise IT infrastructure management.",
  },
  {
    id: "video-and-web",
    question: "Can I enquire about both video editing and web development?",
    answer:
      "Yes. Many clients collaborate on both cinematic video assets and the interactive web interface or portfolio platform where those assets live, creating a unified and cohesive digital brand experience.",
  },
  {
    id: "existing-footage",
    question: "Can you work with existing footage and client-provided assets?",
    answer:
      "Absolutely. I regularly handle client-provided raw footage (Log, 4K, multicam), audio stems, screen recordings, brand guidelines, and UI design mockups in Figma.",
  },
  {
    id: "ai-assisted-video",
    question: "Can you help with AI-assisted video and content creation?",
    answer:
      "Yes. I integrate state-of-the-art AI video generation models (including Google Veo, Kling, and Runway) with traditional post-production workflows in DaVinci Resolve and Premiere Pro to create cutting-edge visuals.",
  },
  {
    id: "audio-enhancement",
    question: "Do you provide audio enhancement and noise reduction?",
    answer:
      "Yes. I clean dialogue tracks, remove background hiss, hum, and room reverb, equalize voice dynamics, and compose atmospheric soundscapes using dedicated audio restoration tools.",
  },
  {
    id: "web-wordpress",
    question: "Can I discuss a web development or WordPress project?",
    answer:
      "Yes. I build custom, high-performance web applications using Next.js, React, TypeScript, and Tailwind CSS, as well as production-ready WordPress sites with SSL, CDN caching, and custom theme engineering.",
  },
  {
    id: "what-happens-next",
    question: "What happens after I submit a contact enquiry?",
    answer:
      "I review your project brief within 24 to 48 hours and respond with clarifying questions, availability, and an initial scope alignment to schedule a discovery call if needed.",
  },
];

export function ContactFaqSection() {
  // Start with first question open for immediate discovery matching Aurexa
  const [openIds, setOpenIds] = useState<string[]>([CONTACT_FAQS[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full select-none pb-28 md:pb-36">
      {/* Centered Section Header matching Aurexa reference */}
      <div className="w-full flex flex-col items-center text-center mb-12 sm:mb-16">
        <SectionBadge label="FAQ" />

        <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mt-4 mb-3">
          Have questions? Check out the FAQs
        </h2>

        <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] max-w-xl mx-auto leading-relaxed">
          Everything you need to know about working together, workflow, and deliverables.
        </p>
      </div>

      {/* Accordion List matching Aurexa panel styling */}
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
              onClick={() => toggleItem(item.id)}
              className="group rounded-2xl bg-[#161616] hover:bg-[#1b1b1b] border border-white/10 hover:border-white/20 p-5 sm:p-6 cursor-pointer transition-colors duration-200 shadow-md"
            >
              {/* Question Row */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-sans text-base sm:text-lg font-medium text-white tracking-tight group-hover:text-white/95">
                  {item.question}
                </h3>

                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center flex-shrink-0 text-white font-mono-custom text-sm group-hover:bg-white/[0.12] transition-colors">
                  {isOpen ? "−" : "+"}
                </div>
              </div>

              {/* Answer Content Animated */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-white/10">
                      <p className="font-mono-custom text-sm sm:text-[15px] text-[#a1a1a1] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
