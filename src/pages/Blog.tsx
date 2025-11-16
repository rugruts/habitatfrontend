import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import hero from "@/assets/hero-trikala.jpg";

const posts = [
  { title: "A Perfect Day in Trikala", excerpt: "Bikes, bridges, and riverside coffee.", img: hero },
  { title: "Meteora Side Trip Guide", excerpt: "How to plan an easy day from Trikala.", img: hero },
  { title: "Hidden Cafes by the River", excerpt: "Three spots we love for slow mornings.", img: hero },
];

const Blog: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Stories from Trikala – Habitat Lobby Blog</title>
        <meta name="description" content="Local stories and slow‑travel ideas from Trikala by Habitat Lobby." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/blog" />
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">Stories from Trikala</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">A travel‑magazine stream of tips and inspiration.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {posts.map((p) => (
            <Card key={p.title} className="overflow-hidden animate-fade-in">
              <img src={p.img} alt={p.title} className="h-56 w-full object-cover" loading="lazy" />
              <CardContent className="pt-4">
                <h2 className="font-display text-xl">{p.title}</h2>
                <p className="text-muted-foreground mt-1">{p.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </main>
  );
};

export default Blog;
