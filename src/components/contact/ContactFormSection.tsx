"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { TalkWithKamrulCard } from "@/components/common/TalkWithKamrulCard";

interface FormDataState {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  details: string;
}

interface FormErrorsState {
  name?: string;
  email?: string;
  projectType?: string;
  details?: string;
}

const SERVICE_OPTIONS = [
  "Video Editing & Post-Production",
  "Audio Enhancement & Sound Design",
  "AI-Assisted Video & Content Creation",
  "Front-End Web Development (React / Next.js)",
  "WordPress & CMS Engineering",
  "IT Support & Cloud Infrastructure",
  "Other / Mixed Project",
];

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Discuss upon scope alignment",
];

const TIMELINE_OPTIONS = [
  "Immediate / Urgent (within 7 days)",
  "1 to 2 weeks",
  "2 to 4 weeks",
  "1 to 2 months",
  "Flexible / Ongoing retainer",
];

export function ContactFormSection({ initialService }: { initialService?: string }) {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    company: "",
    projectType: initialService || SERVICE_OPTIONS[0],
    budgetRange: BUDGET_OPTIONS[1],
    timeline: TIMELINE_OPTIONS[1],
    details: "",
  });

  const [errors, setErrors] = useState<FormErrorsState>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrorsState = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.projectType.trim()) {
      newErrors.projectType = "Please select a project type.";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Please share a brief summary of your project.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to deliver message at this time.");
      }

      setIsSubmitted(true);
    } catch {
      // If the API endpoint encounters any failure, provide direct fallback
      setSubmitError(
        "Direct server delivery is momentarily unavailable. You can send your pre-filled brief directly via email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`Project Enquiry: ${formData.projectType} — ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Company: ${formData.company || "N/A"}\n` +
      `Service / Project Type: ${formData.projectType}\n` +
      `Budget Range: ${formData.budgetRange}\n` +
      `Timeline: ${formData.timeline}\n\n` +
      `Project Brief / Details:\n${formData.details}\n`
    );
    return `mailto:${PORTFOLIO_DATA.brand.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div
      id="get-in-touch"
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-28 md:mb-36 scroll-mt-28"
    >
      {/* Left Column: Get In Touch Title & Profile Badge */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="lg:col-span-5 flex flex-col justify-start"
      >
        <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">
          Get in touch
        </h2>

        <div className="space-y-3 mb-10 max-w-md">
          <h3 className="font-sans text-xl sm:text-2xl font-normal text-white">
            Ready to elevate your project?
          </h3>
          <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed">
            Contact me, and let&apos;s explore how we can bring your video productions, web interfaces, and digital systems to life.
          </p>
        </div>

        {/* Talk with Kamrul Profile Card matching reference (without CTA button) */}
        <TalkWithKamrulCard showButton={false} />
      </motion.div>

      {/* Right Column: Aurexa-Style Interactive Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="lg:col-span-7 w-full bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
      >
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-10 flex flex-col items-start space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-mono-custom">
                ✓
              </div>

              <div>
                <h3 className="font-sans text-2xl sm:text-3xl font-medium text-white mb-2">
                  Enquiry Prepared Successfully
                </h3>
                <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] leading-relaxed max-w-lg">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your project brief has been logged. I review client submissions daily and will respond to{" "}
                  <strong className="text-white">{formData.email}</strong> within 24–48 hours.
                </p>
              </div>

              <div className="w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                <a
                  href={generateMailtoUrl()}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 transition-all shadow-md group"
                >
                  <span>Open in Email Client (Backup Copy)</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      company: "",
                      projectType: SERVICE_OPTIONS[0],
                      budgetRange: BUDGET_OPTIONS[1],
                      timeline: TIMELINE_OPTIONS[1],
                      details: "",
                    });
                  }}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white font-sans text-sm transition-all"
                >
                  Send another message
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
              {/* Row 1: Budget Range & Timeline Selectors matching Aurexa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budgetRange" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                    Budget range *
                  </label>
                  <select
                    id="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full bg-[#141414] border-b border-white/20 focus:border-white text-white py-2.5 px-1 font-sans text-sm outline-none transition-colors cursor-pointer rounded-t"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#181818] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                    Timeline *
                  </label>
                  <select
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-[#141414] border-b border-white/20 focus:border-white text-white py-2.5 px-1 font-sans text-sm outline-none transition-colors cursor-pointer rounded-t"
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#181818] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Your Name */}
              <div>
                <label htmlFor="name" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                  Your name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full bg-transparent border-b ${
                    errors.name ? "border-rose-500" : "border-white/20 focus:border-white"
                  } text-white py-2.5 px-1 font-sans text-sm sm:text-base placeholder:text-[#555] outline-none transition-colors`}
                />
                {errors.name && (
                  <p className="mt-1.5 font-mono-custom text-xs text-rose-400">{errors.name}</p>
                )}
              </div>

              {/* Row 3: Email Address */}
              <div>
                <label htmlFor="email" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                  Email address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full bg-transparent border-b ${
                    errors.email ? "border-rose-500" : "border-white/20 focus:border-white"
                  } text-white py-2.5 px-1 font-sans text-sm sm:text-base placeholder:text-[#555] outline-none transition-colors`}
                />
                {errors.email && (
                  <p className="mt-1.5 font-mono-custom text-xs text-rose-400">{errors.email}</p>
                )}
              </div>

              {/* Row 4: Company Name (Optional) */}
              <div>
                <label htmlFor="company" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                  Company name (optional)
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Acme Studio / Independent"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white text-white py-2.5 px-1 font-sans text-sm sm:text-base placeholder:text-[#555] outline-none transition-colors"
                />
              </div>

              {/* Row 5: Project Type / Service Interested In */}
              <div>
                <label htmlFor="projectType" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                  Project type / Service *
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-[#141414] border-b border-white/20 focus:border-white text-white py-2.5 px-1 font-sans text-sm outline-none transition-colors cursor-pointer rounded-t"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#181818] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 6: Project Details (Brief) */}
              <div>
                <label htmlFor="details" className="block font-sans text-xs sm:text-sm text-[#888] mb-1.5">
                  Project details / Creative brief *
                </label>
                <textarea
                  id="details"
                  rows={4}
                  required
                  placeholder="Provide an overview of your project, target deliverables, footage/asset status, and specific goals..."
                  value={formData.details}
                  onChange={(e) => {
                    setFormData({ ...formData, details: e.target.value });
                    if (errors.details) setErrors({ ...errors, details: undefined });
                  }}
                  className={`w-full bg-transparent border-b ${
                    errors.details ? "border-rose-500" : "border-white/20 focus:border-white"
                  } text-white py-2.5 px-1 font-sans text-sm sm:text-base placeholder:text-[#555] outline-none transition-colors resize-y`}
                />
                {errors.details && (
                  <p className="mt-1.5 font-mono-custom text-xs text-rose-400">{errors.details}</p>
                )}
              </div>

              {/* Optional Error Notice */}
              {submitError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono-custom text-xs leading-relaxed">
                  <p className="mb-2">{submitError}</p>
                  <a
                    href={generateMailtoUrl()}
                    className="inline-flex items-center gap-1.5 text-white underline hover:no-underline font-medium"
                  >
                    Click here to send pre-filled email draft directly →
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#1c1c1c] hover:bg-[#282828] border border-white/15 hover:border-white/30 text-white font-sans text-sm font-medium transition-all group cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send inquiry</span>
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
