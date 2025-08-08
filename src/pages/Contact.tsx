import React from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";

const Contact: React.FC = () => {
  const { toast } = useToast();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    toast({ title: "Message sent", description: "We’ll get back to you shortly." });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Contact Habitat Lobby – Trikala</title>
        <meta name="description" content="Get in touch with Habitat Lobby in Trikala, Greece. We’re here to help you plan the perfect stay." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/contact" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Habitat Lobby',
          url: 'https://habitat-lobby.lovable.app',
          contactPoint: [{ '@type': 'ContactPoint', email: 'hello@habitatlobby.com', contactType: 'customer service' }]
        })}</script>
      </Helmet>

      <section className="container py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-5xl">Contact</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Email hello@habitatlobby.com or send a message below.</p>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6 mt-8 max-w-3xl">
          <div className="col-span-1">
            <label className="text-sm">Name</label>
            <Input name="name" required className="mt-1" />
          </div>
          <div className="col-span-1">
            <label className="text-sm">Email</label>
            <Input type="email" name="email" required className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Message</label>
            <Textarea name="message" required rows={6} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" variant="hero">Send Message</Button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
