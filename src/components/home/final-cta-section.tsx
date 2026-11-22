"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { ArrowRight, Compass } from "lucide-react";

export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#172943] text-[#F7F2E9] py-14 sm:py-20 lg:py-24 border-t border-white/10 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#BC9059]/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BC9059]/30 bg-[#BC9059]/10 px-4 py-1 text-xs font-sans font-semibold text-[#DFBE8F]">
            <Compass className="w-3.5 h-3.5 text-[#BC9059]" />
            <span>ADHIKAAR AI Civic Discovery</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#F7F2E9] tracking-tight leading-[1.15]">
            {t.finalCta.heading}
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#A3B8CC] leading-relaxed max-w-lg mx-auto">
            {t.finalCta.desc}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            {/* Distinctly visible brushed gold primary CTA labeled Explore Schemes */}
            <Link
              href="/app/discover"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C59D65] via-[#BC9059] to-[#A87E4B] hover:brightness-105 active:scale-[0.98] text-[#172943] px-8 py-3.5 font-sans text-sm sm:text-base font-bold transition-all shadow-[0_6px_24px_rgba(185,141,87,0.35)] hover:shadow-[0_8px_30px_rgba(185,141,87,0.5)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{t.finalCta.exploreBtn}</span>
            </Link>

            {/* Secondary Clear Outline CTA */}
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full border border-[#F7F2E9]/30 hover:border-[#F7F2E9]/60 hover:bg-white/5 text-[#F7F2E9] px-7 py-3.5 font-sans text-sm sm:text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{t.finalCta.getStartedBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
