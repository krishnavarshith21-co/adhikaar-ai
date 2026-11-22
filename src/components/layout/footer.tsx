"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  const platformLinks = [
    { href: "/app/discover", label: t.nav.explore },
    { href: "/how-it-works", label: t.footer.howItWorks },
    { href: "/app/eligibility", label: t.rulesEngine.badge },
    { href: "/app/preflight", label: t.preflightSection.badge },
  ];

  const civicLinks = [
    { href: "/resources", label: t.footer.resources },
    { href: "/about", label: t.footer.about },
    { href: "/help", label: t.footer.helpCenter },
  ];

  const legalLinks = [
    { href: "/privacy", label: t.footer.privacy },
    { href: "/terms", label: t.footer.terms },
  ];

  return (
    <footer className="border-t border-[#172943]/20 bg-[#0F1E31] text-[#F7F2E9]">
      <Container>
        <div className="grid gap-10 py-12 sm:py-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Mission Statement (5 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F7F2E9] uppercase inline-block"
              aria-label="ADHIKAAR AI Home"
            >
              ADHIKAAR<span className="text-[#BC9059]"> AI</span>
            </Link>
            <p className="max-w-md font-sans text-xs sm:text-sm leading-relaxed text-[#A3B8CC]">
              {t.footer.mission}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-sans text-[#DFBE8F]">
              <ShieldCheck className="w-4 h-4 text-[#BC9059] shrink-0" />
              <span>Pan-India Civic Eligibility Engine</span>
            </div>
          </div>

          {/* Platform Links (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#BC9059]">
              {t.footer.platformTitle}
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs sm:text-sm text-[#A3B8CC] transition-colors hover:text-[#F7F2E9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & About (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#BC9059]">
              {t.footer.aboutTitle}
            </h4>
            <ul className="space-y-2.5">
              {civicLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs sm:text-sm text-[#A3B8CC] transition-colors hover:text-[#F7F2E9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#BC9059]">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs sm:text-sm text-[#A3B8CC] transition-colors hover:text-[#F7F2E9]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright Notice Bar */}
        <div className="border-t border-white/10 py-6 space-y-2 text-center">
          <p className="font-sans text-xs text-[#DFBE8F]/90 font-medium max-w-2xl mx-auto">
            {t.footer.disclaimer}
          </p>
          <p className="font-sans text-[11px] text-[#657E91]">
            {t.footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
