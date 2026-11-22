import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const resources = [
  { title: "Official Government Portals", desc: "Links to key government scheme portals and databases.", links: [
    { label: "India.gov.in", url: "https://www.india.gov.in" },
    { label: "MyScheme.gov.in", url: "https://www.myscheme.gov.in" },
    { label: "Telangana e-Pass", url: "https://telanganaepass.cgg.gov.in" },
  ]},
  { title: "Programme sources", desc: "Confirm current criteria with the issuing authority.", links: [
    { label: "PM-Vidyalaxmi education loans", url: "https://pmvidyalaxmi.co.in" },
    { label: "Telangana Agriculture Department", url: "https://www.telangana.gov.in/departments/agriculture-and-co-operation/" },
    { label: "MUDRA", url: "https://www.mudra.org.in" },
  ]},
  { title: "Identity services", desc: "Use the official service for current document and support information.", links: [
    { label: "UIDAI official service", url: "https://uidai.gov.in" },
  ]},
];

export default function ResourcesPage() {
  return (
    <>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-sapphire md:text-5xl">
              Resources
            </h1>
            <p className="mt-4 font-sans text-lg text-steel">
              Useful links, guides, and tools to help you navigate schemes and
              prepare your applications.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <Card key={r.title} className="p-6">
                <CardTitle>{r.title}</CardTitle>
                <CardDescription>{r.desc}</CardDescription>
                <ul className="mt-4 space-y-2">
                  {r.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm text-gold hover:text-gold/80 transition-colors"
                      >
                        {link.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

