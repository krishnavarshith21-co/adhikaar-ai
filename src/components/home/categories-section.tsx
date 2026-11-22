"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  HeartPulse,
  Sprout,
  BriefcaseBusiness,
  House,
  HandHeart,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  EDUCATION: <GraduationCap className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
  HEALTHCARE: <HeartPulse className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
  AGRICULTURE: <Sprout className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
  LIVELIHOOD: <BriefcaseBusiness className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
  HOUSING: <House className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
  SOCIAL_SECURITY: <HandHeart className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />,
};

export function CategoriesSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28 border-b border-[#172943]/5">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <Badge
            variant="gold"
            className="mb-3 uppercase tracking-wider font-semibold text-[11px]"
          >
            {t.categories.badge}
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#172943] tracking-tight">
            {t.categories.heading}
          </h2>
          <p className="mt-4 font-sans text-[#657E91] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t.categories.subtitle}
          </p>
        </div>

        {/* 3-Column Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {t.categories.items.filter(cat => ['EDUCATION', 'AGRICULTURE', 'LIVELIHOOD'].includes(cat.id)).map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#657E91]/15 bg-[#F7F2E9]/40 p-6 sm:p-7 transition-all duration-200 hover:bg-white hover:border-[#BC9059]/40 hover:shadow-[0_8px_30px_rgba(22,42,67,0.06)] hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#BC9059]"
            >
              <div>
                {/* Icon Container with refined sapphire/copper styling */}
                <div className="w-12 h-12 rounded-xl bg-[#A95D49]/10 border border-[#A95D49]/15 flex items-center justify-center mb-5 group-hover:bg-[#A95D49]/15 transition-colors">
                  {categoryIcons[cat.id] || (
                    <Sprout className="w-[26px] h-[26px] stroke-[1.75] text-[#A95D49]" />
                  )}
                </div>

                {/* Card Title */}
                <h3 className="font-display text-xl sm:text-[22px] font-semibold text-[#172943] tracking-tight group-hover:text-[#BC9059] transition-colors">
                  {cat.title}
                </h3>

                {/* Card Description */}
                <p className="mt-2.5 font-sans text-xs sm:text-sm text-[#4E677B] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Card Footer with Verified Tag & Deep Filter Link */}
              <div className="mt-6 pt-4 border-t border-[#657E91]/10 flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-[#BC9059]">
                  {cat.tag}
                </span>
                <Link
                  href={`/app/discover?category=${cat.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#172943] hover:text-[#BC9059] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9059] rounded-sm"
                  aria-label={`Explore ${cat.title} schemes`}
                >
                  <span>{t.categories.exploreLink}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 sm:mt-14">
          <Link
            href="/app/discover"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172943] hover:bg-[#1E3A5F] text-[#F7F2E9] px-8 py-3.5 font-sans text-sm font-semibold transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9059]"
          >
            <span>{t.categories.viewAllCta}</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
