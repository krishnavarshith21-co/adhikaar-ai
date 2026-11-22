"use client";

import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white border-b border-[#172943]/5">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14">
            <Badge
              variant="gold"
              className="mb-3 uppercase tracking-wider font-semibold text-[11px]"
            >
              {t.faq.badge}
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172943] tracking-tight">
              {t.faq.heading}
            </h2>
          </div>

          {/* Refined Accordion List */}
          <div className="space-y-3.5">
            {t.faq.items.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-[#657E91]/20 bg-[#F7F2E9]/30 transition-all duration-200 hover:border-[#BC9059]/50 hover:bg-[#F7F2E9]/60 open:bg-white open:border-[#BC9059]/60 open:shadow-[0_8px_30px_rgba(22,42,67,0.05)]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 sm:py-5 font-sans text-sm sm:text-base font-semibold text-[#172943] marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059] rounded-2xl">
                  <span className="pr-4 leading-snug">{faq.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-[#657E91]/20 text-[#657E91] transition-transform duration-200 group-open:rotate-180 group-open:border-[#BC9059] group-open:text-[#BC9059]">
                    <ChevronDown className="w-4 h-4 stroke-[2]" />
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1 font-sans text-xs sm:text-sm text-[#4E677B] leading-relaxed border-t border-[#657E91]/10">
                  <p className="pt-2">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
