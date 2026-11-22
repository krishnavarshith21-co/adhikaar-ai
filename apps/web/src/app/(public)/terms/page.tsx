import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function TermsPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-sapphire mb-8">
            Terms of Service
          </h1>
          <div className="prose font-sans text-steel leading-relaxed space-y-6">
            <p><strong className="text-sapphire">Last updated:</strong> November 2026</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">1. Acceptance</h2>
            <p>By using ADHIKAAR AI, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">2. Nature of Service</h2>
            <p>ADHIKAAR AI is an informational civic assistance platform. We are not a government service. We do not guarantee the accuracy, completeness, or currency of scheme information. Always verify details on official government portals.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">3. Eligibility Assessments</h2>
            <p>Our eligibility assessments are informational estimates based on published criteria. They are not official decisions. Final eligibility and approval always rest with the issuing authority.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">4. User Responsibilities</h2>
            <p>You are responsible for providing accurate information. You must not use the platform for fraudulent purposes or to misrepresent your eligibility for any scheme.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">5. Limitation of Liability</h2>
            <p>ADHIKAAR AI is provided &quot;as is&quot; without warranties. We are not liable for any losses arising from reliance on information provided by the platform, including missed deadlines, incorrect eligibility assessments, or application rejections.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">6. AI-Generated Content</h2>
            <p>Our AI assistant provides guidance based on available scheme data. AI-generated responses may contain errors. Always cross-reference important information with official sources.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">7. Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behaviour.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">8. Contact</h2>
            <p>For questions about this deployment, contact its operator.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

