"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, type Language } from "@/lib/language-context";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const currentLang = language.toUpperCase();
  const setCurrentLang = (value: 'EN' | 'HI' | 'TE') => setLanguage(value.toLowerCase() as Language);
  const navLinks = [
    { href: '/app/discover', label: t.nav.explore }, { href: '/how-it-works', label: t.nav.howItWorks },
    { href: '/resources', label: t.nav.resources }, { href: '/about', label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#F7F2E9] border-b border-sapphire/10 shadow-[0_1px_3px_rgba(22,42,67,0.04)] h-20">
      {/* Fluid, full-width container matching clamp horizontal padding */}
      <div className="w-full h-full px-[clamp(20px,4vw,88px)]">
        <nav className="flex h-full items-center justify-between">
          {/* Left: Brand Logo + Ornamental Lotus Motif */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-sapphire uppercase hover:opacity-95 transition-opacity"
            >
              ADHIKAAR AI
            </Link>

            {/* Lotus ornamental emblem with fine gold horizontal rules */}
            <div className="hidden sm:flex items-center gap-2 pl-2">
              <span className="w-6 lg:w-9 h-[1px] bg-gold/60" />
              <svg
                className="w-5 h-5 text-gold shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4c-1.8 3.5-4.5 6-9 7.5 4.5 1.5 7.2 4 9 7.5 1.8-3.5 4.5-6 9-7.5-4.5-1.5-7.2-4-9-7.5z" />
                <path d="M12 8c-1.2 2.2-3 4-6 5 3 1 4.8 2.8 6 5 1.2-2.2 3-4 6-5-3-1-4.8-2.8-6-5z" opacity="0.6" />
                <circle cx="12" cy="13" r="1.5" fill="currentColor" />
              </svg>
              <span className="w-6 lg:w-9 h-[1px] bg-gold/60" />
            </div>

            <span className="hidden xl:block h-6 w-[1px] bg-steel/20 ml-2 mr-1" />
          </div>

          {/* Center Links (Desktop only, 1024px+) */}
          <div className="hidden xl:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm font-medium text-sapphire/85 hover:text-sapphire transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Language Toggle, Divider, Sign In, Get Started CTA (1024px+) */}
          <div className="hidden xl:flex items-center gap-3.5 shrink-0">
            {/* Multilingual Selector: EN / हिंदी */}
            <div className="flex items-center gap-1.5 font-sans text-xs px-2 py-1">
              <button
                type="button"
                onClick={() => setCurrentLang("EN")}
                className={`font-semibold transition-colors cursor-pointer ${
                  currentLang === "EN"
                    ? "text-sapphire underline underline-offset-4 decoration-gold decoration-2"
                    : "text-steel hover:text-sapphire"
                }`}
              >
                EN
              </button>
              <span className="text-steel/40">/</span>
              <button
                type="button"
                onClick={() => setCurrentLang(currentLang === "HI" ? "TE" : "HI")}
                className={`font-medium transition-colors cursor-pointer ${
                  currentLang === "HI" || currentLang === "TE"
                    ? "text-sapphire underline underline-offset-4 decoration-gold decoration-2"
                    : "text-steel hover:text-sapphire"
                }`}
                title="Switch between Hindi and Telugu"
              >
                {currentLang === "TE" ? "తెలుగు" : "हिंदी"}
              </button>
            </div>

            {/* Vertical Divider */}
            <span className="h-5 w-[1px] bg-steel/25 mx-1" />

            {/* Sign in Button */}
            <Link
              href="/sign-in"
              className="rounded-full border border-steel/30 bg-white/40 px-5 py-2 font-sans text-xs sm:text-sm font-medium text-sapphire hover:border-sapphire hover:bg-white transition-all shadow-sm"
            >
              {t.nav.signIn}
            </Link>

            {/* Get started CTA Button */}
            <Link
              href="/sign-up"
              className="rounded-full bg-sapphire px-5 py-2 font-sans text-xs sm:text-sm font-semibold text-linen hover:bg-steel transition-all flex items-center gap-1.5 shadow-sm"
            >
              {t.nav.getStarted}
              <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Tablet & Mobile Right Action Group (< 1024px) */}
          <div className="flex xl:hidden items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex rounded-full border border-steel/30 bg-white/50 px-4 py-1.5 font-sans text-xs font-medium text-sapphire hover:bg-white"
            >
              {t.nav.signIn}
            </Link>

            <button
              type="button"
              className="p-2 text-sapphire cursor-pointer rounded-lg hover:bg-sapphire/5"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Tablet & Mobile Dropdown Menu */}
        {open && (
          <div className="border-t border-sapphire/10 py-4 xl:hidden bg-[#F7F2E9]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 font-sans text-sm font-medium text-sapphire hover:bg-sapphire/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-steel/15 pt-3 px-3 flex items-center justify-between">
                <span className="text-xs font-sans text-steel">Language:</span>
                <div className="flex items-center gap-2 font-sans text-xs">
                  <button
                    onClick={() => setCurrentLang("EN")}
                    className={currentLang === "EN" ? "font-bold text-sapphire underline cursor-pointer" : "text-steel cursor-pointer"}
                  >
                    EN
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => setCurrentLang("HI")}
                    className={currentLang === "HI" ? "font-bold text-sapphire underline cursor-pointer" : "text-steel cursor-pointer"}
                  >
                    हिंदी
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => setCurrentLang("TE")}
                    className={currentLang === "TE" ? "font-bold text-sapphire underline font-telugu cursor-pointer" : "text-steel cursor-pointer"}
                  >
                    తెలుగు
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 px-2 pt-2">
                <Link
                  href="/sign-in"
                  className="rounded-full border border-steel/30 py-2.5 text-center font-sans text-xs font-medium text-sapphire"
                  onClick={() => setOpen(false)}
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-sapphire py-2.5 text-center font-sans text-xs font-semibold text-linen"
                  onClick={() => setOpen(false)}
                >
                  {t.nav.getStarted} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
