"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { HairlineRule } from "@/components/common/HairlineRule";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Runtime Error]:", error);
  }, [error]);

  return (
    <>
      <Navigation isRevealed={true} />

      <main className="relative z-10 w-full bg-black min-h-screen text-white pt-32 sm:pt-36 md:pt-44 pb-24 flex flex-col justify-center overflow-x-clip">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-800/40 text-red-300 text-xs font-mono-custom uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>RUNTIME EXCEPTION // RECOVERY MODE</span>
          </div>

          <h1 className="font-gambarino text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.02] max-w-4xl mb-6">
            Something interrupted the frame render.
          </h1>

          <p className="font-mono-custom text-sm sm:text-base text-[#a1a1a1] max-w-2xl leading-relaxed mb-10">
            An unexpected client or server error occurred while loading this
            view. You can retry rendering the current route or return safely to
            the portfolio index.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-14">
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 rounded-full bg-white text-black font-sans font-medium text-xs sm:text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Try Again ↻
            </button>

            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-white/8 hover:bg-white/15 text-white font-mono-custom text-xs sm:text-sm border border-white/12 transition-colors"
            >
              ← Return Home
            </Link>

            <Link
              href="/contact-us"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-[#aaa] hover:text-white font-mono-custom text-xs sm:text-sm border border-white/10 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          <HairlineRule className="mb-6" />

          {error.digest && (
            <p className="font-mono-custom text-xs text-[#666]">
              Diagnostic Reference ID: <span className="text-[#999]">{error.digest}</span>
            </p>
          )}
        </div>
      </main>
    </>
  );
}
