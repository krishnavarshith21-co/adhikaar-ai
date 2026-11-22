import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "Share basic information about yourself — age, location, occupation, and education. We use this to match you with relevant schemes. We never ask for sensitive IDs upfront.",
    detail: "Takes less than 2 minutes",
  },
  {
    num: "02",
    title: "Discover your benefits",
    desc: "Explore a focused government programme catalogue. Preliminary deterministic checks help you identify programmes worth investigating.",
    detail: "Education, Healthcare, Employment, Housing & more",
  },
  {
    num: "03",
    title: "Check your eligibility",
    desc: "Our deterministic rules engine evaluates your profile against official scheme criteria. You get a transparent, explainable result — not a vague AI prediction.",
    detail: "Rule-based, transparent, never guaranteed",
  },
  {
    num: "04",
    title: "Prepare your application",
    desc: "Use our signature Preflight feature to check whether your documents are ready. We highlight what's missing, what's outdated, and what to do next.",
    detail: "The most common rejection reason: missing documents",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-sapphire md:text-5xl">
              How ADHIKAAR AI works
            </h1>
            <p className="mt-4 font-sans text-lg text-steel">
              Four simple steps from discovery to readiness. We guide you
              through the entire process.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-12">
        <Container>
          <div className="mx-auto max-w-3xl space-y-16">
            {steps.map((step, i) => (
              <div key={step.num} className="grid gap-6 md:grid-cols-[80px_1fr]">
                <span className="font-display text-6xl font-bold text-gold/20">
                  {step.num}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-sapphire">
                    {step.title}
                  </h2>
                  <p className="mt-3 font-sans text-steel leading-relaxed">
                    {step.desc}
                  </p>
                  <p className="mt-2 font-sans text-xs font-semibold text-gold">
                    {step.detail}
                  </p>
                  {i < steps.length - 1 && (
                    <div className="mt-8 border-b border-steel/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-sapphire">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-semibold text-linen">
              Ready to discover your benefits?
            </h2>
            <p className="mt-3 font-sans text-steel">
              It takes less than 2 minutes to get started.
            </p>
            <div className="mt-6">
              <Link href="/sign-up">
                <Button className="bg-gold text-sapphire hover:bg-gold/90">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
