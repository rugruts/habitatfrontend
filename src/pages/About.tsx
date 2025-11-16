import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { trackPageView } from "@/utils/analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, MapPin, Coffee, Star, ShieldCheck, Compass, Mail, Sparkles, Leaf, Users } from "lucide-react";
import expCastle from "@/assets/exp-castle.jpg";
import expMeteora from "@/assets/exp-meteora.jpg";
import expCafe from "@/assets/exp-cafe.jpg";
import ViberIcon from "@/components/ui/viber-icon";
import { useTranslation } from "@/hooks/useTranslation";

const values = [
  {
    icon: Heart,
    title: "Authentic Hospitality",
    description:
      "We believe in genuine connections and providing a warm, welcoming environment for all our guests.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Comfort",
    description:
      "From plush bedding to modern amenities, we prioritize quality and comfort to ensure a relaxing stay.",
  },
  {
    icon: Compass,
    title: "Local Expertise",
    description:
      "We offer insider knowledge and curated experiences to help you discover the best of Trikala.",
  },
];

const blocks = [
  {
    img: expCastle,
    title: "History & Culture",
    text: "Byzantine castle views, museums, and old-town charm.",
    link: "/about-trikala/history-culture",
  },
  {
    img: expMeteora,
    title: "Nature & Day Trips",
    text: "Riverside walks and iconic Meteora an hour away.",
    link: "/about-trikala/nature-day-trips",
  },
  {
    img: expCafe,
    title: "Local Life",
    text: "Cafés, markets, and the rhythm of everyday Trikala.",
    link: "/about-trikala/local-life",
  },
];

const highlights = [
  { icon: MapPin, title: "Prime Location", desc: "Walk everywhere" },
  { icon: Star, title: "Premium Quality", desc: "4.9 guest rating" },
  { icon: ShieldCheck, title: "Secure Booking", desc: "Instant confirmation" },
];

const reviews = [
  { name: "Alexandra, UK", text: "Immaculately clean with thoughtful local tips—felt like staying with friends." },
  { name: "Daniel, DE", text: "Stylish apartment in the center. The guide made our Meteora day trip effortless." },
  { name: "Maria, GR", text: "Great bed, quiet, with a fantastic coffee spot around the corner. We'll be back!" },
];

