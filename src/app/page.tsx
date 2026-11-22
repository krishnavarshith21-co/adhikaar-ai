import { LandingNavbar } from "@/components/layout/landing-navbar";
import { HeroSection } from "@/components/home/hero-section";
import { ThreeStepsSection } from "@/components/home/three-steps-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { EligibilitySection } from "@/components/home/eligibility-section";
import { PreflightShowcaseSection } from "@/components/home/preflight-showcase-section";
import { HeritageSection } from "@/components/home/heritage-section";
import { VoiceSection } from "@/components/home/voice-section";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCtaSection } from "@/components/home/final-cta-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="bg-[#F7F2E9] text-[#172943] min-h-screen flex flex-col selection:bg-[#BC9059]/20 selection:text-[#172943]">
      {/* ========================================================================= */}
      {/* 1. FIRST SCREEN: Full-Viewport Landing Navbar + Architectural Hero        */}
      {/* ========================================================================= */}
      <div className="first-screen">
        <LandingNavbar />
        <HeroSection />
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE STEPS: Discover → Prepare → Track                                */}
      {/* ========================================================================= */}
      <ThreeStepsSection />

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT SECTIONS                                                  */}
      {/* ========================================================================= */}
      <main className="flex-1">
        {/* Scheme Discovery Categories */}
        <CategoriesSection />

        {/* Deterministic Explainable Eligibility Rules Engine */}
        <EligibilitySection />

        {/* Application Preflight Showcase */}
        <PreflightShowcaseSection />

        {/* Modern Indian Architectural Heritage 3D Sculpture */}
        <HeritageSection />

        {/* Multilingual Voice Consultation Guide */}
        <VoiceSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Final Meaningful Call to Action */}
        <FinalCtaSection />
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER: High-Contrast Pan-India Disclaimer & Functional Routes        */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
}
