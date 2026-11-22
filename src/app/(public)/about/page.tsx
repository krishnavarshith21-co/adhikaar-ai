import { Handshake, Search, Shield, Languages, BadgeCheck, Lightbulb } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const values = [
  { icon: Handshake, title: "Citizen-first", desc: "Every feature is designed from the citizen's perspective, not the bureaucracy's." },
  { icon: Search, title: "Transparency", desc: "We show you exactly why you're eligible or not. No black boxes." },
  { icon: Shield, title: "Privacy", desc: "We collect only what's needed and never sell your data." },
  { icon: Languages, title: "Accessibility", desc: "Assistant text in English, Hindi and Telugu. Voice requires device-specific testing." },
  { icon: BadgeCheck, title: "Accuracy", desc: "We reference official scheme data and clearly mark demonstration content." },
  { icon: Lightbulb, title: "Empowerment", desc: "We guide, not gatekeep. You make informed decisions." },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-sapphire md:text-5xl">
              About ADHIKAAR AI
            </h1>
            <p className="mt-4 font-sans text-lg text-steel leading-relaxed">
              ADHIKAAR AI is a civic assistance platform that helps Indian
              citizens discover, understand, and access government and NGO
              opportunities with confidence.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-sapphire mb-4">
              Our mission
            </h2>
            <p className="font-sans text-steel leading-relaxed mb-4">
              Millions of Indian citizens are eligible for government welfare
              schemes and NGO programs but never apply — because they don{"'"}t
              know the schemes exist, can{"'"}t navigate the eligibility
              criteria, or struggle with the documentation process.
            </p>
            <p className="font-sans text-steel leading-relaxed mb-4">
              ADHIKAAR AI bridges this gap. We provide a clear, respectful, and
              intelligent platform that meets citizens where they are — in their
              language, at their pace, with their dignity intact.
            </p>
            <p className="font-sans text-sm text-gold font-semibold mt-6">
              Built by students, for citizens. This is a hackathon project demonstrating how technology can serve public good.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="font-display text-2xl font-semibold text-sapphire text-center mb-10">
            Our values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title} variant="outlined" className="text-center p-6">
                <div className="text-3xl mb-3"><v.icon className="mx-auto" size={28} aria-hidden="true" /></div>
                <CardTitle className="text-base">{v.title}</CardTitle>
                <CardDescription>{v.desc}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

