import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import expCycling from "@/assets/exp-cycling.jpg";
import expCastle from "@/assets/exp-castle.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expPertouli from "@/assets/exp-pertouli.jpg";
import Footer from "@/components/Footer";

const experiences = [
  { title: "Cycling City", img: expCycling, text: "Riverside routes and car‑free squares." },
  { title: "History & Culture", img: expCastle, text: "Castle views and museums." },
  { title: "Riverside Cafes", img: expCafe, text: "Sunlit terraces and local flavors." },
  { title: "Meteora Day Trip", img: expMeteora, text: "Iconic monasteries nearby." },
  { title: "Pertouli Forest", img: expPertouli, text: "Alpine meadows and pine trails." },
];

const Experiences: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Trikala Experiences Guide – Habitat Lobby</title>
        <meta name="description" content="A curated mini guide to Trikala: cycling routes, culture, cafes, and day trips by Habitat Lobby." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/experiences" />
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">Experiences</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Plan easy, memorable days around the river, castle, and nearby nature.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {experiences.map((ex) => (
            <Card key={ex.title} className="overflow-hidden animate-fade-in">
              <img src={ex.img} alt={ex.title} className="h-56 w-full object-cover" loading="lazy" />
              <CardContent className="pt-4">
                <h2 className="font-display text-xl">{ex.title}</h2>
                <p className="text-muted-foreground mt-1">{ex.text}</p>
                <Button asChild variant="outline" className="mt-3 hover-scale">
                  <Link to="/#apartments">Stay Here</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Experiences;
