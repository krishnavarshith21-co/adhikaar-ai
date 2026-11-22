"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, type Language } from "@/lib/language-context";
import { Menu, X, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/app/discover", label: t.nav.explore },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/resources", label: t.nav.resources },
    { href: "/about", label: t.nav.about },
  ];

  const languages: { code: Language; label: string; title: string }[] = [
    { code: "en", label: "EN", title: "English" },
    { code: "hi", label: "हिन्दी", title: "Hindi" },
    { code: "te", label: "తెలుగు", title: "Telugu" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#F7F2E9] border-b border-[#172943]/10 shadow-[0_1px_3px_rgba(22,42,67,0.04)] h-20">
      <div className="w-full h-full px-[clamp(24px,4vw,80px)] max-w-[1560px] mx-auto">
        <nav
          aria-label="Main navigation"
          className="flex h-full items-center justify-between"
        >
          {/* Brand Logo & Ornamental Lotus Motif */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#172943] uppercase hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] rounded-sm"
              aria-label="Adhikaar AI Home"
            >
              ADHIKAAR AI
            </Link>

            {/* Lotus ornamental motif with fine gold horizontal rules */}
            <div className="hidden sm:flex items-center gap-2 pl-2" aria-hidden="true">
              <span className="w-6 lg:w-9 h-[1px] bg-[#BC9059]/60" />
              <svg
                className="w-5 h-5 text-[#BC9059] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4c-1.8 3.5-4.5 6-9 7.5 4.5 1.5 7.2 4 9 7.5 1.8-3.5 4.5-6 9-7.5-4.5-1.5-7.2-4-9-7.5z" />
                <path
                  d="M12 8c-1.2 2.2-3 4-6 5 3 1 4.8 2.8 6 5 1.2-2.2 3-4 6-5-3-1-4.8-2.8-6-5z"
                  opacity="0.6"
                />
                <circle cx="12" cy="13" r="1.5" fill="currentColor" />
              </svg>
              <span className="w-6 lg:w-9 h-[1px] bg-[#BC9059]/60" />
            </div>

            <span className="hidden xl:block h-6 w-[1px] bg-[#657E91]/20 ml-2 mr-1" />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden xl:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm font-medium text-[#172943]/85 hover:text-[#172943] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] rounded-sm py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Items: Language Segmented Control, Sign In, Get Started CTA */}
          <div className="hidden xl:flex items-center gap-3.5 shrink-0">
            {/* Functional 3-Language Segmented Control */}
            <div
              className="flex items-center bg-white/70 border border-[#657E91]/20 rounded-full p-1 shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              {languages.map((item) => {
                const isActive = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    title={item.title}
                    aria-pressed={isActive}
                    className={`px-2.5 py-1 text-xs font-sans rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] ${
                      isActive
                        ? "bg-[#172943] text-[#F7F2E9] font-semibold shadow-xs"
                        : "text-[#657E91] hover:text-[#172943] font-medium"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <span className="h-5 w-[1px] bg-[#657E91]/25 mx-0.5" />

            {/* Outlined Sign In Button */}
            <Link
              href="/sign-in"
              className="rounded-full border border-[#657E91]/30 bg-white/40 px-5 py-2 font-sans text-xs sm:text-sm font-medium text-[#172943] hover:border-[#172943] hover:bg-white transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
            >
              {t.nav.signIn}
            </Link>

            {/* Primary Midnight Sapphire Get Started CTA */}
            <Link
              href="/sign-up"
              className="rounded-full bg-[#172943] hover:bg-[#1E3A5F] px-5 py-2 font-sans text-xs sm:text-sm font-semibold text-[#F7F2E9] transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
            >
              <span>{t.nav.getStarted}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="xl:hidden p-2 text-[#172943] hover:bg-[#172943]/5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu with Full Localization Support */}
      {open && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-[#F7F2E9] border-b border-[#172943]/15 shadow-xl px-6 py-6 space-y-5">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-sans text-base font-medium text-[#172943] hover:text-[#BC9059] transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Language Selector */}
          <div className="pt-3 border-t border-[#172943]/10">
            <span className="block font-sans text-xs font-semibold text-[#657E91] uppercase tracking-wider mb-2">
              Language / भाषा / భాష
            </span>
            <div className="flex items-center gap-2">
              {languages.map((item) => {
                const isActive = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                    }}
                    className={`flex-1 py-2 text-xs font-sans rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#172943] text-[#F7F2E9] border-[#172943] font-semibold"
                        : "bg-white/60 text-[#172943] border-[#657E91]/25 hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-[#172943]/30 bg-white/40 font-sans text-sm font-medium text-[#172943]"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#172943] font-sans text-sm font-semibold text-[#F7F2E9] flex items-center justify-center gap-1.5"
            >
              <span>{t.nav.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
