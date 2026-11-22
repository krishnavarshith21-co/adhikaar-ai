"use client";

import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SculptureWrapper } from "@/components/three/sculpture-wrapper";
import { Landmark } from "lucide-react";

export function HeritageSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-[#F7F2E9] border-b border-[#172943]/5">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14">
          {/* Left Column: Meaningful Citizen-Centric Editorial Content */}
          <div className="lg:col-span-6 min-w-0 space-y-5">
            <Badge
              variant="gold"
              className="uppercase tracking-wider font-semibold text-[11px]"
            >
              {t.heritage.badge}
            </Badge>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172943] tracking-tight leading-[1.15]">
              {t.heritage.heading}
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#4E677B] leading-relaxed max-w-xl">
              {t.heritage.desc}
            </p>

            <div className="flex items-center gap-2.5 pt-2 text-xs font-sans text-[#657E91]">
              <Landmark className="w-4 h-4 text-[#BC9059] shrink-0" />
              <span>{t.heritage.featureTag}</span>
            </div>
          </div>

          {/* Right Column: Seamlessly Integrated Architectural Canvas */}
          <div className="heritage-card lg:col-span-6 min-w-0 rounded-3xl border border-[#657E91]/20 bg-gradient-to-b from-white/90 to-[#F7F2E9]/60 p-4 sm:p-6 shadow-[0_12px_40px_rgba(22,42,67,0.05)]">
            <SculptureWrapper />
          </div>
        </div>
      </Container>
    </section>
  );
}
