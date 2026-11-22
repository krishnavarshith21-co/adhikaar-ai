"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, Shield } from "lucide-react";

interface AuthSplitShellProps {
  children: React.ReactNode;
  sectionLabel: string;
  heading: string;
  subtitle: string;
}

export function AuthSplitShell({
  children,
  sectionLabel,
  heading,
  subtitle,
}: AuthSplitShellProps) {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to /app dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/app");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between bg-[#0F1E2E]">
      {/* ================================================================= */}
      {/* 1. FULL-BLEED ARCHITECTURAL BACKDROP (100% UNCROPPED NATURAL ASPECT) */}
      {/* ================================================================= */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/auth-archway.jpg')",
        }}
        aria-hidden="true"
      />

      {/* Subtle depth vignette protecting contrast while preserving 100% crisp details */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none z-0" />

      {/* ================================================================= */}
      {/* 2. TOP FLOATING LUXURY BRAND & NAVIGATION BAR                     */}
      {/* ================================================================= */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 py-6 flex items-center justify-between">
        {/* Brand Crest & Monogram */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] rounded-sm"
          aria-label="Adhikaar AI Home"
        >
          {/* Sacred Lotus Geometry Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#172943]/80 border border-[#BC9059]/60 flex items-center justify-center backdrop-blur-md transition-all group-hover:border-[#DFBE8F] group-hover:bg-[#172943]/95 shadow-lg">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#DFBE8F]"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z" />
              <path d="M2 12C2 12 7 9 12 9C17 9 22 12 22 12C22 12 17 15 12 15C7 15 2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" fill="#BC9059" fillOpacity="0.5" />
            </svg>
          </div>
          <span className="font-display text-lg sm:text-xl tracking-[0.18em] font-bold text-white uppercase transition-colors group-hover:text-[#DFBE8F] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            ADHIKAAR AI
          </span>
        </Link>

        {/* Floating Top Control Pill (Language Switcher & Home Link) */}
        <div className="flex items-center gap-3 sm:gap-4 bg-[#F7F2E9]/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-full border border-[#BC9059]/40 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          {/* 3-Language Segmented Switcher */}
          <div
            className="flex items-center gap-1.5 text-xs font-sans"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              data-lang="en"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`transition-all pb-0.5 cursor-pointer ${
                language === "en"
                  ? "font-bold text-[#172943] border-b-2 border-[#BC9059]"
                  : "text-[#657E91] hover:text-[#172943]"
              }`}
            >
              EN
            </button>
            <span className="text-[#657E91]/30">|</span>
            <button
              type="button"
              data-lang="hi"
              onClick={() => setLanguage("hi")}
              aria-pressed={language === "hi"}
              className={`transition-all pb-0.5 cursor-pointer ${
                language === "hi"
                  ? "font-bold text-[#172943] border-b-2 border-[#BC9059]"
                  : "text-[#657E91] hover:text-[#172943]"
              }`}
            >
              हिन्दी
            </button>
            <span className="text-[#657E91]/30">|</span>
            <button
              type="button"
              data-lang="te"
              onClick={() => setLanguage("te")}
              aria-pressed={language === "te"}
              className={`transition-all pb-0.5 cursor-pointer ${
                language === "te"
                  ? "font-bold text-[#172943] border-b-2 border-[#BC9059]"
                  : "text-[#657E91] hover:text-[#172943]"
              }`}
            >
              తెలుగు
            </button>
          </div>

          <span className="hidden sm:inline-block text-[#657E91]/30">|</span>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-[#172943] hover:text-[#BC9059] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.auth.backToHome}</span>
          </Link>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 3. MAIN WORKSPACE: FLOATING LUXURY SANCTUARY                      */}
      {/* ================================================================= */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-4 sm:py-8 my-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* LEFT COLUMN: Ultra-Luxury Warm Linen Card */}
        <div className="w-full max-w-[460px] bg-[#F7F2E9]/97 backdrop-blur-xl rounded-3xl p-7 sm:p-9 xl:p-10 border border-[#BC9059]/45 shadow-[0_24px_64px_-12px_rgba(10,20,35,0.6),0_0_0_1px_rgba(185,141,87,0.3)] transition-all">
          {/* Eyebrow Label */}
          <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#BC9059] mb-2">
            {sectionLabel}
          </p>

          {/* Heading */}
          <h1 className="font-display text-2xl sm:text-[32px] font-semibold text-[#172943] tracking-tight leading-[1.14] mb-2">
            {heading}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm text-[#657E91] leading-relaxed mb-6 font-normal">
            {subtitle}
          </p>

          {/* Form Content */}
          {children}
        </div>

        {/* RIGHT COLUMN: Completely Unobstructed Architectural View with Floating Elegant Badge */}
        <div className="hidden lg:flex flex-col items-end justify-end self-end max-w-md text-right select-none pb-2">
          {/* Poetic Civic Badge floating over lower floor */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#172943]/70 backdrop-blur-md border border-[#BC9059]/40 text-xs font-sans text-[#E2ECF5] shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <Shield className="w-3.5 h-3.5 text-[#DFBE8F] shrink-0" />
            <span>{t.auth.independentPlatform}</span>
          </div>
        </div>
      </main>

      {/* ================================================================= */}
      {/* 4. BOTTOM CIVIC FOOTER                                            */}
      {/* ================================================================= */}
      <footer className="relative z-10 w-full px-6 py-4 flex items-center justify-between text-[11px] font-sans text-[#E2ECF5]/80 max-w-7xl mx-auto">
        <span>© 2026 ADHIKAAR AI. Pan-India Civic Intelligence.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[#DFBE8F] transition-colors">
            {t.footer.privacy}
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#DFBE8F] transition-colors">
            {t.footer.terms}
          </Link>
        </div>
      </footer>
    </div>
  );
}
