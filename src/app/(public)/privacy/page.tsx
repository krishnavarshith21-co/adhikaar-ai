import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function PrivacyPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-sapphire mb-8">
            Privacy Policy
          </h1>
          <div className="prose font-sans text-steel leading-relaxed space-y-6">
            <p><strong className="text-sapphire">Last updated:</strong> November 2026</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">1. Information We Collect</h2>
            <p>We collect only the information necessary to provide our services: your name, email address, and profile information you voluntarily provide (age, location, occupation, education level). Do not enter Aadhaar numbers or upload identity documents here.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">2. How We Use Your Information</h2>
            <p>Your information is used exclusively to match you with relevant schemes, assess eligibility, and provide personalised guidance. We never use your data for advertising or sell it to third parties.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">3. Data Storage and Security</h2>
            <p>Account data is stored in the deployment database. Passwords are hashed and session cookies are HTTP-only. Database encryption, backups and access controls depend on the deployment operator.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">4. Data Sharing</h2>
            <p>Live assistant questions are sent to the configured AI provider with official source excerpts and a preliminary rule result. Recorded audio is sent to the transcription provider when you stop recording. Do not include private identifiers in questions or audio.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time. You may also request a copy of your data or ask us to stop processing it.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">6. AI and Voice Data</h2>
            <p>Conversations with our AI assistant may be processed by third-party AI providers. We do not store voice recordings. Text transcripts are retained only for the duration of your session unless you explicitly save them.</p>

            <h2 className="font-display text-xl font-semibold text-sapphire mt-8">7. Contact</h2>
            <p>For privacy inquiries or deletion requests, contact the operator of this deployment. No public support mailbox is configured.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

