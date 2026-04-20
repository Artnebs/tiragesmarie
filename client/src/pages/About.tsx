import { Link } from "wouter";
import { ROUTES } from "@shared/constants";
import Layout from "@/components/Layout";

const MARIE_PORTRAIT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/marie-portrait-KCBi2bVqXk6y7uw7QxinkA.webp";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            Qui suis-je
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            À propos de <span className="italic text-accent">Marie</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Mon parcours, ma philosophie et ma passion pour l'astrologie et la
            guidance spirituelle.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="flex justify-center">
              <img
                src={MARIE_PORTRAIT}
                alt="Marie"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Mon histoire
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Depuis l'enfance, j'ai été fascinée par les mystères de l'univers et les patterns qui structurent notre existence. L'astrologie m'a offert un langage pour comprendre ces patterns et accompagner les autres dans leur quête de sens.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Après 15 ans de pratique et d'études approfondies, j'ai développé une approche unique qui combine l'astrologie traditionnelle avec une écoute bienveillante et une guidance spirituelle adaptée à chaque personne.
              </p>
              <p className="text-lg text-muted-foreground">
                Aujourd'hui, je me consacre à aider les personnes à découvrir leur véritable nature cosmique et à naviguer leur destinée avec clarté et confiance.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12 text-center">
              Mes valeurs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "✨",
                  title: "Authenticité",
                  description:
                    "Je crois en l'importance d'être vrai avec vous-même et avec les autres. Chaque consultation est une conversation authentique.",
                },
                {
                  icon: "🌙",
                  title: "Bienveillance",
                  description:
                    "Mon approche est toujours bienveillante et respectueuse. Je suis ici pour vous soutenir, pas pour juger.",
                },
                {
                  icon: "💫",
                  title: "Transformation",
                  description:
                    "L'objectif de chaque séance est votre transformation positive. Je veux que vous repartiez avec plus de clarté et de confiance.",
                },
              ].map((value, idx) => (
                <div key={idx} className="bg-card rounded-lg p-8 shadow-sm text-center">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div className="bg-card rounded-lg p-8 md:p-12 mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Mon expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Domaines de spécialité
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Astrologie natale et thème de naissance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Transits et progressions astrologiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Guidance spirituelle et développement personnel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Tirage de cartes et lectures intuitives</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Formations et certifications
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Certification en Astrologie Traditionnelle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Formation en Guidance Spirituelle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Études en Psychologie et Développement Personnel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>Pratique continue et auto-développement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Prêt à commencer votre voyage ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Je serais honorée de vous accompagner dans l'exploration de votre univers astrologique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.BOOKLET}>
                <a className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center">
                  Livret astral
                </a>
              </Link>
              <Link href={ROUTES.BOOKING}>
                <a className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-center">
                  Rendez-vous
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
