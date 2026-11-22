"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PreflightCard } from "@/components/home/preflight-card";
import { useLanguage } from "@/lib/language-context";
import { Search, Mic, ShieldCheck, ArrowRight } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const isListening = false;
  const voiceMessage = "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/app/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/app/discover");
    }
  };

  const toggleVoiceSearch = () => router.push("/app/assistant");

  return (
    <section className="hero relative w-full flex-1 overflow-hidden bg-[#172943] text-[#F7F2E9] flex flex-col justify-between">
      {/* High-Resolution Pristine Classical Indian Palace Archway Visual — PRESERVED EXACTLY */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/landing-archway-hq.jpg"
          alt="Classical Indian Palace Archway"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-center"
        />
        {/* Subtle left-side atmospheric gradient for ultrawide display continuity */}
        <div className="hidden 2xl:block absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#172943] via-[#172943]/80 to-transparent z-[1]" />
      </div>

      {/* Two-Column Responsive Content Layout */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Clean left alignment, responsive max width   */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[58%] xl:w-[54%] 2xl:w-[50%] max-w-[860px] flex flex-col justify-center py-8 sm:py-10 lg:py-6 pl-[clamp(24px,4.5vw,88px)] pr-4 sm:pr-8 z-10 lg:-translate-y-6 text-left items-start">
          {/* Eyebrow Kicker with Fine Gold Rule */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#F7F2E9]/90 uppercase">
              {t.hero.eyebrow}
            </span>
            <span className="h-[1px] w-12 sm:w-16 bg-[#BC9059]" />
          </div>

          {/* Editorial Display Headline: Fraunces with Fraunces Italic Flourish */}
          <h1 className="font-display font-medium text-[clamp(36px,7.5vw,52px)] sm:text-[clamp(52px,4.8vw,64px)] lg:text-[clamp(64px,4vw,84px)] leading-[1.08] tracking-[-0.025em] text-[#F7F2E9] mt-6 sm:mt-7 text-left">
            <span className="block">{t.hero.h1Line1}</span>
            <span className="block">{t.hero.h1Line2}</span>
            <span className="block italic text-[#FFFDF8]">{t.hero.h1Line3}</span>
          </h1>

          {/* Refined Editorial Subtitle with Manrope, 19-20px desktop, line-height 1.55, max-w 720px */}
          <p className="font-sans text-base sm:text-lg lg:text-[19px] xl:text-[20px] text-[#F7F2E9]/90 leading-[1.55] max-w-[720px] font-normal mt-7 sm:mt-8 text-left">
            {t.hero.subtitle}
          </p>

          {/* Search Bar & Prominent Brushed Gold CTA Button */}
          <form onSubmit={handleSearch} className="w-full max-w-[820px] mt-7 sm:mt-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Search Pill Input: height 60px (mobile) to 64px (desktop) */}
              <div className="w-full sm:flex-1 min-w-0 h-[60px] sm:h-[64px] shrink-0 rounded-full bg-white px-5 sm:px-6 flex items-center gap-3 border border-[#657E91]/20 shadow-[0_8px_30px_rgba(10,25,45,0.25)] transition-all focus-within:ring-2 focus-within:ring-[#BC9059]/60">
                {/* Search Magnifying Glass Icon */}
                <Search className="w-5 h-5 text-[#657E91] shrink-0" />

                {/* Input Field */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="flex-1 min-w-0 bg-transparent font-sans text-sm sm:text-base text-[#172943] placeholder:text-[#657E91] font-normal focus:outline-none"
                  aria-label="Search schemes or describe your needs"
                />

                {/* Vertical Divider */}
                <span className="h-6 w-[1px] bg-[#657E91]/25 shrink-0" />

                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={`p-2 rounded-full transition-all shrink-0 cursor-pointer ${
                    isListening
                      ? "bg-[#A95D49] text-white animate-pulse"
                      : "text-[#657E91] hover:text-[#172943] hover:bg-[#F7F2E9]/60"
                  }`}
                  title="Voice search in English, Hindi, or Telugu"
                  aria-label="Speak query using voice search"
                  aria-pressed={isListening}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* Primary CTA Button: Luminous Warm Brushed-Gold, height 60-64px, width ~220px */}
              <button
                type="submit"
                className="w-full sm:w-[220px] h-[60px] sm:h-[64px] shrink-0 rounded-full bg-gradient-to-r from-[#C59D65] via-[#BC9059] to-[#A87E4B] hover:brightness-105 active:scale-[0.98] text-[#172943] px-6 font-sans text-sm sm:text-base font-bold transition-all shadow-[0_6px_20px_rgba(185,141,87,0.38)] hover:shadow-[0_8px_24px_rgba(185,141,87,0.5)] flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span>{t.hero.findBenefits}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Privacy Trust Note: Shared exact left alignment */}
            <div className="flex items-center gap-2 text-xs sm:text-[13px] font-sans text-[#F7F2E9]/85 font-medium mt-4">
              <ShieldCheck className="w-4 h-4 text-[#BC9059] shrink-0" />
              <span>{t.hero.noIdRequired}</span>
            </div>

            {voiceMessage && (
              <p className="mt-2 text-xs text-[#F7F2E9]/80 font-sans" role="status">
                {voiceMessage}
              </p>
            )}
          </form>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Available Across India Tagline & Preflight */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[42%] xl:w-[46%] 2xl:w-[50%] relative flex flex-col justify-end overflow-hidden min-h-[300px] sm:min-h-[380px] lg:min-h-0 pointer-events-none">
          {/* Top Right Tagline: AVAILABLE ACROSS INDIA */}
          <div className="absolute top-6 sm:top-8 right-[clamp(24px,4vw,88px)] z-20 text-right hidden sm:block pointer-events-auto">
            <div className="flex flex-col items-end">
              <span className="font-sans text-[11px] font-bold tracking-[0.28em] text-[#F7F2E9]/95 uppercase drop-shadow-sm">
                {t.hero.availableAcrossIndia1}
              </span>
              <span className="font-sans text-[11px] font-bold tracking-[0.28em] text-[#F7F2E9]/95 uppercase drop-shadow-sm mt-0.5">
                {t.hero.availableAcrossIndia2}
              </span>
              <div className="w-20 h-[1.5px] bg-[#BC9059] mt-1.5" />
            </div>
          </div>

          {/* Application Preflight Card: Elevated over architectural visual */}
          <div className="hidden sm:block absolute bottom-12 sm:bottom-16 xl:bottom-20 right-[clamp(24px,4vw,88px)] z-20 w-[320px] sm:w-[335px] xl:w-[350px] pointer-events-auto">
            <PreflightCard />
          </div>
        </div>
      </div>

      {/* Mobile-Only Preflight Card: Cleanly stacked below */}
      <div className="block sm:hidden w-full px-[clamp(24px,4.5vw,88px)] pb-8 pt-2 z-20 bg-[#172943]/90">
        <PreflightCard />
      </div>
    </section>
  );
}