const About: React.FC = () => {
  const { t } = useTranslation();

  const highlights = [
    { icon: MapPin, title: t('about.primeLocation'), desc: "Walk everywhere" },
    { icon: Star, title: t('ui.premiumQuality'), desc: "4.9 guest rating" },
    { icon: ShieldCheck, title: "Secure Booking", desc: "Instant confirmation" },
  ];

  React.useEffect(() => {
    trackPageView("about-habitat-lobby");
  }, []);

  React.useEffect(() => {
    trackPageView("about-habitat-lobby");
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Habitat Lobby – Premium Apartments in Trikala, Greece"
        description="Discover Habitat Lobby, a collection of premium apartments in Trikala, Greece. Experience authentic local hospitality with modern comfort in the heart of Central Greece."
        canonical="/about"
        keywords={[
          "Habitat Lobby",
          "premium apartments Trikala",
          "Greece accommodation",
          "authentic hospitality",
          "Central Greece hotels",
          "Trikala apartments",
          "local experiences Greece",
          "modern comfort Greece",
          "Thessaly accommodation",
        ]}
      />

      {/* HERO (light variant for perfect contrast) */}
      <section aria-labelledby="about-hero" className="relative">
        <div className="container py-14 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge className="mb-3 bg-accent/10 text-accent border border-accent/20">Cozy Hospitality</Badge>
              <h1 id="about-hero" className="font-serif text-4xl md:text-5xl tracking-tight mb-5">
                {t("pages.about.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
                {t("pages.about.ourStoryDesc")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t("pages.about.ourMissionDesc")}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="default"
                  onClick={() => window.open("viber://chat?number=stefanos_habitat", "_blank")}
                  className="flex items-center gap-2 bg-[#7360F2] hover:bg-[#5d49e6] text-white"
                  aria-label="Chat with us on Viber"
                >
                  <ViberIcon className="h-4 w-4 text-white" />
                  <span>Viber Chat</span>
                </Button>
                <Button asChild variant="outline" className="border-foreground/20">
                  <Link to="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Contact Us</span>
                  </Link>
                </Button>
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <dt className="text-muted-foreground text-sm">Guest Rating</dt>
                  <dd className="text-2xl font-semibold flex items-center gap-1"><Star className="h-5 w-5 text-accent" aria-hidden />4.9/5</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm">Apartments</dt>
                  <dd className="text-2xl font-semibold">Curated</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm">Since</dt>
                  <dd className="text-2xl font-semibold">2019</dd>
                </div>
              </dl>
            </div>

            {/* Collage Card */}
            <div className="relative">
              <Card className="rounded-2xl shadow-xl bg-white border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    <img src={expCastle} alt="Trikala Byzantine castle" className="rounded-xl aspect-[4/3] object-cover" loading="lazy" />
                    <img src={expMeteora} alt="Meteora rock formations" className="rounded-xl aspect-[4/3] object-cover" loading="lazy" />
                    <img src={expCafe} alt="Local café culture" className="rounded-xl aspect-[4/3] object-cover" loading="lazy" />
                  </div>
                  <div className="mt-5">
                    <h3 className="font-serif text-2xl leading-tight">Our Promise</h3>
                    <p className="text-muted-foreground text-sm mt-1">Authentic experiences in Central Greece</p>
                  </div>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /><span>In the heart of Trikala</span></li>
                    <li className="flex items-center gap-2"><Heart className="h-4 w-4 text-accent" /><span>Passionate hosts</span></li>
                    <li className="flex items-center gap-2"><Coffee className="h-4 w-4 text-accent" /><span>Local tips & culture</span></li>
                    <li className="flex items-center gap-2"><Star className="h-4 w-4 text-accent" /><span>5‑star guest care</span></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Highlights strip */}
          <div className="mt-10 grid sm:grid-cols-3 gap-3">
            {highlights.map((h) => (
              <Card key={h.title} className="bg-white">
                <CardContent className="p-4 flex items-center gap-3">
                  <h.icon className="h-5 w-5 text-accent" />
                  <div>
                    <div className="text-sm font-medium">{h.title}</div>
                    <div className="text-xs text-muted-foreground">{h.desc}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="content" className="py-16 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">The Habitat Lobby Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              What started as a dream to share Trikala's authentic charm has grown into a carefully curated collection of apartments, each designed to offer guests a genuine taste of local life.
            </p>
          </div>

          {/* Timeline */}
          <ol className="mt-12 relative border-s border-gray-200 dark:border-gray-800 max-w-4xl mx-auto">
            {[
              {
                title: "Humble Beginnings",
                text: "Restoring our first city-center apartment with local craftspeople.",
                icon: Leaf,
                year: "2019",
              },
              {
                title: "Thoughtful Expansion",
                text: "Adding more spaces—each with its own personality, always guest-first.",
                icon: Sparkles,
                year: "2021",
              },
              {
                title: "Community & Experiences",
                text: "Curating neighborhood routes, tastings and day-trip ideas for guests.",
                icon: Users,
                year: "2023",
              },
            ].map((item) => (
              <li key={item.title} className="mb-10 ms-6">
                <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  {React.createElement(item.icon, { className: "h-3.5 w-3.5" })}
                </span>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="text-sm text-muted-foreground">{item.year}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{item.text}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Our Core Values</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Our commitment to these values ensures an exceptional experience for every guest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <value.icon className="h-10 w-10 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Micro‑trust badges */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> No surprise fees</div>
            <div className="flex items-center justify-center gap-2"><Star className="h-4 w-4 text-accent" /> 5‑star cleaning standards</div>
            <div className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Walkable locations</div>
          </div>
        </div>
      </section>

      {/* DISCOVER */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl">Discover Trikala with Us</h2>
            <p className="text-gray-600 mt-2">Explore themes to plan your stay.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {blocks.map((b) => (
              <Link
                key={b.title}
                to={b.link}
                className="rounded-xl overflow-hidden border hover:shadow-lg transition-shadow duration-300 group block bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`Read more about ${b.title}`}
              >
                <img
                  src={b.img}
                  alt={b.title}
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="font-serif text-xl md:text-2xl group-hover:text-accent transition-colors mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-sm">{b.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-14 bg-white" id="reviews">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl">Guest Reviews</h2>
            <p className="text-gray-600 mt-2">A few words from recent stays.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <Card key={r.name} className="h-full">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-1" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">“{r.text}”</p>
                  <span className="text-xs text-muted-foreground">{r.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK NAV (sticky) */}
      <nav className="sticky bottom-4 inset-x-0 z-40">
        <div className="container">
          <div className="mx-auto w-full sm:w-max flex gap-2 rounded-full bg-white/90 backdrop-blur border shadow p-2">
            <a href="#content" className="px-3 py-1.5 text-sm rounded-full hover:bg-muted">Story</a>
            <a href="#reviews" className="px-3 py-1.5 text-sm rounded-full hover:bg-muted">Reviews</a>
            <a href="#faq" className="px-3 py-1.5 text-sm rounded-full hover:bg-muted">FAQ</a>
            <a href="#contact" className="px-3 py-1.5 text-sm rounded-full hover:bg-muted">Contact</a>
          </div>
        </div>
      </nav>

      {/* FAQ */}
      <section className="py-16 bg-gray-50" id="faq">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-center">Good to Know</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Where exactly are the apartments?</AccordionTrigger>
                <AccordionContent>
                  We are in central Trikala—steps from cafés, the river, and historic quarters. Exact details are provided upon booking.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you offer local recommendations?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. You'll receive a curated digital guide with our favorite walks, restaurants, and day trips (including Meteora).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What makes Habitat Lobby different?</AccordionTrigger>
                <AccordionContent>
                  A small, passionate team focused on comfort and place—thoughtful design, spotless spaces, and genuine tips to live like a local.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="py-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">Ready to plan your stay?</h2>
            <p className="text-gray-600 mb-6">Reach out and we'll help you pick the perfect Habitat Lobby apartment.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="default" className="flex items-center gap-2">
                <Link to="/contact"><Mail className="h-4 w-4" /> Contact Us</Link>
              </Button>
              <Button
                variant="default"
                onClick={() => window.open("viber://chat?number=stefanos_habitat", "_blank")}
                className="flex items-center gap-2 bg-[#7360F2] hover:bg-[#5d49e6] text-white"
              >
                <ViberIcon className="h-4 w-4 text-white" /> Viber chat
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://maps.app.goo.gl/", "_blank")}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" /> Open map
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
