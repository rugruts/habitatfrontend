import React from "react";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const faqs = [
  { q: "What is the best way to book?", a: "Book direct here for the best rate, flexible policies, and personal tips." },
  { q: "Is Trikala walkable?", a: "Yes—most sights are 5–15 minutes on foot or by bicycle along the river." },
  { q: "Do you offer late check‑in?", a: "Absolutely, with prior notice we provide seamless self check‑in." },
];

const Policies: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Policies & FAQ – Habitat Lobby</title>
        <meta name="description" content="House rules, booking policies, and frequently asked questions for Habitat Lobby in Trikala." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/policies" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">Policies & FAQ</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Everything you need to know for a smooth stay.</p>

        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem value={`item-${i}`} key={i}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Policies;
