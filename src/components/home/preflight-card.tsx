"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { FileText, GraduationCap, CheckSquare } from "lucide-react";

interface PreflightCardProps {
  className?: string;
}

export function PreflightCard({ className = "" }: PreflightCardProps) {
  const { t, language } = useLanguage();

  return (
    <aside
      className={`rounded-2xl bg-[#132338]/92 backdrop-blur-xl border border-[#BC9059]/35 p-5 sm:p-6 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.5)] space-y-4 transition-all duration-200 hover:border-[#BC9059]/60 ${className}`}
      aria-label="Application Preflight status summary"
    >
      <p className="text-xs text-[#DFBE8F]">{language === "hi" ? "डेमो — केवल उदाहरण" : language === "te" ? "డెమో — ఉదాహరణ మాత్రమే" : "Demo — illustrative"}</p>
      {/* Card Header: Editorial Fraunces Serif */}
      <div className="pb-1">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#F7F2E9] tracking-tight">
          {t.preflightCard.title}
        </h3>
      </div>

      {/* Checklist Rows with Precise Hierarchy & Status Tags */}
      <div className="space-y-3 font-sans text-xs sm:text-[13px]">
        {/* Row 1: Income Certificate */}
        <div className="flex items-center justify-between text-[#F7F2E9] gap-4 py-1 border-t border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-4 h-4 text-[#F7F2E9]/80 shrink-0" />
            <span className=" font-medium text-[#F7F2E9]">
              {t.preflightCard.incomeCert}
            </span>
          </div>
          <span className="text-[#8EA3B5] text-right shrink-0 font-medium ">
            {t.preflightCard.checkDate}
          </span>
        </div>

        {/* Row 2: Study Records */}
        <div className="flex items-center justify-between text-[#F7F2E9] gap-3 py-1 border-t border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <GraduationCap className="w-4 h-4 text-[#F7F2E9]/90 shrink-0" />
            <span className=" font-medium text-[#F7F2E9]">
              {t.preflightCard.studyRecords}
            </span>
          </div>
          <span className="text-[#34D399] text-right shrink-0 font-semibold ">
            {t.preflightCard.ready}
          </span>
        </div>

        {/* Row 3: Next Step Action */}
        <div className="flex items-center justify-between text-[#F7F2E9] gap-3 py-1 border-t border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckSquare className="w-4 h-4 text-[#F7F2E9]/90 shrink-0" />
            <span className=" font-medium text-[#F7F2E9]">
              {t.preflightCard.nextStep}
            </span>
          </div>
          <Link
            href="/app/preflight"
            className="text-[#DFBE8F] hover:text-[#BC9059] hover:underline text-right shrink-0 font-semibold  transition-colors"
          >
            {t.preflightCard.reviewChecklist}
          </Link>
        </div>
      </div>
    </aside>
  );
}
