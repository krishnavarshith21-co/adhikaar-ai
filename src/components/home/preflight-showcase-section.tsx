"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Clock, Shield } from "lucide-react";

export function PreflightShowcaseSection() {
  const { t } = useLanguage();

  const getStatusIcon = (status: "ready" | "needs-attention" | "check-validity") => {
    switch (status) {
      case "ready":
        return <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />;
      case "needs-attention":
        return <AlertCircle className="w-3.5 h-3.5 text-[#A95D49] stroke-[2]" />;
      case "check-validity":
        return <Clock className="w-3.5 h-3.5 text-[#BC9059] stroke-[2]" />;
    }
  };

  const getStatusBadgeClass = (status: "ready" | "needs-attention" | "check-validity") => {
    switch (status) {
      case "ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-200/60";
      case "needs-attention":
        return "bg-[#A95D49]/15 text-[#8A3F2C] border-[#A95D49]/25";
      case "check-validity":
        return "bg-[#BC9059]/15 text-[#7D5B2C] border-[#BC9059]/25";
    }
  };

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28 border-b border-[#172943]/5">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Mobile First Order: Text Heading & Description appears first on small screens */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <Badge
              variant="copper"
              className="uppercase tracking-wider font-semibold text-[11px]"
            >
              {t.preflightSection.badge}
            </Badge>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172943] tracking-tight leading-[1.15]">
              {t.preflightSection.heading}
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#4E677B] leading-relaxed max-w-xl">
              {t.preflightSection.desc}
            </p>

            <div className="pt-2">
              <Link
                href="/app/preflight"
                className="inline-flex items-center gap-2 rounded-full bg-[#172943] hover:bg-[#1E3A5F] text-[#F7F2E9] px-7 py-3.5 font-sans text-sm font-semibold transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
              >
                <span>{t.preflightSection.cta}</span>
              </Link>
            </div>
          </div>

          {/* Checklist Card: Order 2 on mobile, Order 1 on desktop */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl border border-[#657E91]/20 bg-[#F7F2E9]/40 p-6 sm:p-8 shadow-[0_12px_40px_rgba(22,42,67,0.05)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#657E91]/15">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#172943]" />
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#172943]">
                    {t.preflightSection.cardTitle}
                  </h3>
                </div>
                <span className="rounded-full bg-[#BC9059]/15 border border-[#BC9059]/30 px-3 py-1 font-sans text-xs font-semibold text-[#7D5B2C]">
                  {t.preflightSection.cardScheme}
                </span>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {t.preflightSection.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-[#657E91]/15 px-4 py-3 bg-white shadow-xs"
                  >
                    <span className="font-sans text-xs sm:text-sm text-[#172943] font-medium pr-3">
                      {item.name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      <span>{item.statusLabel}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Readiness Progress Bar */}
              <div className="mt-6 pt-4 border-t border-[#657E91]/15">
                <div className="flex justify-between font-sans text-xs mb-2 font-medium">
                  <span className="text-[#172943] font-semibold">
                    {t.preflightSection.readinessScore}
                  </span>
                  <span className="text-[#BC9059] font-bold">
                    {t.preflightSection.scoreStatus}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#172943]/10">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[#C59D65] to-[#BC9059]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
