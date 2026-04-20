import { Link } from "wouter";
import { ROUTES, SERVICES } from "@shared/constants";
import Layout from "@/components/Layout";

const HERO_BACKGROUND =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/hero-background-eheYopB4dnj22rr2bLjRfg.webp";
const MARIE_PORTRAIT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/marie-portrait-KCBi2bVqXk6y7uw7QxinkA.webp";
const ZODIAC_ILLUSTRATION =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/zodiac-illustration-bWCHQ8rxgfJCxxZDo8Bsnt.webp";
const DIVIDER_ORNAMENT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/divider-ornament-3vxRTuTF7V3XsreATpDPpT.webp";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BACKGROUND})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Découvrez votre destinée astrologique
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Des guidances spirituelles personnalisées et des livrets astrologiques uniques pour éclairer votre chemin.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={ROUTES.BOOKLET}>
                <a className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center">
                  Commander un livret astral
                </a>
              </Link>
              <Link href={ROUTES.BOOKING}>
                <a className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-center">
                  Réserver un rendez-vous
                </a>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-bounce text-accent text-3xl">↓</div>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src={MARIE_PORTRAIT}
                alt="Marie"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Bienvenue, je suis Marie
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Depuis plus de 15 ans, j'accompagne les personnes dans leur quête de sens et de compréhension de leur destinée astrologique.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Mon approche combine l'astrologie traditionnelle avec une écoute bienveillante et une guidance spirituelle adaptée à votre situation unique.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Chaque consultation et chaque livret est créé avec intention et respect pour vous offrir des insights profonds et transformateurs.
              </p>
              <Link href={ROUTES.ABOUT}>
                <a className="inline-block px-6 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                  En savoir plus sur mon parcours
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Mes prestations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trois services complémentaires pour explorer votre univers astrologique et recevoir des guidances adaptées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <Link href={ROUTES.SERVICES}>
                  <a className="inline-block text-accent font-semibold hover:text-accent-foreground transition-colors">
                    Découvrir →
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Explorez votre profil astrologique
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Votre signe solaire, votre signe lunaire et votre ascendant forment une trinité astrologique unique qui définit votre essence.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Grâce à un livret astral personnalisé, découvrez les influences planétaires qui façonnent votre destinée et reçevez des guidances adaptées à votre profil cosmique.
              </p>
              <Link href={ROUTES.BOOKLET}>
                <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Commander votre livret
                </a>
              </Link>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <img
                src={ZODIAC_ILLUSTRATION}
                alt="Zodiaque"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Témoignages
            </h2>
            <p className="text-lg text-muted-foreground">
              Ce que mes clients disent de leur expérience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie",
                text: "Le livret astral m'a offert une perspective complètement nouvelle sur ma vie. Les insights étaient profonds et justes.",
              },
              {
                name: "Julien",
                text: "Marie a une capacité remarquable à capturer l'essence de mon profil astrologique. Vraiment transformateur.",
              },
              {
                name: "Émilie",
                text: "Les guidances reçues lors de ma consultation m'ont aidée à prendre des décisions importantes avec plus de clarté.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-card rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-foreground">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-accent-foreground mb-6">
            Prêt à explorer votre destinée ?
          </h2>
          <p className="text-lg text-accent-foreground mb-8 max-w-2xl mx-auto opacity-90">
            Commencez votre voyage astrologique aujourd'hui avec un livret personnalisé ou une consultation privée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.BOOKLET}>
              <a className="px-8 py-4 bg-accent-foreground text-accent rounded-lg font-semibold hover:opacity-90 transition-opacity text-center">
                Livret astral
              </a>
            </Link>
            <Link href={ROUTES.BOOKING}>
              <a className="px-8 py-4 border-2 border-accent-foreground text-accent-foreground rounded-lg font-semibold hover:bg-accent-foreground hover:text-accent transition-colors text-center">
                Rendez-vous
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
