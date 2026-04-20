import { SOCIAL_LINKS } from "@shared/constants";
import Layout from "@/components/Layout";

export default function Contact() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            Écrivez-moi
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            Contact
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Vous avez des questions ? Je serais ravie de vous répondre.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
                Mes coordonnées
              </h2>

              <div className="space-y-8">
                {/* Email */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="text-accent hover:text-accent-foreground transition-colors text-lg"
                  >
                    {SOCIAL_LINKS.email}
                  </a>
                  <p className="text-muted-foreground text-sm mt-2">
                    Réponse généralement sous 24h
                  </p>
                </div>

                {/* Instagram */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Instagram
                  </h3>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-foreground transition-colors text-lg"
                  >
                    @lestiragesdemarie
                  </a>
                  <p className="text-muted-foreground text-sm mt-2">
                    Suivez-moi pour des guidances quotidiennes
                  </p>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Disponibilités
                  </h3>
                  <p className="text-muted-foreground">
                    Lundi au samedi, 10h - 19h (heure de Paris)
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Consultations sur rendez-vous
                  </p>
                </div>

                {/* Response Time */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">
                    Temps de réponse
                  </h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Email : 24h</li>
                    <li>• Demande de livret : 3-5 jours</li>
                    <li>• Rendez-vous : confirmation sous 48h</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
                Vous cherchez ?
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Commander un livret",
                    description: "Obtenez votre livret astral personnalisé",
                    link: "/booklet",
                  },
                  {
                    title: "Réserver un rendez-vous",
                    description: "Prenez rendez-vous pour une consultation",
                    link: "/booking",
                  },
                  {
                    title: "En savoir plus",
                    description: "Découvrez mon parcours et mes services",
                    link: "/about",
                  },
                  {
                    title: "Lire le blog",
                    description: "Explorez des articles sur l'astrologie",
                    link: "/blog",
                  },
                  {
                    title: "Questions fréquentes",
                    description: "Trouvez les réponses à vos questions",
                    link: "/faq",
                  },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    className="block bg-card rounded-lg p-6 border border-border hover:border-accent transition-colors hover:shadow-md"
                  >
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Un message pour Marie ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vous pouvez me contacter directement par email ou via Instagram. Je prends le temps de lire chaque message et de répondre personnellement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
            >
              Envoyer un email
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-center"
            >
              Me suivre sur Instagram
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
