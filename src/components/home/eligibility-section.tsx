"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export function EligibilitySection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-[#F7F2E9] border-b border-[#172943]/5">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Editorial Explanation & Feature Rows */}
          <div className="lg:col-span-6 space-y-5">
            <Badge
              variant="gold"
              className="uppercase tracking-wider font-semibold text-[11px]"
            >
              {t.rulesEngine.badge}
            </Badge>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172943] tracking-tight leading-[1.15]">
              {t.rulesEngine.heading}
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#4E677B] leading-relaxed max-w-xl">
              {t.rulesEngine.desc}
            </p>

            {/* Three Refined Feature Rows */}
            <ul className="space-y-3 pt-2">
              {t.rulesEngine.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 font-sans text-xs sm:text-sm text-[#172943]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BC9059]/15 text-[#BC9059]">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/app/eligibility"
                className="inline-flex items-center gap-2 rounded-full border border-[#BC9059] bg-white/70 hover:bg-white text-[#172943] hover:text-[#BC9059] px-6 py-3 font-sans text-sm font-semibold transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
              >
                <span>{t.rulesEngine.cta}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Realistic Elegantly Styled Evaluation Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[#657E91]/20 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(22,42,67,0.06)] space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#657E91]/15 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#172943]" />
                  <span className="font-sans text-xs font-bold text-[#172943] uppercase tracking-wider">
                    {t.rulesEngine.cardTitle}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.rulesEngine.cardBadge}</span>
                </span>
              </div>

              {/* Evaluation Item 1: Ayushman Bharat (Potentially Eligible) */}
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 sm:p-5">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <h4 className="font-sans text-sm sm:text-base font-semibold text-emerald-950">
                      {t.rulesEngine.scheme1Title}
                    </h4>
                    <p className="font-sans text-xs text-emerald-700 mt-0.5">
                      {t.rulesEngine.scheme1Dept}
                    </p>
                  </div>
                  <span className="max-w-full rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900">
                    {t.rulesEngine.scheme1Status}
                  </span>
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs font-sans text-emerald-900/90 leading-relaxed">
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-700" />
                  <span>{t.rulesEngine.scheme1Reason}</span>
                </div>
              </div>

              {/* Evaluation Item 2: National Fellowship (Needs Document) */}
              <div className="rounded-2xl bg-[#F7F2E9]/80 border border-[#BC9059]/25 p-4 sm:p-5">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <h4 className="font-sans text-sm sm:text-base font-semibold text-[#172943]">
                      {t.rulesEngine.scheme2Title}
                    </h4>
                    <p className="font-sans text-xs text-[#657E91] mt-0.5">
                      {t.rulesEngine.scheme2Dept}
                    </p>
                  </div>
                  <span className="max-w-full rounded-full bg-[#BC9059]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#7D5B2C]">
                    {t.rulesEngine.scheme2Status}
                  </span>
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs font-sans text-[#4E677B] leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#BC9059]" />
                  <span>{t.rulesEngine.scheme2Reason}</span>
                </div>
              </div>

              {/* Illustrative Footer Note */}
              <p className="pt-2 text-center font-sans text-[11px] text-[#657E91]/80">
                {t.rulesEngine.illustrativeNote}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
