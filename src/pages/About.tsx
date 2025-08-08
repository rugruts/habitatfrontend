import React from "react";
import { Helmet } from "react-helmet-async";
import expCycling from "@/assets/exp-cycling.jpg";
import expCastle from "@/assets/exp-castle.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import Footer from "@/components/Footer";

const blocks = [
  { img: expCycling, title: "Cycling City", text: "Ride riverside paths and stone bridges in Greece’s bike‑first city." },
  { img: expCastle, title: "History & Culture", text: "Byzantine castle views, museums, and old‑town charm." },
  { img: expMeteora, title: "Nature & Day Trips", text: "Riverside walks and iconic Meteora an hour away." },
];

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>About Trikala – Habitat Lobby Guide</title>
        <meta name="description" content="A curated introduction to Trikala by Habitat Lobby: cycling culture, history, and nature day trips." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/about" />
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">About Trikala</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">A compact Greek city built for bikes and slow living—bridges, river light, and friendly squares.</p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-8">
          {blocks.map((b) => (
            <article key={b.title} className="rounded-lg overflow-hidden border animate-fade-in">
              <img src={b.img} alt={b.title} className="h-56 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <h2 className="font-display text-xl md:text-2xl">{b.title}</h2>
                <p className="text-muted-foreground mt-2">{b.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
