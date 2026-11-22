"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { BookOpen, FileCheck, CheckCircle2 } from "lucide-react";

export function ThreeStepsSection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: t.steps.step1Num,
      title: t.steps.step1Title,
      href: "/app/discover",
      description: t.steps.step1Desc,
      icon: <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.5]" />,
    },
    {
      number: t.steps.step2Num,
      title: t.steps.step2Title,
      href: "/app/eligibility",
      description: t.steps.step2Desc,
      icon: <FileCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.5]" />,
    },
    {
      number: t.steps.step3Num,
      title: t.steps.step3Title,
      href: "/app/journey",
      description: t.steps.step3Desc,
      icon: <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.5]" />,
    },
  ];

  return (
    <section
      id="steps"
      className="how-it-works relative z-10 w-full bg-[#F7F2E9] border-y border-[#BC9059]/30 py-8 sm:py-9 shadow-[0_1px_4px_rgba(22,42,67,0.03)]"
      aria-label={t.steps.sectionAria}
    >
      <div className="w-full max-w-[1560px] mx-auto px-[clamp(24px,4vw,80px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#BC9059]/20">
          {steps.map((step, idx) => (
            <Link
              key={step.number}
              href={step.href}
              className={`group flex items-start gap-4 transition-all duration-200 ${
                idx === 0
                  ? "md:pr-8 xl:pr-12"
                  : idx === 1
                  ? "pt-6 md:pt-0 md:px-8 xl:px-12"
                  : "pt-6 md:pt-0 md:pl-8 xl:pl-12"
              }`}
            >
              {/* Outline Warm Gold Icon */}
              <div className="shrink-0 text-[#BC9059] group-hover:text-[#A87E4B] transition-colors mt-0.5">
                {step.icon}
              </div>

              {/* Title & Description with exact approved copy and balanced line wrapping */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-display italic text-3xl sm:text-[34px] font-normal text-[#BC9059] leading-none select-none">
                    {step.number}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#172943] tracking-tight group-hover:text-[#BC9059] transition-colors leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-[13px] text-[#4E677B] leading-relaxed font-normal max-w-xs">
                  {step.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
