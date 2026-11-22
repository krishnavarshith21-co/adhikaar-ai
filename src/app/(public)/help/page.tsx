import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const faqs = [
  { q: "What is ADHIKAAR AI?", a: "ADHIKAAR AI is a civic assistance platform that helps Indian citizens discover government and NGO schemes, check eligibility, prepare documents, and track applications." },
  { q: "Is this a government website?", a: "No. ADHIKAAR AI is an independent platform. Always verify scheme details on official government portals before applying." },
  { q: "How do I create an account?", a: "Click 'Get Started' on the homepage and fill in your name, email, and password. It takes less than a minute." },
  { q: "Is my data safe?", a: "Yes. We follow privacy-first principles, collect minimal data, and never sell your information to third parties." },
  { q: "What languages are supported?", a: "Assistant text is available in English, Hindi and Telugu. Voice is experimental and needs testing on your device." },
  { q: "Does eligibility check guarantee approval?", a: "No. Our eligibility assessments are based on published criteria and are informational only. Final approval rests with the issuing authority." },
  { q: "How do I contact support?", a: "Use the in-app guide for programme information. For account issues, contact the operator of this deployment." },
];

export default function HelpPage() {
  return (
    <>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-sapphire md:text-5xl">
              Help Center
            </h1>
            <p className="mt-4 font-sans text-lg text-steel">
              Find answers to common questions and get help using ADHIKAAR AI.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-12">
        <Container>
          <div className="mx-auto max-w-2xl space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-steel/15 overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-sans text-sm font-semibold text-sapphire marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-steel transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="px-6 pb-4 font-sans text-sm text-steel leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-md text-center">
            <h2 className="font-display text-2xl font-semibold text-sapphire mb-3">
              Still need help?
            </h2>
            <p className="font-sans text-sm text-steel mb-4">
              Contact the operator of this deployment for account help. Use official programme portals for application questions.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

