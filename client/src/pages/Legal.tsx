import { useLocation } from "wouter";
import Layout from "@/components/Layout";

export default function Legal() {
  const [location] = useLocation();
  const isMentions = location === "/mentions-legales";

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {isMentions ? "Mentions légales" : "Politique de confidentialité"}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert">
            {isMentions ? (
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Informations légales
                  </h2>
                  <p>
                    Ce site est édité par Marie, praticienne en astrologie et guidance spirituelle.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Responsable du site
                  </h2>
                  <p>
                    <strong>Nom :</strong> Marie<br />
                    <strong>Email :</strong> marie@lestiragesdemarie.fr<br />
                    <strong>Activité :</strong> Astrologie et Guidance Spirituelle
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Hébergement
                  </h2>
                  <p>
                    Ce site est hébergé par Manus, plateforme de création de sites web.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Propriété intellectuelle
                  </h2>
                  <p>
                    Tous les contenus du site (textes, images, graphiques) sont la propriété de Marie ou utilisés avec autorisation. Toute reproduction ou utilisation sans autorisation est interdite.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Limitation de responsabilité
                  </h2>
                  <p>
                    Les services d'astrologie et de guidance spirituelle proposés sur ce site sont à titre informatif et spirituel. Ils ne remplacent pas un avis médical, juridique ou professionnel. Marie ne peut être tenue responsable des décisions prises en fonction des consultations ou des livrets astrologiques.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Liens externes
                  </h2>
                  <p>
                    Ce site peut contenir des liens vers d'autres sites. Marie n'est pas responsable du contenu de ces sites externes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Modification des conditions
                  </h2>
                  <p>
                    Marie se réserve le droit de modifier ces mentions légales à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Politique de confidentialité
                  </h2>
                  <p>
                    Cette politique décrit comment Marie collecte, utilise et protège vos données personnelles.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Données collectées
                  </h2>
                  <p>
                    Nous collectons les données suivantes lorsque vous :
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-3">
                    <li>Commandez un livret astral : prénom, nom, date/heure/lieu de naissance, email</li>
                    <li>Réservez un rendez-vous : prénom, nom, email, téléphone, date souhaitée</li>
                    <li>Nous contactez : votre message et coordonnées</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Utilisation des données
                  </h2>
                  <p>
                    Vos données sont utilisées pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-3">
                    <li>Préparer et envoyer votre livret astral</li>
                    <li>Confirmer et gérer votre rendez-vous</li>
                    <li>Vous contacter concernant votre commande ou consultation</li>
                    <li>Améliorer nos services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Protection des données
                  </h2>
                  <p>
                    Vos données sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement. Nous utilisons des mesures de sécurité standard pour protéger vos informations.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Cookies
                  </h2>
                  <p>
                    Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez les désactiver dans les paramètres de votre navigateur.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Vos droits
                  </h2>
                  <p>
                    Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles. Pour exercer ces droits, contactez-moi à marie@lestiragesdemarie.fr.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Emails marketing
                  </h2>
                  <p>
                    Nous ne vous enverrons pas d'emails marketing sans votre consentement explicite. Vous pouvez vous désabonner à tout moment en cliquant sur le lien de désinscription dans nos emails.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Modification de cette politique
                  </h2>
                  <p>
                    Cette politique peut être modifiée à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Contact
                  </h2>
                  <p>
                    Pour toute question concernant cette politique, contactez-moi à marie@lestiragesdemarie.fr.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
