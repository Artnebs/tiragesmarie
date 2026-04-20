import { Link } from "wouter";
import { ROUTES, SERVICES } from "@shared/constants";
import Layout from "@/components/Layout";

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[30%] left-[12%] text-accent/70 text-xl float-slow">✦</span>
          <span className="absolute top-[55%] right-[14%] text-accent/60 text-lg float-slow" style={{ animationDelay: "2.5s" }}>✧</span>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            Prestations
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            Mes <span className="italic text-accent">prestations</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Trois services complémentaires pour explorer votre univers
            astrologique et recevoir des guidances adaptées à votre destinée.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Service 1: Readings */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                  Tirages & Guidances
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Recevez des lectures intuitives et des guidances personnalisées pour éclairer votre chemin et répondre à vos questions.
                </p>
                <ul className="space-y-3 mb-8 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✨</span>
                    <span>Lectures adaptées à votre situation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✨</span>
                    <span>Guidances spirituelles bienveillantes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✨</span>
                    <span>Clarté et perspectives nouvelles</span>
                  </li>
                </ul>
                <Link href={ROUTES.BOOKING}>
                  <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Réserver une séance
                  </a>
                </Link>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-muted-foreground">
                  Chaque tirage est une conversation entre votre énergie et l'univers, révélant les messages dont vous avez besoin d'entendre.
                </p>
              </div>
            </div>
          </div>

          {/* Service 2: Booklet */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-card rounded-lg p-8 shadow-sm md:order-2">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-muted-foreground">
                  Un document complet et élégant analysant votre profil astrologique unique, vos influences planétaires et votre destinée cosmique.
                </p>
              </div>
              <div className="md:order-1">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                  Livret Astral Personnalisé
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Découvrez une analyse complète de votre profil astrologique dans un livret élégant et personnalisé.
                </p>
                <ul className="space-y-3 mb-8 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">📖</span>
                    <span>Analyse de votre signe solaire, lunaire et ascendant</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">📖</span>
                    <span>Positions planétaires et influences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">📖</span>
                    <span>Guidances spécifiques à votre profil</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">📖</span>
                    <span>Format PDF ou PowerPoint éditable</span>
                  </li>
                </ul>
                <Link href={ROUTES.BOOKLET}>
                  <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Commander un livret
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3: Consultation */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                  Consultations Privées
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Des séances en profondeur pour explorer votre destinée, vos cycles de vie et les influences cosmiques actuelles.
                </p>
                <ul className="space-y-3 mb-8 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">🌙</span>
                    <span>Exploration approfondie de votre thème natal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">🌙</span>
                    <span>Analyse des transits actuels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">🌙</span>
                    <span>Guidance pour les décisions importantes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">🌙</span>
                    <span>Suivi personnalisé et continu</span>
                  </li>
                </ul>
                <Link href={ROUTES.BOOKING}>
                  <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Prendre rendez-vous
                  </a>
                </Link>
              </div>
              <div className="bg-card rounded-lg p-8 shadow-sm">
                <div className="text-6xl mb-4">🌙</div>
                <p className="text-muted-foreground">
                  Une consultation est un moment privilégié d'échange et de découverte où nous explorons ensemble les mystères de votre destinée cosmique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Comment ça fonctionne ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Vous choisissez",
                description: "Sélectionnez le service qui vous attire et remplissez le formulaire avec vos informations.",
              },
              {
                step: "2",
                title: "Je prépare",
                description: "Je prépare votre consultation ou livret avec attention et intention, en fonction de votre profil.",
              },
              {
                step: "3",
                title: "Vous recevez",
                description: "Recevez votre livret, vos guidances ou confirmation de rendez-vous directement par email.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choisissez le service qui résonne le plus avec vous et commencez votre voyage astrologique.
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
      </section>
    </Layout>
  );
}
